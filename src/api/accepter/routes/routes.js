module.exports = {
  routes : [
    { 
      method: "GET",
      path: "/accepters/phone/:phone",
      handler: "api::accepter.accepter.findByPhone",
      config: {
        auth: false
      }
    }
  ]
}