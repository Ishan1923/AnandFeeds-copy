/**
 * review router
 */

module.exports = {
  routes: [
    {
      method: "POST",
      path: "/reviews",
      handler: "review.create", // Points to the custom 'create' method in the controller
      config: {
        auth: false, 
      },
    },
    // {
    //   method: "GET",
    //   path: "/reviews/:productId",
    //   handler: "review.find", // Default 'find' method for fetching reviews for a product
    //   config: {
    //     auth: false, 
    //   },
    // },
  ],
};
