module.exports = {
  routes : [
    { 
      method: "GET",
      path: "/users-permissions/phone/:phone",
      handler: "api::user.user.findByPhone",
      config: {
        auth: false
      }
    }
  ]
}