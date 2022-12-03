'use strict';

/**
 * client controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::client.client', ({strapi}) => ({
  async findByPhone(ctx) {
    const { phone } = ctx.params;
    const query = {
      filters : { phone },
      ...ctx.query
    }
    const entity = await strapi.entityService.findMany("api::client.client",query);
    const sanitizedEntity = await this.sanitizeOutput(entity);
    return this.transformResponse(sanitizedEntity[0]);
  }
}));
