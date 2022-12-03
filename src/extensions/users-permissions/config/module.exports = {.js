module.exports = {
  definition: `
    type userInfo {
      id: ID!
      username: String!
      email: String!
      confirmed: Boolean
      blocked: Boolean
      role: UsersPermissionsMeRole
      phone: String
    }
  `,
  query: `
    userInfo: userInfo 
  `,
  resolver: {
    Query: {
      userInfo: {
        description: 'Return a user info',
        resolverOf: 'plugins::users-permissions.users.me',
        resolver: (obj, options, {context}) => {
          return {
            firstName: "reza",
          }
        }
      }
    }
  }
}