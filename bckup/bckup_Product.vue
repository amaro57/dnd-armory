<template>
  <SfLoader
    v-if="productloading"
    class="pdc-pdp-loader"
    :loading="productloading"
  >
    <div />
  </SfLoader>
  <div v-else id="product">
    <SfBreadcrumbs class="breadcrumbs" :breadcrumbs="breadcrumbs">
      <template #link="{ breadcrumb }">
        <nuxt-link
          :data-testid="breadcrumb.text"
          :to="breadcrumb.route.link"
          class="sf-link disable-active-link sf-breadcrumbs__breadcrumb"
        >
          {{ breadcrumb.text }}
        </nuxt-link>
      </template>
    </SfBreadcrumbs>
    <div class="product">
      <iframe src="" id="api-frame" class="sketchfab-frame" allow="autoplay; fullscreen; xr-spatial-tracking" xr-spatial-tracking execution-while-out-of-viewport execution-while-not-rendered web-share allowfullscreen mozallowfullscreen="true" webkitallowfullscreen="true"></iframe>
      <div class="product__info">
        <div class="product__header">
          <SfHeading
            :title="productGetters.getName(product)"
            :level="1"
            class="sf-heading--no-underline sf-heading--left"
          />
          <div class="product_stock_wrap">
            <SfBadge
              class="sf-badge--number"
              :class="
                productGetters.getStockStatus(product)
                  ? 'color-success'
                  : 'color-danger'
              "
            >
              {{
                productGetters.getStockStatus(product)
                  ? "In stock"
                  : "Out of Stock"
              }}
            </SfBadge>
            <SfIcon
              icon="drag"
              size="xxl"
              color="var(--c-text-disabled)"
              class="product__drag-icon smartphone-only"
            />
          </div>
          <div class="product__price-and-rating">
            <template
              v-if="
                productGetters.getPrice(product).special &&
                parseFloat(productGetters.getPrice(product).special) <
                  parseFloat(productGetters.getPrice(product).regular)
              "
            >
              <SfPrice
                :regular="
                  $n(productGetters.getPrice(product).regular, 'currency')
                "
                :special="
                  $n(productGetters.getPrice(product).special, 'currency')
                "
              />
              <SfBadge class="sf-badge--number">
                {{ productGetters.getDiscountPercentage(product) }}% off
              </SfBadge>
            </template>
            <SfPrice
              v-else-if="
                productGetters.getPrice(product).special &&
                parseFloat(productGetters.getPrice(product).special) >
                  parseFloat(productGetters.getPrice(product).regular)
              "
              :regular="
                $n(productGetters.getPrice(product).special, 'currency')
              "
            />
            <SfPrice
              v-else
              :regular="
                $n(productGetters.getPrice(product).regular, 'currency')
              "
            />
          </div>
        </div>
        <div>
          <p
            v-if="productDescription"
            class="product__description desktop-only"
          >
            {{ productDescription }}
          </p>
          <div v-if="options && Object.keys(options).length > 0">
            <template v-for="(option, o) in options">
              <SfSelect
                v-if="o.toLowerCase() !== 'color'"
                :key="`attrib-${o}`"
                :data-cy="`product-select_${o.toLowerCase()}`"
                :set="(atttLbl = o)"
                :value="configuration[o] || options[o][0].value"
                :label="$t(`${o}`)"
                :class="`sf-select--underlined product__select-${o.toLowerCase()}`"
                :required="true"
                @input="(o) => updateFilter({ [atttLbl]: o })"
              >
                <SfSelectOption
                  v-for="(attribs, a) in option"
                  :key="`item-${a}`"
                  :value="attribs.value"
                >
                  {{ attribs.value }}
                </SfSelectOption>
              </SfSelect>
              <div
                v-else
                :key="`attrib-${o.toLowerCase()}`"
                :class="`product__${o.toLowerCase()}s`"
              >
                <p class="product__color-label">{{ $t(`${o}`) }}:</p>
                <SfColor
                  v-for="(attribs, a) in option"
                  :key="`item-${a}`"
                  data-cy="product-color_update"
                  :color="attribs.value"
                  :class="`product__color ${attribs.value}`"
                  :selected="
                    configuration[o]
                      ? configuration[o] === attribs.value
                        ? true
                        : false
                      : a === 0
                      ? true
                      : false
                  "
                  @click="
                    (atttLbl = o), updateFilter({ [atttLbl]: attribs.value })
                  "
                />
              </div>
            </template>
          </div>
          <SfAddToCart
            v-if="productGetters.getStockStatus(product) === true"
            v-model="qty"
            data-cy="product-cart_add"
            :stock="stock"
            :can-add-to-cart="stock > 0"
            class="product__add-to-cart"
          >
            <template #add-to-cart-btn>
              <SfButton
                class="sf-add-to-cart__button"
                :disabled="loading"
                @click="addingToCart({ product, quantity: parseInt(qty), customQuery: [{key: 'CustomAttrKey', value: 'CustomAttrValue'}]})"
              >
                Add to Bag
              </SfButton>
            </template>
          </SfAddToCart>
          <LazyHydrate when-idle>
            <SfTabs :open-tab="1" class="product__tabs">
              <SfTab data-cy="product-tab_description" title="Description">
                <div v-if="productDescriptionHtml" class="product__description">
                  <div v-html="productDescriptionHtml"></div>
                </div>
                <SfProperty
                  v-for="(property, i) in properties"
                  :key="i"
                  :name="property.name"
                  :value="property.value"
                  class="product__property"
                >
                  <template v-if="property.name === 'Category'" #value>
                    <SfButton class="product__property__button sf-button--text">
                      {{ property.value }}
                    </SfButton>
                  </template>
                </SfProperty>
              </SfTab>
              <SfTab
                title="Additional Information"
                data-cy="product-tab_additional"
                class="product__additional-info"
              >
                <div class="product__additional-info">
                  <p class="product__additional-info__title">
                    {{ $t("Brand") }}
                  </p>
                  <p>{{ brand }}</p>
                  <p class="product__additional-info__title">
                    {{ $t("Instruction1") }}
                  </p>
                  <p class="product__additional-info__paragraph">
                    {{ $t("Instruction2") }}
                  </p>
                  <p class="product__additional-info__paragraph">
                    {{ $t("Instruction3") }}
                  </p>
                  <p>{{ Instructions }}</p>
                </div>
              </SfTab>
            </SfTabs>
          </LazyHydrate>
        </div>
      </div>
    </div>
    <LazyHydrate when-visible>
      <RelatedProducts
        :products="relatedProducts"
        :loading="relatedLoading"
        title="Match it with"
      />
    </LazyHydrate>
    <LazyHydrate when-visible>
      <InstagramFeed />
    </LazyHydrate>
    <LazyHydrate when-visible>
      <MobileStoreBanner />
    </LazyHydrate>
  </div>
