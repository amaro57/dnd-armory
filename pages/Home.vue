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
</style>
