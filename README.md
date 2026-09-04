<p align="center">
  <a href="https://github.com/rylanharper/nitrogen">
    <img src="./public/logo.svg" width="145" height="145" alt="Nitrogen Logo" />
  </a>
</p>

# Nitrogen

Nitrogen is a Nuxt template inspired by Shopify's [Hydrogen](https://github.com/Shopify/hydrogen) framework for headless commerce. This template is designed to empower Nuxt developers to build fast, scalable, and customizable storefronts that incorporate key features from Hydrogen's starter theme.

> [!IMPORTANT]
> This template now features a minimal Sanity studio [template](https://github.com/rylanharper/nitrogen-sanity-studio), which synchronizes content between a Sanity dataset and your Shopify storefront. This allows teams to further enhance product and collection pages with custom modules or curated links — anything, really.

## ✨ Key Features

- 💪 Strongly typed
- 🛒 Cart functionality
- 🗂️ Collection pages, with pagination
- 🕹️ Collection filter and sort functionality
- 👕 Product pages, with metafields
- 🔍 Search functionality
- 🌐 Shop localization
- 👤 Customer accounts
- 📊 Shopify analytics
- 💡 Sitemap, with robots
- 📫 Klaviyo integration
- 🎠 Embla Carousel
- 🎨 Tailwind v4
- 🔮 Codegen

## 📖 Documentation

> [!TIP]
> Read through the docs to learn how to configure your Shopify store to work with Nitrogen!

[Nitrogen documentation](https://nitrogen-docs.netlify.app/)

## 💻 Development

To begin using Nitrogen, you'll need to add the following environment variables:

```ini
# Shopify
NUXT_SHOPIFY_NAME=your-shop-name

# Storefront API
NUXT_SHOPIFY_CLIENTS_STOREFRONT_API_VERSION=2026-01
NUXT_SHOPIFY_CLIENTS_STOREFRONT_PUBLIC_ACCESS_TOKEN=your_storefront_access_token

# Customer Account API
NUXT_SHOPIFY_CLIENTS_CUSTOMER_ACCOUNT_API_VERSION=2026-01
NUXT_SHOPIFY_CLIENTS_CUSTOMER_ACCOUNT_CLIENT_ID=your_client_id
NUXT_SHOPIFY_CLIENTS_CUSTOMER_ACCOUNT_SESSION_PASSWORD=at_least_32_characters

# Analytics
NUXT_SHOPIFY_ANALYTICS_STOREFRONT_ID=your_storefront_id

# Klaviyo (optional)
NUXT_KLAVIYO_PUBLIC_API_KEY=your_public_api_key
NUXT_KLAVIYO_PRIVATE_API_KEY=your_private_api_key
NUXT_KLAVIYO_API_VERSION=2026-01-15

# Sanity (optional)
NUXT_SANITY_PROJECT_ID=your_project_id
NUXT_SANITY_DATASET=production
NUXT_SANITY_API_VERSION=2026-02-01
NUXT_SANITY_STUDIO_URL=http://your-studio-domain.com
NUXT_SANITY_API_READ_TOKEN=your_api_read_token
```

> [!WARNING]
> It is strongly recommended that you use the `2026-01` Storefront API version or higher. If not, you will not have access to new API features found within this template (this will cause breaking changes).

### Local Setup

1. Install dependencies using `pnpm install`
2. Start the development server using `pnpm dev`

Types are generated automatically on `nuxt prepare`, `nuxt dev` and `nuxt build`, so there is no separate codegen step.

## ⚡ Basic Usage

Shopify is wired up with the official [`@nuxtjs/shopify`](https://shopify.nuxtjs.org) module, which provides the typed Storefront client, the server-side proxy, request caching and type generation. Klaviyo is a [custom module](https://github.com/rylanharper/nitrogen/blob/master/modules/klaviyo) in the `/modules` folder.

> [!TIP]
> Read the official Nuxt Author Module Guide to learn how to create and manage your own modules!

[Author Module Guide](https://nuxt.com/docs/4.x/guide/modules/getting-started)

### GraphQL Operations

Fragments live in `/graphql/fragments` as plain `.graphql` files and are injected into any operation that spreads them at build time. Queries and mutations live in `/graphql/queries` and `/graphql/mutations` as `#graphql`-prefixed template literals, which is what makes them statically readable for type generation:

```ts
// graphql/queries/custom.ts
export const MY_QUERY = `#graphql
  query myQuery($handle: String) {
    product(handle: $handle) {
      ...Product
    }
  }
`
```

Feel free to add or remove operations that fit your project needs!

### `useStorefront`

For imperative calls (event handlers, store actions, server routes), use `useStorefront`:

```ts
import { PREDICTIVE_SEARCH } from '@@/graphql/queries/search'

const { data } = await useStorefront().request(PREDICTIVE_SEARCH, {
  variables: { query: 'shirt' },
})
```

### `useStorefrontData`

For reactive data fetching, use `useStorefrontData`. It wraps `useAsyncData`, so `watch`, `transform`, `pick`, etc. all work:

```ts
import { PRODUCT } from '@@/graphql/queries/product'

// Product Query
const productVars = computed<ProductQueryVariables>(() => ({
  handle: handle.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode,
}))

const { data: product } = await useStorefrontData(`product-${handle.value}`, PRODUCT, {
  variables: productVars,
  transform: (data) => data.product,
  watch: [productVars],
})
```

Ideal for working with actions in `Pinia`:

```ts
import { CART_CREATE } from '@@/graphql/mutations/cart'

// Cart store actions
actions: {
  async createCart(input?: CartInput, optionalParams?: CartOptionalInput) {
    try {
      const { data } = await useStorefront().request(CART_CREATE, {
        variables: {
          input: input,
          ...optionalParams,
        },
      })

      const response = data?.cartCreate

      if (response?.userErrors?.length) {
        throw new Error(response?.userErrors[0]?.message)
      }

      this.cart = response?.cart
    } catch (error) {
      console.error('Cannot create cart:', error)
      throw error
    }
  },
  // More cart actions...
}
```

Requests made from the browser are proxied through Nitro, and both client and proxy caching are configurable per request via `cache: 'short' | 'long'`. Nitrogen adds a third `catalog` tier (5 minutes) in `nuxt.config.ts`, which the collection, product and search queries opt into — these are keyed by country and language, so they are safe to share between visitors. Never assign a cache tier to cart or customer queries. See the [caching guide](https://shopify.nuxtjs.org/essentials/caching) for details.

### Customer Accounts

Accounts run on Shopify's Customer Account API. The OAuth routes, session cookie and token handling are provided by the module. The `/account` route is protected with the `customer-account` middleware, and `useCustomerAccountSession` exposes `user`, `isLoggedIn`, `login` and `logout`:

```vue
<script setup lang="ts">
import { CUSTOMER } from '@@/graphql/customer-account/queries/customer'

definePageMeta({
  middleware: 'customer-account',
})

const { logout } = useCustomerAccountSession()

const { data: customer } = await useCustomerAccountData('account-customer', CUSTOMER, {
  transform: (data) => data.customer,
})
</script>
```

Customer Account documents live in `/graphql/customer-account` and their types are available from `#shopify/customer-account`.

> [!IMPORTANT]
> Shopify redirects back to a publicly reachable URL, so the login flow does not complete against `localhost`. For local development, set `shopify.clients.customerAccount.dev.tunnelURL` to a tunnel (e.g. ngrok) so the module Dev Bridge hands the session back to your local server. In production, set `NUXT_SHOPIFY_CLIENTS_CUSTOMER_ACCOUNT_SESSION_PASSWORD` (32+ characters).

### Analytics

Shopify's headless analytics is enabled by default, so page views are reported automatically and renderless view components cover the rest:

```vue
<template>
  <ShopifyProductView :data="{ products: [analyticsProduct] }" />
  <ShopifyCollectionView :data="{ collection: { id: collection.id, handle: collection.handle } }" />
  <ShopifySearchView :data="{ searchTerm: query }" />
  <ShopifyCartView :data="{ cart: analyticsCart }" />
</template>
```

Cart events are derived by diffing carts, so [`~/plugins/shopify-analytics.client.ts`](app/plugins/shopify-analytics.client.ts) watches the cart store and hands each update to `setCart`. The mapping helpers in [`~/utils/analytics.ts`](app/utils/analytics.ts) reshape the Shopify fragments into the payloads the analytics bus expects.

> [!NOTE]
> Every event is gated on Shopify's Customer Privacy API, so nothing is sent until the visitor consents in regions that require it. Use `ShopifyPrivacyBanner` or `analytics.setTrackingConsent()` to record that choice.

### `flattenConnection`

A handy `flattenConnection` utility function is auto-imported to make working with GraphQL connection objects much more simple. This utility extracts and flattens nested node arrays, making your node data easier to work with:

```ts
// Access variant nodes
const variants = computed(() => 
  flattenConnection(product.value?.variants) as ProductVariantFragment[]
)

// Use node data for something...
const currentVariant = computed(() =>
  variants.find((variant) =>
    variant.selectedOptions.every(({ name, value }) =>
      isSizeOption(name) ? value === selectedSize.value : true,
    ),
  ),
)
```

## 🚀 Deployment

This project is deployed using Cloudflare Workers. For headless ecommerce, Cloudflare offers better SSR performance and more cost-effective pricing at scale compared to providers like Vercel or Netlify.

> [!IMPORTANT]
> If you do not want to deploy on Cloudflare, no worries! Simply remove the `@nuxthub/core` dependency, `wrangler.jsonc` file, and the `deploy` command found in the `package.json`.

## 🌱 Contribute

Contributions are always welcome! If you’d like to help improve this project, here’s how you can get involved:

- Post an issue: Use the [Issues tab](https://github.com/rylanharper/nitrogen/issues) to report bugs or request new features.
- Start a discussion: Share ideas or ask for help in the [Discussions tab](https://github.com/rylanharper/nitrogen/discussions).
- Submit a pull request: If you’d like to contribute, fork the repository, make your changes, and submit a pull request for review.

I actively monitor this repository and will do my best to respond quickly. Whether it’s fixing a small typo or adding a new feature, every contribution helps!
