module.exports = {
    routes: [
      {
        method: "POST",
        path: "/orders",
        handler: "order.createOrder",
        config: {
          auth: false, // Set to true if authentication is required
        },
      },
      {
        method:"PUT",
        path:"/orders/:id",
        handler:"order.updateOrder",
        config:{
          auth:false
        }
      },
      {
        method:"GET",
        path:"/orders/:email",
        handler:"order.getOrders",
        config:{
          auth:false
        }
      },
    ],
  };
  