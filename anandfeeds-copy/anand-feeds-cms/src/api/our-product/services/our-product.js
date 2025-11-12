'use strict';

/**
 * our-product service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::our-product.our-product');
