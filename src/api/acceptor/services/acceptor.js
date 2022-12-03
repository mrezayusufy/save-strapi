'use strict';

/**
 * acceptor service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::acceptor.acceptor');
