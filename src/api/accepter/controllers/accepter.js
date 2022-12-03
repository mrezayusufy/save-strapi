'use strict';

/**
 * accepter controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::accepter.accepter', ({ strapi }) => ({
  async findByPhone(ctx) {
    const { phone } = ctx.params;
    const query = {
      filters: {phone},
      ...ctx.query
    }
    const entity = await strapi.entityService.findMany("api::accepter.accepter", query);
    const sanitizedEntity = await this.sanitizeOutput(entity);
    return this.transformResponse(sanitizedEntity[0])
  }
}));
