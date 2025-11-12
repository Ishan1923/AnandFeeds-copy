  'use strict';

  /**
   * review controller
   */

  const { createCoreController } = require('@strapi/strapi').factories;

  module.exports = createCoreController('api::review.review', ({ strapi }) => ({
    // Override the default 'create' action
    async create(ctx) {
      const { title, reviewText, rating, email, product_id } = ctx.request.body;

      // Step 1: Find the user by email
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: { email },
      });

      console.log(user);
      
      if (!user) {
        return ctx.badRequest('User not found');
      }

      // Step 2: Check if the user has purchased the product AND responseCode is "success"
      const order = await strapi.query('api::order.order').findOne({
        where: {
          user: user.id,
          responseCode: 'success', // ✅ Add this condition
          products: {
            id: product_id,
          },
        },
      });
      console.log(order);
      
      if (!order) {
        return ctx.badRequest('You have not purchased this product or the order was not successful');
      }

      // Step 3: Proceed to create the review
      const review = await strapi.entityService.create('api::review.review', {
        data: {
          title,
          review_text: reviewText,
          rating,
          user: user.id,
          product: {
            connect: [{ id: product_id }] 
          },
        },
      });
      console.log(review);
      
      // Step 4: Return the created review
      return ctx.created(review);
    },
  }));
