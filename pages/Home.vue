<template>
  <div id="home">
    <SfHero class="hero">
      <SfHeroItem
        v-for="(hero, i) in heroes"
        :key="i"
        :title="hero.title"
        :subtitle="hero.subtitle"
        :button-text="hero.buttonText"
        :background="hero.background"
        :image="hero.image"
        :class="hero.className"
      />
    </SfHero>
    <LazyHydrate when-visible>
      <SfBannerGrid :banner-grid="1" class="banner-grid">
        <template v-for="item in banners" #[item.slot]>
          <SfBanner
            :key="item.slot"
            :title="item.title"
            :subtitle="item.subtitle"
            :description="item.description"
            :button-text="item.buttonText"
            :image="item.image"
            :class="item.class"
          />
        </template>
      </SfBannerGrid>
    </LazyHydrate>
    <LazyHydrate when-visible>
      <SfCallToAction
        title="Subscribe to our Newsletter"
        button-text="Subscribe"
        description="Be the first to know about Sales and Special Offers!"
        image="https://cdn.shopify.com/s/files/1/0556/6542/6532/files/CandlekeepMysteries_alt_1280x960_Wallpaper.jpg?v=1638553274"
        class="call-to-action"
      />
    </LazyHydrate>
  </div>
</template>
<script type="module">
import {
  SfHero,
  SfBanner,
  SfCallToAction,
  SfSection,
  SfCarousel,
  SfImage,
  SfBannerGrid,
  SfHeading,
  SfArrow,
  SfButton
} from '@storefront-ui/vue';
import {
  useProduct,
  useCart,
  productGetters
} from '@vue-storefront/shopify';
import {
  computed
} from '@nuxtjs/composition-api';
import { onSSR } from '@vue-storefront/core';
import LazyHydrate from 'vue-lazy-hydration';
import MobileStoreBanner from '~/components/MobileStoreBanner.vue';
import RelatedProducts from '~/components/RelatedProducts.vue';

export default {
  name: 'Home',
  components: {
    SfHero,
    RelatedProducts,
    SfBanner,
    SfCallToAction,
    SfSection,
    SfCarousel,
    SfImage,
    SfBannerGrid,
    SfHeading,
    SfArrow,
    SfButton,
    MobileStoreBanner,
    LazyHydrate
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  setup() {
    const {
      products: relatedProducts,
      search: productsSearch,
      loading: productsLoading
    } = useProduct('relatedProducts');
    const { cart, load: loadCart, addItem: addToCart, isInCart } = useCart();

    onSSR(async () => {
      await productsSearch({ limit: 8 });
      await loadCart();
    });
    return {
      products: computed(() =>
        productGetters.getFiltered(relatedProducts.value, { master: true })
      ),
      getChkId: computed(() => cart.value.id),
      productsLoading,
      productGetters,
      addToCart,
      isInCart
    };
  },
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  data() {
    return {
      heroes: [
        {
          title: 'Polish Your Weapons',
          subtitle: '',
          buttonText: 'Shop Weapons',
          background: '#eceff1',
          image: {
            mobile:
              'https://cdn.shopify.com/s/files/1/0556/6542/6532/files/SCAG_Twitter_Wallpaper.jpg?v=1638553276',
            desktop:
              'https://cdn.shopify.com/s/files/1/0556/6542/6532/files/SCAG_Twitter_Wallpaper.jpg?v=1638553276'
          },
          link: '/c/weapons'
        },
        {
          title: 'Discover Mythical Creatures',
          subtitle: '',
          buttonText: 'Shop Creatures',
          background: '#fce4ec',
          image: {
            mobile:
              'https://cdn.shopify.com/s/files/1/0556/6542/6532/files/Xanathars_Wallpaper_Facebook_v2.jpg?v=1638553274',
            desktop:
              'https://cdn.shopify.com/s/files/1/0556/6542/6532/files/Xanathars_Wallpaper_Facebook_v2.jpg?v=1638553274'
          },
          link: '/c/creatures'
        },
        {
          title: 'Environments to Dazzle',
          subtitle: '',
          buttonText: 'Shop Locales',
          background: '#efebe9',
          image: {
            mobile:
              'https://cdn.shopify.com/s/files/1/0556/6542/6532/files/dnd_background_overlay2.jpg?v=1638554071',
            desktop:
              'https://cdn.shopify.com/s/files/1/0556/6542/6532/files/dnd_background_overlay2.jpg?v=1638554071'
          },
          link: '/c/environments',
          className:
            'sf-hero-item--position-bg-top-left sf-hero-item--align-right'
        }
      ],
      banners: [
        {
          slot: 'banner-A',
          subtitle: '',
          title: 'Magic',
          description:
            'Add some sparkle with the mystical arts. Bedazzle your companions and astound your enemies with these effects.',
          buttonText: 'Shop now',
          image: {
            mobile:
              'https://cdn.shopify.com/s/files/1/0556/6542/6532/files/illo4.jpg?v=1638552607',
            desktop:
              'https://cdn.shopify.com/s/files/1/0556/6542/6532/files/illo4.jpg?v=1638552607'
          },
          class: 'sf-banner--slim desktop-only',
          link: '/c/magic'
        },
        {
          slot: 'banner-B',
          subtitle: '',
          title: 'Armor',
          description:
            'Browse our armory for stunning plates and robes. Treat your adventure with the splendor it deserves.',
          buttonText: 'Shop now',
          image: {
            mobile:
              'https://cdn.shopify.com/s/files/1/0556/6542/6532/files/illo3.jpg?v=1638552607',
            desktop:
              'https://cdn.shopify.com/s/files/1/0556/6542/6532/files/illo3.jpg?v=1638552607'
          },
          class: 'sf-banner--slim banner-central desktop-only',
          link: '/c/armor'
        },
        {
          slot: 'banner-C',
          subtitle: '',
          title: '',
          image: {
            mobile:
              'https://cdn.shopify.com/s/files/1/0556/6542/6532/files/Illo1.jpg?v=1638552607',
            desktop:
              'https://cdn.shopify.com/s/files/1/0556/6542/6532/files/Illo1.jpg?v=1638552607'
          },
          class: 'sf-banner--slim banner__tshirt',
          link: '/c/women/women-clothing-shirts'
        },
        {
          slot: 'banner-D',
          subtitle: '',
          title: '',
          image: {
            mobile:
              'https://cdn.shopify.com/s/files/1/0556/6542/6532/files/Illo2.jpg?v=1638552607',
            desktop:
              'https://cdn.shopify.com/s/files/1/0556/6542/6532/files/Illo2.jpg?v=1638552607'
          },
          class: 'sf-banner--slim',
          link: '/c/women/women-shoes-sandals'
        }
      ]
    };
  },
  methods: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    toggleWishlist(index) {
      this.products[index].isInWishlist = !this.products[index].isInWishlist;
    }
  }
};
</script>

