module.exports = {
  routes : [
    {
      method: "GET",
      path: "/clients/phone/:phone",
      handler: "api::client.client.findByPhone",
      config: {
        auth: false
      }
    }
  ]
}