</template>
<script>
import {
  SfProperty,
  SfHeading,
  SfPrice,
  SfRating,
  SfSelect,
  SfAddToCart,
  SfTabs,
  SfGallery,
  SfIcon,
  SfImage,
  SfBadge,
  SfBanner,
  SfAlert,
  SfSticky,
  SfReview,
  SfBreadcrumbs,
  SfLoader,
  SfButton,
  SfColor,
  SfCheckbox
} from '@storefront-ui/vue';

import InstagramFeed from '~/components/InstagramFeed.vue';
import RelatedProducts from '~/components/RelatedProducts1.vue';
import { ref, computed, watch, getCurrentInstance } from '@nuxtjs/composition-api';
import { useProduct, useCart, productGetters } from '@vue-storefront/shopify';
import MobileStoreBanner from '~/components/MobileStoreBanner.vue';
import LazyHydrate from 'vue-lazy-hydration';
import { onSSR } from '@vue-storefront/core';
import useUiNotification from '~/composables/useUiNotification';

export default {
  name: 'Product',
  components: {
    SfAlert,
    SfColor,
    SfLoader,
    SfProperty,
    SfHeading,
    SfPrice,
    SfRating,
    SfSelect,
    SfAddToCart,
    SfTabs,
    SfGallery,
    SfIcon,
    SfImage,
    SfBanner,
    SfSticky,
    SfReview,
    SfBadge,
    SfBreadcrumbs,
    SfButton,
    SfCheckbox,
    InstagramFeed,
    RelatedProducts,
    MobileStoreBanner,
    LazyHydrate
  },
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.prevRoute = from;
    });
  },
  transition: 'fade',
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup(props, context) {
    const breadcrumbs = ref([]);
    const atttLbl = '';
    const qty = ref(1);
    const { slug } = context.root.$route.params;
    const {
      loading: productloading,
      products,
      search
    } = useProduct('products');
    const { send: sendNotification } = useUiNotification();
    const {
      products: relatedProducts,
      search: searchRelatedProducts,
      loading: relatedLoading
    } = useProduct('relatedProducts');
    const { addItem, loading } = useCart();

    const product = computed(
      () =>
        productGetters.getFiltered(products.value, {
          master: true,
          attributes: context.root.$route.query
        })[0]
    );
    const id = computed(() => productGetters.getId(product.value));
    const originalId = computed(() =>
      productGetters.getProductOriginalId(product.value)
    );
    const productTitle = computed(() => productGetters.getName(product.value));
    const productCoverImage = computed(() =>
      productGetters.getPDPCoverImage(product.value)
    );
    const productDescription = computed(() =>
      productGetters.getDescription(product.value)
    );
    const productDescriptionHtml = computed(() =>
      productGetters.getDescription(product.value, true)
    );
    const options = computed(() =>
      productGetters.getAttributes(products.value)
    );
    const configuration = computed(() => {
      return productGetters.getSelectedVariant(
        products.value,
        context.root.$route.query
      );
    });

    const setBreadcrumb = () => {
      breadcrumbs.value = [
        {
          text: 'Home',
          route: { link: '/' }
        },
        {
          text: 'products',
          route: { link: '#' }
        },
        {
          text: productTitle.value,
          route: { link: '#' }
        }
      ];
    };

    watch(
      productTitle,
      (currproductTitle, prevproductTitle) => {
        if (currproductTitle !== prevproductTitle) {
          setBreadcrumb();
        }
      },
      { deep: true }
    );
    const productGallery = computed(() => {
      if (product.value && product.value.images.length === 0) {
        product.value.images.push({
          originalSrc:
            'https://cdn.shopify.com/s/files/1/0407/1902/4288/files/placeholder_600x600.jpg?v=1625742127'
        });
      }
      return productGetters.getGallery(product.value).map((img) => ({
        mobile: { url: img.small },
        desktop: { url: img.normal },
        big: { url: img.big },
        alt: product.value._name || product.value.name
      }));
    });
    const stock = computed(() => {
      return productGetters.getStock(product.value);
    });
    const ActiveVariantImage = computed(() => {
      return productGetters.getVariantImage(product.value) || 0;
    });

    onSSR(async () => {
      await search({ slug, selectedOptions: configuration.value }).then(() => {
        if (productTitle.value === 'Product\'s name') {
          return context.root.error({ statusCode: 404, message: 'This product could not be found' });
        }
      });
      await searchRelatedProducts({ productId: id.value, related: true });
    });

    const updateFilter = (filter) => {
      if (options.value) {
        Object.keys(options.value).forEach((attr) => {
          if (attr in filter) {
            return;
          }
          filter[attr] =
            Object.keys(configuration.value).length > 0
              ? configuration.value[attr]
              : options.value[attr][0].value;
        });
      }
      context.root.$router.push({
        path: context.root.$route.path,
        query: {
          ...configuration.value,
          ...filter
        }
      });
    };

    return {
      updateFilter,
      configuration,
      product,
      productDescription,
      productCoverImage,
      productDescriptionHtml,
      ActiveVariantImage,
      sendNotification,
      originalId,
      relatedProducts: computed(() =>
        productGetters.getFiltered(relatedProducts.value, { master: true })
      ),
      relatedLoading,
      options,
      stock,
      productTitle,
      breadcrumbs,
      qty,
      addItem,
      loading,
      productloading,
      productGallery,
      productGetters,
      setBreadcrumb,
      atttLbl
    };
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  data() {
    return {
      stock: 5,
      properties: [
        {
          name: 'Product Code',
          value: ''
        },
        {
          name: 'Platform',
          value: ''
        },
        {
          name: 'Type',
          value: ''
        },
        {
          name: 'Country',
          value: ''
        }
      ],
      description:
        'A DnD Armory exclusive product.',
      detailsIsActive: false,
      brand:
        '',
      Instructions: ''
    };
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  mounted() {
    window.addEventListener('load', () => {
      this.setGalleryWidth();
    });
    this.$nextTick(() => {
      this.setGalleryWidth();
      this.setBreadcrumb();
      window.addEventListener('resize', this.setGalleryWidth);
    });
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  updated() {
     const Sketchfab = require('../node_modules/@sketchfab/viewer-api/viewer-api.js');
      //Actually have to put this here because this is all server rendered, not client.
      //So Sketchfab throws an error due to not being able to find an instance of "self"
      const iframe = document.getElementById('api-frame');
      const client = new Sketchfab( iframe );
      this.revealMetadata().then((result) => {
        this.displaySketchfab(result, client);
      });
    this.setGalleryWidth();
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  methods: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    async addingToCart(Productdata) {
      await this.addItem(Productdata).then(() => {
        this.sendNotification({
          key: 'product_added',
          message: `${Productdata.product.name} has been successfully added to your cart.`,
          type: 'success',
          title: 'Product added!',
          icon: 'check'
        });
        this.qty = 1;
      });
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    updatedQuantity(value) {
      this.qty = value;
    },
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    setGalleryWidth() {
      const gallary = document.getElementsByClassName('product__gallery');
      const gallerySlider =
        gallary.length > 0 && gallary[0].querySelectorAll('.glide__slides');
      const galleryAllSlides =
        gallerySlider.length > 0 &&
        gallerySlider[0].querySelectorAll('.glide__slide');
      typeof galleryAllSlides !== 'boolean' &&
        galleryAllSlides.length > 0 &&
        galleryAllSlides.forEach((gallerySlide) => {
          gallerySlide.style.flexBasis = gallerySlide.style.width;
        });
    },
    async revealMetadata() {
      const { slug }  = this.$route.params;

      try {
        const response = await this.$axios({
          method: 'post',
          url: '/adminMeta',
          headers: {
          'Content-Type': 'application/json'
          },
          data: {
              query:`
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
                  "namespace": "global",
                  "key": "uid",
                  "ownerType": "PRODUCT"
                }
              }
          }
        });
        

        const modeluid = await this.$axios({
            method: 'post',
            url: 'https://dnd-armory.myshopify.com/api/2021-10/graphql.json',
            headers: { 'X-Shopify-Storefront-Access-Token': 'd223f01c0d01c96fcf7379342ffb88ac' },
            data: {
              query: `
                query ($handle: String!) {
                  productByHandle(handle: $handle) {
                    productUID: metafield(namespace: "sketchfab", key: "uid") {
                      value
                      type
                    }
                  }
                }
              `,
              variables: {
                  "handle": slug
                }
              }
            });

        return modeluid;
      }
      catch (error) {
        console.log(error);
      }
    },
    displaySketchfab( modeluid, client ){
      
        const uid = modeluid.data.data.productByHandle.productUID.value;
        client.init(uid, {
          success: function onSuccess( api ){
            api.start();
            api.addEventListener( 'viewerready', function() {

                console.log( 'Viewer is ready' );

            } );
        },
        error: function onError() {
            console.log( 'Viewer error' );
        }
          });
    }
  }
};
</script>

<style lang="scss" scoped>
.pdc-pdp-loader {
  min-height: 200px;
  padding: 100px 0;
}

#product {
  box-sizing: border-box;
  @include for-desktop {
    max-width: 1272px;
    margin: 0 auto;
  }
}
.product {
  @include for-desktop {
    display: flex;
  }
  &__info {
    margin: var(--spacer-sm) auto;
    @include for-desktop {
      max-width: 32.625rem;
      margin: 0 0 0 7.5rem;
    }
  }
  &__header {
    --heading-title-color: var(--c-link);
    --heading-title-font-weight: var(--font-weight--bold);
    --heading-padding: 0;
    margin: 0 var(--spacer-sm);
    display: flex;
    justify-content: space-between;
    @include for-desktop {
      --heading-title-font-weight: var(--font-weight--semibold);
      margin: 0 auto;
    }
  }
  &__drag-icon {
    animation: moveicon 1s ease-in-out infinite;
  }
  &__price-and-rating {
    margin: 0 var(--spacer-sm) var(--spacer-base);
    align-items: center;
    @include for-desktop {
      display: flex;
      justify-content: space-between;
      margin: var(--spacer-sm) 0 var(--spacer-lg) 0;
    }
  }
  &__rating {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin: var(--spacer-xs) 0 var(--spacer-xs);
  }
  &__count {
    @include font(
      --count-font,
      var(--font-weight--normal),
      var(--font-size--sm),
      1.4,
      var(--font-family--secondary)
    );
    color: var(--c-text);
    text-decoration: none;
    margin: 0 0 0 var(--spacer-xs);
  }
  &__description {
    @include font(
      --product-description-font,
      var(--font-weight--light),
      var(--font-size--base),
      1.6,
      var(--font-family--primary)
    );
  }
  &__select-size {
    margin: 0 var(--spacer-sm);
    @include for-desktop {
      margin: 0;
    }
  }
  &__colors {
    @include font(
      --product-color-font,
      var(--font-weight--normal),
      var(--font-size--lg),
      1.6,
      var(--font-family--secondary)
    );
    display: flex;
    align-items: center;
    margin-top: var(--spacer-xl);
  }
  &__color-label {
    margin: 0 var(--spacer-lg) 0 0;
  }
  &__color {
    margin: 0 var(--spacer-2xs);
  }
  &__add-to-cart {
    margin: var(--spacer-base) var(--spacer-sm) 0;
    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }
  &__guide,
  &__compare,
  &__save {
    display: block;
    margin: var(--spacer-xl) 0 var(--spacer-base) auto;
  }
  &__compare {
    margin-top: 0;
  }
  &__tabs {
    margin: var(--spacer-lg) auto var(--spacer-2xl);
    --tabs-title-font-size: var(--font-size--lg);
    @include for-desktop {
      margin-top: var(--spacer-2xl);
    }
  }
  &__property {
    margin: var(--spacer-base) 0;
    &__button {
      --button-font-size: var(--font-size--base);
    }
  }
  &__review {
    padding-bottom: 24px;
    border-bottom: var(--c-light) solid 1px;
    margin-bottom: var(--spacer-base);
  }
  &__additional-info {
    color: var(--c-link);
    @include font(
      --additional-info-font,
      var(--font-weight--light),
      var(--font-size--sm),
      1.6,
      var(--font-family--primary)
    );
    &__title {
      font-weight: var(--font-weight--normal);
      font-size: var(--font-size--base);
      margin: 0 0 var(--spacer-sm);
      &:not(:first-child) {
        margin-top: 3.5rem;
      }
    }
    &__paragraph {
      margin: 0;
    }
  }
  &__gallery {
    flex: 1;
  }
}
.breadcrumbs {
  margin: var(--spacer-base) auto var(--spacer-lg);
}
.banner-app {
  --banner-container-width: 100%;
  --banner-title-margin: var(--spacer-base) 0 var(--spacer-xl) 0;
  --banner-padding: 0 var(--spacer-2xl);
  --banner-title-font-size: var(--h1-font-size);
  --banner-subtitle-font-size: var(--font-size--xl);
  --banner-title-font-weight: var(--font-weight--semibold);
  --banner-subtitle-font-weight: var(--font-weight--medium);
  --banner-title-text-transform: capitalize;
  --banner-subtitle-text-transform: capitalize;
  display: block;
  min-height: 26.25rem;
  max-width: 65rem;
  margin: 0 auto;
  padding: 0 calc(25% + var(--spacer-2xl)) 0 var(--spacer-xl);
  &__call-to-action {
    --button-background: transparent;
    display: flex;
  }
  &__button {
    --image-width: 8.375rem;
    --image-height: 2.75rem;
    --button-padding: 0;
    & + & {
      margin: 0 0 0 calc(var(--spacer-xl) / 2);
    }
  }
}
@keyframes moveicon {
  0% {
    transform: translate3d(0, 0, 0);
  }
  50% {
    transform: translate3d(0, 30%, 0);
  }
  100% {
    transform: translate3d(0, 0, 0);
  }
}

.sketchfab-frame {
  
  flex: auto;
  flex-direction: var(--gallery-flex-direction, column);
  &__thumbs {
    display: var(--gallery-thumbs-display, flex);
    flex: var(--gallery-thumbs-flex);
    flex-direction: var(--gallery-thumbs-flex-direction);
    margin: var(--gallery-thumbs-margin, var(--spacer-xs) 0 0 0);
    order: var(--gallery-thumbs-order);
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
  &__item {
    display: flex;
    flex: 0 0 var(--gallery-thumb-width, 10rem);
    margin: var(--gallery-item-margin, 0 var(--spacer-xs) 0 0);
    &:last-child {
      --gallery-item-margin: 0;
    }
    opacity: var(--gallery-item-opacity, 0.5);
    transition: var(--gallery-item-transition, opacity 150ms ease-in-out);
    cursor: var(--gallery-item-cursor, pointer);
    &--selected {
      --gallery-item-opacity: 1;
      --gallery-item-cursor: default;
    }
  }
  &__stage {
    flex: 1;
    max-width: var(--gallery-stage-width, 26.375rem);
  }
  &__zoom {
    position: absolute;
    left: 50%;
    top: 0;
  }
  .glide {
    &__slide {
      flex: 1;
    }
    &__slides {
      margin: 0;
    }
  }
  @include for-desktop {
    --gallery-flex-direction: row;
    --gallery-thumbs-flex: 0 0 var(--gallery-thumb-width, 10rem);
    --gallery-thumbs-flex-direction: column;
    --gallery-thumbs-order: -1;
    --gallery-thumbs-margin: 0 var(--spacer-xs) 0 0;
    --gallery-item-margin: 0 0 var(--spacer-xs) 0;
    &__item {
      &:last-child {
        --gallery-item-margin: 0;
      }
    }
  }
}
</style>
