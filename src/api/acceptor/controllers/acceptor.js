'use strict';

/**
 * acceptor controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::acceptor.acceptor');
