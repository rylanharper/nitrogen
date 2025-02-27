# Nitrogen

Nitrogen is a Nuxt template inspired by Shopify's [Hydrogen](https://github.com/Shopify/hydrogen) framework for headless commerce. This template is designed to empower Nuxt developers to build fast, scalable, and customizable storefronts that incorporate key features from Hydrogen's starter theme.

> [!IMPORTANT]
> This template now features a minimal [Sanity](https://www.sanity.io/) integration on a separate `sanity` branch. This is meant to pair with the [Nitrogen Sanity Studio](https://github.com/rylanharper/nitrogen-sanity-studio) template, which synchronizes content between a Sanity dataset and your Shopify storefront.

## ✨ Key Features

- 💪 Strongly typed
- 🛒 Cart functionality
- 🔒 User authentication, with password reset
- 👤 Full customer account functionality
- 🗂️ Collection pages, with pagination
- 🕹️ Collection filter and sort functionality
- 👕 Product pages, with metafields
- 🔍 Search functionality
- 🌐 Shop localization
- 📫 Klaviyo integration
- 🧠 Sanity integration
- 🎠 Embla Carousel
- 🌊 Tailwind v4
- 🔮 Codegen

## 📖 Documentation

Make sure to read through the documentation to learn how to configure your Shopify store to work with Nitrogen. This setup process will take approximately 10-15 minutes.

> [!TIP]
> [Nitrogen documentation](https://nitrogendocs.netlify.app/)

## 💻 Development

To begin using Nitrogen, you'll need to add the following environment variables:

```ini
# Shopify
NUXT_SHOPIFY_STOREFRONT=https://your-shop-name.myshopify.com
NUXT_SHOPIFY_ACCESS_TOKEN=your_storefront_access_token
NUXT_SHOPIFY_API_VERSION=2025-01

# Klaviyo (optional)
NUXT_KLAVIYO_PUBLIC_API_KEY=your_public_api_key
NUXT_KLAVIYO_PRIVATE_API_KEY=your_private_api_key
NUXT_KLAVIYO_API_VERSION=2025-01-15
```

> [!WARNING]
> It is strongly recommended that you use the `2024-07` Storefront API version or higher. If not, you will not have access to new API features found within this template (this will cause breaking changes).

### Local Setup

1. Install dependencies using `pnpm install`
2. Generate your project types using `pnpm codegen`
3. Start the development server using `pnpm dev`

## ⚡ Basic Usage

Nitrogen provides a minimal [GraphQL client](https://github.com/rylanharper/nitrogen/blob/master/server/utils/graphql-client.ts) that seamlessly integrates with Shopify's Storefront API. It uses a [server-side proxy](https://github.com/rylanharper/nitrogen/blob/master/server/api/shopify.ts) to handle API authentication and requests, while offering a typed interface for executing GraphQL operations.

### Operations

This project includes pre-built operations for common Shopify queries and mutations, such as retrieving cart data, localization, and more. All available Shopify operations can be found in the [operations folder](https://github.com/rylanharper/nitrogen/tree/master/server/operations/shopify). Feel free to add or remove operations that fit your project needs.

### Composable

To get GraphQL operations, use the `useShopify` composable:

```ts
const shopify = useShopify();
```

Operations can be referenced using this composable with dot notation:

```ts
// Shopify
const shopify = useShopify();

// With dot notation
await shopify.cart.addLines(cart.id, [ ... ])
await shopify.product.get({ handle: 'example-product' })
```

### With `useAsyncData`

Perfect for reactive data fetching in pages or components:

```ts
// Shopify
const shopify = useShopify();

// Fetch data
const productVars = computed<ProductQueryVariables>(() => ({
  handle: handle.value,
  country: shopStore.buyerCountryCode,
  language: shopStore.buyerLanguageCode
}))

const { data: productData } = await useAsyncData(
  `product-${handle.value}`,
  () => shopify.product.get(productVars.value),
  { watch: [productVars] }
);

// Computed data
const product = computed(() => productData.value)
```

### With `Pinia`

Ideal for working with actions in your Pinia stores:

```ts
// Shopify
const shopify = useShopify();

// Cart actions
actions: {
  async createCart(input?: CartInput, optionalParams?: CartOptionalInput) {
    try {
      const response = await shopify.cart.create({
        input: input,
        ...optionalParams
      });

      if (response?.userErrors?.length) {
        throw new Error(response?.userErrors[0]?.message);
      }

      this.cart = response?.cart;
    } catch (error: any) {
      console.error('Cannot create cart:', error.message);
      throw error;
    }
  },
  // More actions...
}
```

## 🌱 Contribute

Contributions are always welcome! If you’d like to help improve this project, here’s how you can get involved:

- Post an issue: Use the [Issues tab](https://github.com/rylanharper/nitrogen/issues) to report bugs or request new features.
- Start a discussion: Share ideas or ask for help in the [Discussions tab](https://github.com/rylanharper/nitrogen/discussions).
- Submit a pull request: If you’d like to contribute, fork the repository, make your changes, and submit a pull request for review.

I actively monitor this repository and will do my best to respond quickly. Whether it’s fixing a small typo or adding a new feature, every contribution helps!