<style lang="postcss" scoped>
.article-meta h4 a {
  color: #111111;
  font-weight: 600;
  font-size: 20px;
}
.article-meta {
  margin-top: 10px;
}
.article-item__meta-item:not(:last-child)::after {
  display: inline-block;
  content: "";
  width: 5px;
  height: 5px;
  margin: -1px 10px 0 10px;
  border-radius: 100%;
  background: rgba(0, 0, 0, 0.4);
  vertical-align: middle;
}
#home {
  box-sizing: border-box;
  padding: 0 var(--spacer-sm);
  @include for-desktop {
    max-width: 1240px;
    padding: 0;
    margin: 0 auto;
  }
}

.hero {
  margin: var(--spacer-xl) auto var(--spacer-lg);
  --hero-item-background-position: center;
  ::v-deep .sf-link:hover {
    color: var(--c-white);
  }
  @include for-desktop {
    margin: var(--spacer-xl) auto var(--spacer-2xl);
  }
  .sf-hero-item {
    &__subtitle {
    margin: 0;
    color: var(--c-gray);
    width: 60%;
    @include font(
      --hero-item-subtitle-font,
      var(--font-weight--normal),
      var(--h6-font-size),
      1.4,
      var(--font-family--secondary)
    );
    text-transform: uppercase;
  }
  &__title {
    margin: var(--spacer-xs) 0 0 0;
    text-align: center;
    color: white;
    width: 60%;
    background-color: rgba(20, 12, 10, 0.281);
    @include font(
      --hero-item-title-font,
      var(--font-weight--semibold),
      var(--h2-font-size),
      1.2,
      var(--font-family--secondary)
    );
    letter-spacing: 0.1px;
    text-transform: none;
  }
    &:nth-child(even) {
      --hero-item-background-position: left;
      @include for-mobile {
        --hero-item-background-position: 30%;
        --hero-item-wrapper-text-align: right;
        --hero-item-subtitle-width: 100%;
        --hero-item-title-width: 100%;
        --hero-item-wrapper-padding: var(--spacer-sm) var(--spacer-sm)
          var(--spacer-sm) var(--spacer-2xl);
      }
    }
  }
  
}

