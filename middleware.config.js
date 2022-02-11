module.exports = {
  integrations: {
    shopify: {
      location: '@vue-storefront/shopify-api/server',
      configuration: {
        api: {
          domain: 'dnd-armory.myshopify.com',
          storefrontAccessToken: ''
        },
        currency: 'USD',
        country: 'US'
      }
    }
  }
};
