'use strict';

/**
 * donor service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::donor.donor');
