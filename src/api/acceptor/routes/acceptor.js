'use strict';

/**
 * acceptor router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter('api::acceptor.acceptor');