::v-deep .sf-hero__controls {
  --hero-controls-display: none;
}

.banner-grid {
  --banner-container-width: 50%;
  margin: var(--spacer-xl) 0;
  ::v-deep .sf-link:hover {
    color: var(--c-white);
  }
  @include for-desktop {
    margin: var(--spacer-2xl) 0;
    ::v-deep .sf-link {
      --button-width: auto;
    }
  }
}

.banner {
  &__tshirt {
    background-position: left;
  }
  &-central {
    @include for-desktop {
      --banner-container-flex: 0 0 70%;
    }
  }
}

.similar-products {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: var(--spacer-2xs);
  --heading-padding: 0;
  border-bottom: 1px var(--c-light) solid;
  @include for-desktop {
    border-bottom: 0;
    justify-content: center;
    padding-bottom: 0;
  }
}

.call-to-action {
  background-position: right;
  margin: var(--spacer-xs) 0;
  @include for-desktop {
    margin: var(--spacer-xl) 0 var(--spacer-2xl) 0;
  }
}

.carousel {
  margin: 0 calc(var(--spacer-sm) * -1) 0 0;
  @include for-desktop {
    margin: 0;
  }
  &__item {
    margin: 1.375rem 0 2.5rem 0;
    @include for-desktop {
      margin: var(--spacer-xl) 0 var(--spacer-xl) 0;
    }
    &__product {
      --product-card-add-button-transform: translate3d(0, 30%, 0);
    }
  }
}

.sf-call-to-action {
  display: var(--banner-display, flex);
  box-sizing: border-box;
  flex-direction: var(--call-to-action-flex-direction, column);
  align-items: var(--call-to-action-align-items);
  justify-content: var(--call-to-action-justify-content, left);
  min-height: var(--call-to-action-height, auto);
  padding: var(--call-to-action-padding, var(--spacer-lg));
  @include background(
    --call-to-action-background,
    var(--_call-to-action-background-color, transparent),
    var(--_call-to-action-background-image)
  );
  --call-to-action-background-position: 60%;
  &__text-container {
    display: flex;
    justify-content: var(
      --call-to-action-text-container-justify-content,
      flex-start
    );
    flex-direction: var(--call-to-action-text-container-flex-direction, column);
    width: var(--call-to-action-text-container-width);
    margin: var(--call-to-action-text-container-margin);
  }
  &__title {
    margin: var(--call-to-action-title-margin, 0 0 var(--spacer-base) 0);
    color: var(
      --call-to-action-color,
      var(--call-to-action-title-color, var(--c-white))
    );
    background-color: rgba(20, 12, 10, 0.712);
    padding: 10px;
    @include font(
      --call-to-action-title-font,
      var(--font-weight--semibold),
      var(--h2-font-size),
      1.4,
      var(--font-family--secondary)
    );
    text-transform: var(--call-to-action-title-text-transform, none);
  }
  &__description {
    margin: var(--call-to-action-description-margin, 0 0 var(--spacer-base) 0);
    padding: 10px;
    color: var(
      --call-to-action-color,
      var(--call-to-action-description-color, var(--c-white))
    );
    background-color: rgba(20, 12, 10, 0.712);
    @include font(
      --call-to-action-description-font,
      var(--font-weight--normal),
      var(--font-size--base),
      1.6,
      var(--font-family--primary)
    );
  }
  @include for-desktop {
    --call-to-action-description-font-size: var(--font-size--lg);
    --call-to-action-title-margin: 0 0 var(--spacer-xs) 0;
    --call-to-action-flex-direction: row;
    --call-to-action-justify-content: space-between;
    --call-to-action-align-items: center;
    --call-to-action-padding: var(--spacer-xl) var(--spacer-2xl);
    --call-to-action-height: 12.625rem;
    --call-to-action-text-container-width: 75%;
  }
}

