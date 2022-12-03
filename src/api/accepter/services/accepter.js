'use strict';

/**
 * accepter service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::accepter.accepter');
