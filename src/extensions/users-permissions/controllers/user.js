'use strict';

/**
 * User.js controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const utils = require('@strapi/utils');
const { getService } = require('../utils');
const { validateCreateUserBody, validateUpdateUserBody } = require('./validation/user');

const { sanitize } = utils;
const { ApplicationError, ValidationError, NotFoundError } = utils.errors;

const sanitizeOutput = (user, ctx) => {
  const schema = strapi.getModel('plugin::users-permissions.user');
  const { auth } = ctx.state;

  return sanitize.contentAPI.output(user, schema, { auth });
};

module.exports = {
  async my(ctx) {
    const authUser = ctx.state.user;
    const { query } = ctx;

    if (!authUser) {
      return ctx.unauthorized();
    }

    const user = await getService('user').fetch(authUser.id, query);

    ctx.body = await sanitizeOutput(user, ctx);
  },
}