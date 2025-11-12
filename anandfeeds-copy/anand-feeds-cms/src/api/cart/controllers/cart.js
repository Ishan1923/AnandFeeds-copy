"use strict";

/**
 * cart controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::cart.cart", ({ strapi }) => ({
  // Create method (for adding a product to the cart)

  async create(ctx) {
    try {
      const { email, product, quantity, price, image } = ctx.request.body; // Get selected quantity
      console.log(price);

      // Find the user by email
      const user = await strapi.query("plugin::users-permissions.user").findOne({
        where: { email },
      });

      if (!user) {
        return ctx.badRequest("User not found");
      }

      // Find the user's cart
      let cart = await strapi.query("api::cart.cart").findOne({
        where: { user: user.id },
        populate: ["cart_items"],
      });

      if (!cart) {
        // Create a new cart if it doesn't exist
        cart = await strapi.entityService.create("api::cart.cart", {
          data: {
            user: user.id,
            name: `${user.username}'s Cart`,
          },
        });
      }

      // Find the product by ID
      const foundProduct = await strapi.entityService.findOne("api::product.product", product, {
        populate: ["price_options"], // Populating related price options
      });

      console.log("found product", foundProduct, quantity);

      if (!foundProduct) {
        return ctx.badRequest("Product not found");
      }

      const { name, productPrice } = foundProduct;

      let finalPrice = foundProduct.price;

      if (foundProduct.isVariableQuantity) {
        const matchingPriceOption = foundProduct.price_options.find(option => option.quantity === quantity);

        if (matchingPriceOption) {
          finalPrice = matchingPriceOption.price;
        }
      }


      // console.log("Selected Quantity:", quantity);
      // console.log("Product Name:", name);
      // console.log("Product Price:", productPrice);

      // ✅ Check if the product with the same **name and weight** already exists in the cart
      let existingCartItem = cart.cart_items.find(
        (item) => item.productTitle === name && item.weight === quantity
      );

      if (existingCartItem) {
        // Increase quantity instead of replacing it
        await strapi.entityService.update("api::cart-item.cart-item", existingCartItem.id, {
          data: { quantity: existingCartItem.quantity + 1 }, // Increase quantity
        });

        return ctx.send({ message: "Product quantity updated in cart", updated: true });
      } else {
        // Add new product as a separate entry with the selected weight
        const cartItem = await strapi.entityService.create("api::cart-item.cart-item", {
          data: {
            productTitle: name,
            quantity: 1, // Start with 1
            productPrice: finalPrice,
            cart: cart.id,
            weight: quantity, // Store weight separately
            image: image,
            product: foundProduct.id,
          },
        });

        return ctx.send({ message: "Product added to cart", cartItem });
      }
    } catch (error) {
      console.error(error);
      return ctx.internalServerError("Something went wrong");
    }

  },

  // Find method (for fetching cart items of a user based on email)
  async findUserCart(ctx) {
    try {
      const { email } = ctx.request.body; // Get email from request body

      if (!email) {
        return ctx.badRequest("Email is required");
      }

      // Find the user by email
      const user = await strapi.query("plugin::users-permissions.user").findOne({
        where: { email },
      });

      if (!user) {
        return ctx.badRequest("User not found");
      }

      // Find the user's cart and populate cart items and their product details
      const cart = await strapi.query("api::cart.cart").findOne({
        where: { user: user.id },
        populate: {
          cart_items: {
            populate: ["product"],
          },
        },
      });

      if (!cart) {
        return ctx.send({ message: "Cart is empty", cartItems: [] });
      }

      // console.log("Cart Items:", cart.cart_items);

      // Extract cart items (title, price, and quantity)
      const cartItems = cart.cart_items.map((item) => ({
        productTitle: item.productTitle,
        productPrice: item.productPrice,
        quantity: item.quantity,
        weight: item.weight,
        image: item.image,
        product: item.product

      }));

      return ctx.send({ cartItems });

    } catch (error) {
      console.error(error);
      return ctx.internalServerError("Something went wrong");
    }
  },

  async removeFromCart(ctx) {
    try {
      console.log("Request Body:", ctx.request.body);

      const { email, productTitle } = ctx.request.body;

      if (!email || !productTitle) {
        return ctx.badRequest("Email and Product Title are required");
      }

      // Fetch user
      const users = await strapi.entityService.findMany("plugin::users-permissions.user", {
        filters: { email },
        limit: 1,
      });
      const user = users[0];

      if (!user) {
        return ctx.badRequest("User not found");
      }

      // Fetch user cart
      const carts = await strapi.entityService.findMany("api::cart.cart", {
        filters: { user: user.id },
        populate: ["cart_items"],
      });

      const cart = carts[0];

      console.log("Cart Data:", cart);

      if (!cart) {
        return ctx.badRequest("Cart not found");
      }

      // Find the cart item to remove by product title
      const cartItem = cart.cart_items.find((item) => item.productTitle === productTitle);

      if (!cartItem) {
        return ctx.badRequest("Product not found in cart");
      }

      // Delete the cart item
      await strapi.entityService.delete("api::cart-item.cart-item", cartItem.id);
      console.log(`Deleted item: ${cartItem.id}`);

      // Fetch updated cart
      const updatedCart = await strapi.entityService.findMany("api::cart.cart", {
        filters: { user: user.id },
        populate: ["cart_items"],
      });

      return ctx.send({ message: "Product removed from cart", updatedCart });
    } catch (error) {
      console.error("Error in removeFromCart:", error);
      return ctx.internalServerError("Something went wrong");
    }
  },


}));
