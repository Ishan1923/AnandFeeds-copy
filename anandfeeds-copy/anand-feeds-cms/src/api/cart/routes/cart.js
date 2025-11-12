module.exports = {
    routes: [
      // Route for adding product to the cart
      {
        method: "POST",
        path: "/carts",
        handler: "cart.create",
        config: {
          auth: false,
        },
      },
      {
        method: "POST",
        path: "/cart/user",
        handler: "cart.findUserCart", 
        config: {
          auth: false, 
        },
      },
      {
        method: "POST",  
        path: "/cart/remove",
        handler: "cart.removeFromCart",
        config: { auth: false },
      },
    ],
  };
  