.sf-banner {
  box-sizing: border-box;
  display: var(--banner-display, flex);
  justify-content: var(--banner-justify-content, flex-start);
  width: var(--banner-width, 100%);
  min-height: var(--banner-height, 21.4375rem);
  @include background(
    --banner-background,
    var(--_banner-background-color, transparent),
    var(--_banner-background-image)
  );
  --banner-background-position: 60%;
  &__wrapper {
    display: flex;
    flex-direction: column;
    align-items: var(--banner-align-items, flex-start);
    justify-content: var(--banner-wrapper-justify-content, flex-start);
    flex-direction: var(--banner-wrapper-flex-direction, column);
    padding: var(--banner-padding, var(--spacer-xl));
    flex: 0 0 var(--banner-wrapper-width, 100%);
    text-decoration: none;
    &.sf-button,
    &.sf-button:hover,
    &.sf-button:active {
      --button-background: transparent;
      --button-box-shadow-opacity: 0;
    }
  }
  &__subtitle {
    margin: var(--banner-subtitle-margin, 0);
    color: white;
    @include font(
      --banner-subtitle-font,
      var(--font-weight--normal),
      var(--font-size--base),
      1.4,
      var(--font-family--secondary)
    );
    text-transform: var(--banner-subtitle-text-transform, uppercase);
  }
  &__title {
    margin: var(--banner-title-margin, var(--spacer-2xs) 0 0 0);
    color: white;
    @include font(
      --banner-title-font,
      var(--font-weight--normal),
      var(--h2-font-size),
      1.4,
      var(--font-family--secondary)
    );
    text-transform: var(--banner-title-text-transform, uppercase);
  }
  &__description {
    display: var(--banner-description-display, none);
    padding: 10px;
    margin: var(
      --banner-description-margin,
      var(--spacer-sm) 0 var(--spacer-base) 0
    );
    color: white;
    background-color: rgba(20, 12, 10, 0.281);
    text-align: var(--banner-description-text-align, left);
    @include font(
      --banner-description-font,
      var(--font-weight--light),
      var(--font-size--base),
      1.6,
      var(--font-family--primary)
    );
  }
  &__call-to-action {
    --button-color: var(--c-light-variant);
    display: var(--banner-display-call-to-action, none);
  }
  @include for-desktop {
    --banner-background-image: var(
      --_banner-background-desktop-image,
      var(--_banner-background-image)
    );
    --banner-wrapper-width: 50%;
    --banner-description-display: block;
    --banner-display-call-to-action: block;
    --banner-title-margin: var(--spacer-sm) 0 0 0;
    --banner-subtitle-color: var(--c-gray);
    align-items: var(--banner-align-items, center);
    min-height: var(--banner-height, 25rem);
    &__wrapper {
      pointer-events: none;
      & > * {
        pointer-events: initial;
      }
    }
    &__call-to-action {
      --button-padding: var(--spacer-sm) var(--spacer-xl);
      pointer-events: auto;
    }
    &--right {
      --banner-justify-content: flex-end;
    }
  }
}

.sf-arrow {
  --button-width: 2.75rem;
  --button-height: 2.75rem;
  --button-padding: 0 0.625rem;
  --button-background: var(--c-light);
  --button-transition: background 150ms linear;
  --icon-color: white;
  --button-box-shadow: 0px 4px 4px var(--c-black);
  --box-shadow-transition-opacity-duration: 150ms;
  display: flex;
  align-items: center;
  justify-content: var(--arrow-justify-content, center);
  &:hover {
    --button-background: var(--c-dark);
    --icon-color: var(--c-light);
    --button-box-shadow-opacity: 0.25;
  }
  &:active {
    --button-background: var(--c-link);
  }
  &:disabled {
    --button-background: var(--c-light);
    --icon-color: var(--c-text-disabled);
  }
  &__icon {
    transform: var(--arrow-icon-transform);
  }
  &--long {
    --button-width: 4.375rem;
    --button-height: 2.5rem;
    --button-background: var(--c-text-disabled);
    --button-transition: transform 150ms linear;
    --arrow-justify-content: flex-start;
    &.sf-arrow--right {
      --arrow-justify-content: flex-end;
      --arrow-icon-transform: rotate(180deg) scale(0.855, 0.75);
      &:hover {
        transform-origin: center right;
      }
    }
  }
  &--transparent {
    --button-background: transparent;
    --button-box-shadow: none;
    &:hover {
      --button-background: transparent;
      --icon-color: var(--c-dark);
    }
    &:disabled {
      --button-background: transparent;
      --icon-color: var(--c-text-disabled);
    }
  }
  &--rounded {
    --button-border-radius: 100%;
  }
  &--no-shadow {
    --button-box-shadow: none;
  }
  &--right {
    --arrow-icon-transform: rotate(180deg);
  }
  &--top {
    --arrow-icon-transform: rotate(90deg);
  }
  &--down {
    --arrow-icon-transform: rotate(270deg);
  }
}

</style>
