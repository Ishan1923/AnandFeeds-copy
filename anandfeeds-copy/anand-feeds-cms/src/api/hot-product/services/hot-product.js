'use strict';

/**
 * hot-product service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::hot-product.hot-product');
