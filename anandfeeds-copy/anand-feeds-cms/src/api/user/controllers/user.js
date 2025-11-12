module.exports = {
    async index(ctx) {
      try {
        const { username, email, provider } = ctx.request.body;
  
        if (!username || !email) {
          return ctx.badRequest("Missing required fields");
        }
        
        const newUser = await strapi.plugins["users-permissions"].services.user.add({
          username,
          email,
          provider,
        });
  
        ctx.send({
          message: "User created successfully",
          user: newUser,
        });
      } catch (error) {
        console.error("Error in store-user controller:", error);
        ctx.throw(500, "An error occurred while creating the user");
      }
    },
  };
  