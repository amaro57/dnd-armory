module.exports = {
  integrations: {
    shopify: {
      location: '@vue-storefront/shopify-api/server',
      configuration: {
        api: {
          domain: 'dnd-armory.myshopify.com',
          storefrontAccessToken: 'd223f01c0d01c96fcf7379342ffb88ac'
        },
        currency: 'USD',
        country: 'US'
      }
    }
  }
};
