'use strict';

/**
 * user controller
 */
const { sanitizeEntity } = require('strapi-utils');
const sanitizeUser = user =>
  sanitizeEntity(user, {
    model: strapi.query('user', 'users-permissions').model,
  });

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = {
  /**
   * Retrieve authenticated user.
   * @return {Object|Array}
   */
  async me(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.badRequest(null, [{ messages: [{ id: 'No authorization header was found' }] }]);
    }
    const userFound = await strapi.query('user').findOne({ user: user.id }, []);
    const withUserFound = { ...user, userFound }

    const data = sanitizeUser(withUserFound);
    ctx.send(data);
  }
};
