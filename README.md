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
NUXT_SHOPIFY_DOMAIN=your-shop-name.myshopify.com
NUXT_SHOPIFY_ADMIN_ACCESS_TOKEN=your_admin_access_token
NUXT_SHOPIFY_STOREFRONT_ACCESS_TOKEN=your_storefront_access_token
NUXT_SHOPIFY_API_VERSION=2026-01

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
2. Generate your project types using `pnpm codegen`
3. Start the development server using `pnpm dev`

## ⚡ Basic Usage

Nitrogen features two custom modules for [Shopify](https://github.com/rylanharper/nitrogen/blob/master/modules/shopify) and [Klaviyo](https://github.com/rylanharper/nitrogen/blob/master/modules/klaviyo), located in the `/modules` folder. The Shopify module lets you connect to both the Storefront API and Admin API at the same time, which is ideal for building complex storefronts that may use Shopify to act a database in some way.

> [!TIP]
> Read the official Nuxt Author Module Guide to learn how to create and manage your own modules!

[Author Module Guide](https://nuxt.com/docs/4.x/guide/modules/getting-started)

### API Integration

A minimal [GraphQL client](https://github.com/rylanharper/nitrogen/blob/master/modules/shopify/runtime/resources/graphql-client/index.ts) is provided to seamlessly integrate with both the Storefront API and Admin API. It uses two [server-side proxies](https://github.com/rylanharper/nitrogen/blob/master/modules/shopify/runtime/server) to handle API authentication and requests, while offering a typed interface for executing GraphQL operations.

The client `query` function accepts three optional parameters:

- `api` – Choose between `storefront` (default) or `admin`.
- `maxRetries` – Number of retry attempts on failure (default: `3`).
- `cacheable` – Enable response caching for common queries (default: `true`).

> [!WARNING]
> By default, the GraphQL client only caches collection, product, and search queries. Avoid caching global queries or mutations, as this can lead to hydration errors.

### GraphQL Operations

This project includes pre-built GraphQL [operations](https://github.com/rylanharper/nitrogen/tree/master/modules/shopify/runtime/resources/operations) for common queries and mutations frequently used in headless storefront environments. All operations are powered by the GraphQL client `query`, so you can also pass optional parameters when needed:

```ts
import type { MyQuery, MyQueryVariables } from '@@/types/storefront'
import { MY_QUERY } from '../graphql/custom'
import { query } from '../graphql-client'

// Fetch example with optional params
const fetchExample = async (variables: MyQueryVariables) => {
  const response = await query(MY_QUERY, variables, { api: 'admin' })
  return response.data?.item
}
```

Feel free to add or remove operations that fit your project needs!

### `useShopify`

To get GraphQL operations, use the `useShopify` composable:

```ts
const shopify = useShopify()
```

Operations can be referenced using dot notation:

```ts
// Composable
const shopify = useShopify()

// With dot notation
await shopify.cart.addLines(cart.id, [ ... ])
await shopify.product.get({ handle: 'example-product' })
```

Perfect for reactive data fetching using `useAsyncData`:

```ts
// Composable
const shopify = useShopify()

// Product Query
const productVars = computed<ProductQueryVariables>(() => ({
  handle: handle.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode,
}))

const { data: productData } = await useAsyncData(
  `product-${handle.value}`,
  () => shopify.product.get(productVars.value),
  { watch: [productVars] },
)

// Product response data
const product = computed(() => productData.value)
```

Ideal for working with actions in `Pinia`:

```ts
// Composable
const shopify = useShopify()

// Cart store actions
actions: {
  async createCart(input?: CartInput, optionalParams?: CartOptionalInput) {
    try {
      const response = await shopify.cart.create({
        input: input,
        ...optionalParams,
      })

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

### `flattenConnection`

A handy `flattenConnection` utility function is provided to make working with GraphQL connection objects much more simple. This utility extracts and flattens nested node arrays, making your node data easier to work with:

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
