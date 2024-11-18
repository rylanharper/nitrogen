# Nitrogen

Nitrogen is a Nuxt template inspired by Shopify's Hydrogen framework for headless commerce. This template is designed to empower Nuxt and Vue developers to build fast, scalable, and customizable storefronts, incorporating key features from Hydrogen’s starter theme.

> [!IMPORTANT]
> This template is designed for developers who are already familiar with the GraphQL Storefront API and have prior experience building headless storefronts.

## ✨ Key Features

- 🛒 Cart functionality
- 🔒 User authentication, with password reset
- 👤 Full customer account functionality
- 🗂️ Collection/search filters and sort
- 👕 Collection and product pages
- 🔮 Metafield integration
- 🔍 Search functionality
- 🌐 Shop localization
- 💪 Strongly typed

## 💎 Shopify Setup

Before using Nitrogen, you must configure your Shopify store as follows:

### API Permissions

Within your Shopify admin dashboard, create a custom app and configure the necessary Storefront API permissions needed for your project. Enable all Storefront API access scopes to keep things simple. Once the app is created, retrieve your storefront API access token to use in the project’s environment variables.

### Localization

To support international currencies and localized experiences, enable Markets within your Shopify admin dashboard. Navigate to `Settings` > `Markets` > `Preferences` and configure your global currency markets. This ensures that customers can see prices in their local currency and switch markets if needed.

### Filtering Products

To enable product filtering, install the [Shopify Search & Discovery](https://apps.shopify.com/search-and-discovery?search_id=81e9e3f8-f482-4c8c-83c2-a80090d606df&surface_detail=search+and+discovery&surface_inter_position=1&surface_intra_position=5&surface_type=search) app and set up basic filters. This template uses the `availability`, `color`, `size`, and `productType` filter options. You'll likely need to remove some default filter options within the filter admin settings, or you can add more filters if needed.

To modify the available filter options, you'll need to update two files:

1. Update the [`getFilterValuesFromUrl`](https://github.com/rylanharper/Nitrogen/blob/4119b6b3edfea0afb87eebba50bcfe77882cfc9a/app/composables/use-collection-helpers.ts#L83) helper function to define your filter options.
2. Edit the [`filter-menu.vue`](https://github.com/rylanharper/Nitrogen/blob/master/app/components/filter/filter-menu.vue) component to include (or remove) filter mapping functions.

### Metafields

Nitrogen uses the following product metafields to make working with Shopify data easier:

1. `matching_colors`: This is a product reference list metafield that handles product swatch colors on product pages. This metafield allows access to the full data of referenced products, which is ideal for checking availability, option names/values, media, and more.
2. `details`: This is a richtext metafield that provides additional product information, such as specifications, materials, or care instructions.
3. `shipping`: This is a richtext metafield used to display shipping-specific details, such as delivery timelines, shipping restrictions, or policies.

You can create additional product reference metafield lists by copying the [`matching_colors`](https://github.com/rylanharper/Nitrogen/blob/2f39c405ce5d9a707f319e024d2c0b923d2299ce/server/graphql/queries/product.ts#L13) query structure and changing the key name. This enables you to build features like:

- 🏷️ Related products with `related_products`
- 📸 "Styled with" lists using `styled_with`
- 📦 Curated product bundles via `product_bundles`

## ✳️ Nuxt Setup

To begin using Nitrogen, you'll need to set up the following environment variables:

```ini
NUXT_SHOPIFY_STOREFRONT=http://your-shop-name.myshopify.com
NUXT_SHOPIFY_ACCESS_TOKEN=2024-07
NUXT_SHOPIFY_API_VERSION=your-storefront-access-token
```

> [!WARNING]
> It is strongly recommended that you use the `2024-07` API version or higher. If not, you will not have access to new API features found within this template (this will cause breaking changes).

### Development

1. Install dependencies using `pnpm install`
2. Generate your project types using `pnpm codgen`
3. Start the development server using `pnpm run dev`

## 🏓 Basic Usage

Nitrogen provides a type-safe GraphQL client that seamlessly integrates with Shopify's Storefront API. It uses a server-side proxy to handle API authentication and requests, while offering a typed interface for executing GraphQL operations.

### GraphQL Operations

This project includes pre-built GraphQL operations for common Shopify queries and mutations, such as retrieving cart data, localization, and more. All available operations can be found in the [operations folder](https://github.com/rylanharper/Nitrogen/tree/master/server/operations). Feel free to add or remove operations that fit your project needs.

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
      
      if (response?.cart) {
        this.cart = response.cart;
      }
    } catch (error) {
      console.error('No cart returned from cartCreate mutation', error);
    }
  },
  // More actions...
}
```

## 📣 Need Help?

If you have any questions, encounter issues, or have suggestions for improvements, feel free to:

- Post an issue: Use the [Issues tab](https://github.com/rylanharper/Nitrogen/issues) to report bugs or request new features.
- Start a discussion: Share ideas or ask for help in the [Discussions tab](https://github.com/rylanharper/Nitrogen/discussions).
- Contribute improvements: If you’d like to contribute, fork the repository, make your changes, and submit a pull request for review.

I actively monitor this repository and will do my best to respond quickly. Community feedback and contributions are always appreciated!
