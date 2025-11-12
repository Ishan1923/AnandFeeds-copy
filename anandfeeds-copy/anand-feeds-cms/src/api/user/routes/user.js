module.exports = {
    routes: [
      {
        method: "POST",
        path: "/users", // The endpoint URL (e.g., /api/store-user)
        handler: "user.index", // This links to `index` in `store-user.js` in the controllers folder
        config: {
          policies: [], // Apply policies if needed
          middlewares: [], // Apply middlewares if needed
        },
      },
    ],
  };
  