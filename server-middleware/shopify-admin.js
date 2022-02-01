const bodyParser = require('body-parser');
const app = require('express')();
const axios = require('axios');
module.exports = {
  path: '/',
  handler: app
};
app.use(bodyParser.json());

app.post('/shopifyAdmin', (req, res) => {
  
  const options = {
    productName: req.body.productName,
    productDescription: req.body.productDescription,
    productCat: req.body.productCategory,
    sketchfabuid: req.body.sketchfabuid,
    productImage: req.body.productImage
  };
  //Move Access tokens to non-public facing files. Security hazard in non-private projects.
  axios({
    method: 'post',
    url: 'https://dnd-armory.myshopify.com/admin/api/2021-10/products.json',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': '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'
    },
    data: JSON.stringify({
      "product": {
        "title": options.productName,
        "product_type": options.productCat,
        "body_html":options.productDescription,
        "metafields": [{ "key": "uid", "value": options.sketchfabuid, "value_type": "string", "namespace": "sketchfab" }],
        "image": [{"attachement": options.productImage }]
      }
    })
  }).then((response) => {
    const id = response.data.product.id;
    axios({
      method: 'put',
      url: 'https://dnd-armory.myshopify.com/admin/api/2021-10/product_listings/'+ id +'.json',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': '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'
      },
      data: JSON.stringify({
        "product_listing": {
          "product_id": id
        }
      })
    })
  }).then((response) => {
      res.status(200).send(response);
  }).catch((error) => {
    console.error(error);
  });
});

app.post('/adminMeta', (req, res) => {
  axios({
    method: 'post',
    url: 'https://dnd-armory.myshopify.com/admin/api/2021-10/graphql.json',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': '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'
    },
    data: {
      query: `
              mutation($input: MetafieldStorefrontVisibilityInput!) {
                metafieldStorefrontVisibilityCreate(
                  input: $input
                ) {
                  metafieldStorefrontVisibility {
                    id
                  }
                  userErrors {
                    field
                    message
                  }
                }
              }
              `,
      variables: {
        "input": {
          "namespace": "sketchfab",
          "key": "uid",
          "ownerType": "PRODUCT"
        }
      }
    }
  }).then((response) => {
    res.status(200).send(response.data);
  }).catch((error) => {
    console.error(error);
  });

})