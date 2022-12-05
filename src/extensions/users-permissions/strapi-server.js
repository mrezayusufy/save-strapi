const _ = require('lodash');
const utils = require("@strapi/utils");
const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// validation
const { yup, validateYupSchema } = require('@strapi/utils');
const registerBodySchema = yup.object().shape({
  phone: yup.string().required(),
  password: yup.string().required(),
});
function validatePassword(password, hash) {
  return bcrypt.compare(password, hash);
}
const validateRegisterBody = validateYupSchema(registerBodySchema);
const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel('plugin::users-permissions.user');

  return sanitize.contentAPI.output(user, userSchema, { auth });
};
// controllers
module.exports = (plugin) => {
  // JWT issuer
  const issue = (payload, jwtOptions = {}) => {
    _.defaults(jwtOptions, strapi.config.get('plugin.users-permissions.jwt'));
    return jwt.sign(
      _.clone(payload.toJSON ? payload.toJSON() : payload),
      strapi.config.get('plugin.users-permissions.jwtSecret'),
      jwtOptions
    );
  };
  // login
  plugin.controllers.auth.callback = async (ctx) => {
    const provider = ctx.params.provider || 'local';
    const params = ctx.request.body;

    const store = strapi.store({ type: 'plugin', name: 'users-permissions' });
    const grantSettings = await store.get({ key: 'grant' });

    const grantProvider = provider === 'local' ? 'email' : provider;

    if (!_.get(grantSettings, [grantProvider, 'enabled'])) {
      throw new ApplicationError('This provider is disabled');
    }

    if (provider === 'local') {
      await validateRegisterBody(params);

      const { phone } = params;

      // Check if the user exists.
      const user = await strapi.query('plugin::users-permissions.user').findOne({
        where: {
          provider,
          $or: [{ phone: phone }, { username: phone }],
        },
      });

      if (!user) {
        throw new ValidationError('Invalid phone or password');
      }

      if (!user.password) {
        throw new ValidationError('Invalid phone or password');
      }

      const validPassword = await validatePassword(
        params.password,
        user.password
      );

      if (!validPassword) {
        throw new ValidationError('Invalid password');
      }

      const advancedSettings = await store.get({ key: 'advanced' });

      if (user.blocked === true) {
        throw new ApplicationError('Your account has been blocked by an administrator');
      }

      return ctx.send({
        jwt: issue({ id: user.id }),
        user: await sanitizeUser(user, ctx),
      });
    }
    
  }
  plugin.controllers.auth.register = async (ctx) => {

    const pluginStore = await strapi.store({ type: 'plugin', name: 'users-permissions' });

    const settings = await pluginStore.get({ key: 'advanced' });

    const params = {
      ..._.omit(ctx.request.body, [
        'confirmed',
        'blocked',
        'confirmationToken',
        'resetPasswordToken',
        'provider',
      ]),
      provider: 'local',
    };
    const { role, phone } = params;

    await validateRegisterBody(params);
    // find role object by role
    const assignRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: role } });

    if (!assignRole) {
      throw new ApplicationError('Impossible to find the default role');
    }
    // prevent from duplicate phone numbers
    const userWithSamePhone = await strapi
      .query("plugin::users-permissions.user")
      .findOne({ where: { phone: phone } });
    if (userWithSamePhone) {
      throw new ApplicationError("The phone number is already taken");
    }


    const newUser = {
      ...params,
      role: assignRole.id,
      userRole: role,
      email: phone + "@mail.com",
      username: phone,
      provider: "local",
      confirmed: !settings.email_confirmation,
    };

    const user = await strapi
      .query('plugin::users-permissions.user')
      .create({ data: newUser });

    const sanitizedUser = await sanitizeUser(user, ctx);


    const jwt = issue(_.pick(user, ['id']));

    return ctx.send({
      jwt,
      user: sanitizedUser,
    });
  }

  plugin.controllers.role.findByType = async (ctx) => {
    const { type } = ctx.params;
    const role = await strapi
      .query("plugin::users-permissions.role")
      .findOne({ where: { type: type } });
    ctx.body = role
  }

  plugin.routes['content-api'].routes.unshift({
    method: 'GET',
    path: '/role/type/:type',
    handler: 'role.findByType',
    config: {
      prefix: '',
      auth: false,
    },
  });
  
  // auth register route
  plugin.routes['content-api'].routes.unshift({
    method: 'POST',
    path: '/auth/locel/register',
    handler: 'auth.register',
    config: {
      prefix: '',
      auth: false,
    },
  });

  // auth login route
  plugin.routes['content-api'].routes.unshift({
      method: 'POST',
      path: '/auth/local',
      handler: 'auth.callback',
      config: {
        prefix: '',
        auth: false,
      },
    });

  return plugin;
}