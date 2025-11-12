"use strict";

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async createOrder(ctx) {
    try {
      const { name, email, phoneNumber, street, city, state, pincode, locality, amount, order_email, merchantTransactionId } = ctx.request.body;

      // Validate request
      if (!email) {
        return ctx.badRequest("Missing required fields");
      }

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

      console.log("cart", cart)

      const cartItems = cart.cart_items;

      // Extract product IDs from cartItems
      const productEntries = cartItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
        price: item.productPrice,
        weight: item.weight,
        image: item.image,
      }));
      console.log("product entries", productEntries);


      // Create order in Strapi database
      const newOrder = await strapi.entityService.create("api::order.order", {
        data: {
          name,
          email: order_email,
          phoneNumber,
          merchantTransactionId,
          transactionId: merchantTransactionId,
          street,
          city,
          state,
          pincode,
          locality,
          amount: amount,
          responseCode: "PENDING",
          products: productEntries.map(item => item.productId), // Linking products properly
          user: user.id
        },
      });

      // console.log(newOrder)

      return ctx.created(newOrder);
    } catch (error) {
      console.error("Error creating order:", error);
      return ctx.internalServerError("Something went wrong");
    }
  },

  async updateOrder(ctx) {
    try {
      const { id } = ctx.params;
      console.log(id);

      const { responseCode } = ctx.request.body;
      console.log(ctx.request.body);

      const updatedOrder = await strapi.db.query("api::order.order").update({
        where: {
          merchantTransactionId
            : id
        },
        data: { responseCode: responseCode },
      });

      return ctx.send({ message: "Order updated successfully", updatedOrder });
    } catch (error) {
      console.error("Error updating order:", error);
      return ctx.internalServerError("Something went wrong");
    }
  },
  async getOrders(ctx) {
    try {
      const { email } = ctx.params;

      // Step 1: Find the user by email
      const user = await strapi.query("plugin::users-permissions.user").findOne({
        where: { email },
      });

      if (!user) {
        return ctx.notFound("User not found");
      }

      // Step 2: Find orders for that user
      const orders = await strapi.db.query("api::order.order").findMany({
        where: {
          user: user.id,
          responseCode: "SUCCESS",
        },
        populate: ["products", "user"],
      });

      return ctx.send({ orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      return ctx.internalServerError("Something went wrong");
    }
  }


}));
