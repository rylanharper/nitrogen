# Nitrogen

Nitrogen is a Nuxt template inspired by Shopify's Hydrogen framework for headless commerce. This template is designed to empower Nuxt developers to build fast, scalable, and customizable storefronts that incorporate key features from Hydrogen's starter theme.

> [!IMPORTANT]
> This template now features a minimal [Sanity](https://www.sanity.io/) integration on a separate branch. This pairs with the [Nitrogen Sanity Studio](https://github.com/rylanharper/nitrogen-sanity-studio), which synchronizes content between a Sanity dataset and your Shopify storefront.

## ✨ Key Features

- 💪 Strongly typed
- 🛒 Cart functionality
- 🔒 User authentication, with password reset
- 👤 Full customer account functionality
- 🗂️ Collection pages, with pagination
- 🕹️ Collection filter and sort functionality
- 👕 Product pages, with metafields
- 🔍 Search functionality
- 📫 Klaviyo integration
- 🌐 Shop localization
- 🎠 Embla Carousel
- 🌊 Tailwind v4

## 💎 Shopify Setup

Before using Nitrogen, you must configure your Shopify store as follows:

### API Permissions

Within your Shopify dashboard, navigate to `Settings` → `Apps and Sales Channels` → `Develop Apps` and create a custom app. Name it "Headless Storefront" so it's clear what it's being used for and configure the necessary Storefront API permissions needed for your project. To keep things simple, enable all Storefront API access scopes. Once the app is created, retrieve your storefront API access token to use in the project’s environment variables.

### Localization

To support international currencies and localized experiences, navigate to `Settings` → `Markets` and configure your global currency markets by either selecting `International` or `Add Market`. This allows customers to view prices in their local currency or switch between markets if needed.

### Creating Products

There are many ways to create and organize products in Shopify. For this project, I chose to have each product exist as a single SKU. This means that if a product has multiple variations (such as different colors), each variation will exist as its own separate product. This approach allows each variation to display individually in collection grids and helps prevent variant bloat. Generally, each product is recommended to have one `Color` option and a `Size` option with multiple values (e.g., S, M, L). However, it is perfectly fine for a product to have one or even zero options to work properly with this template.

### Filtering Products

To enable filter and sort functionality, install the [Shopify Search & Discovery](https://apps.shopify.com/search-and-discovery?search_id=81e9e3f8-f482-4c8c-83c2-a80090d606df&surface_detail=search+and+discovery&surface_inter_position=1&surface_intra_position=5&surface_type=search) app. Once installed, navigate to `Apps` → `Shopify Search & Discovery` → `Filters` and set up basic filter options. You'll likely need to remove some default options or add more if needed. This template uses the `Availability`, `Color`, `Size`, and `Product Type` filter options. Make sure the source for `Color` and `Size` is set to `Product Option`.

After creating your filters, return to your product pages and connect each `Color` and `Size` variant option (if they exist) to their relevant metafields. Once set up, all products with options linked to these metafields will filter correctly on collection pages.

### Metaobjects

This template uses metaobjects to create unique store objects that can be connected to metafields. The filter component, in particular, makes use of a `color_swatch` metaobject to filter products by general color name, hexcode, or image. This is especially helpful when a color has varying shades or a specific, non-standard name, as it can be associated with a general color swatch that users recognize.

To create the `color_swatch` metaobject, navigate to `Settings` → `Custom Data` and click `Add Definition` at the bottom of the page. Name it "Color Swatch" and add the following field definitions:

1. `Name`: `Single Line Text` (one value). This represents the general swatch color name.
2. `Hexcode`: `Color` (one value). This allows you to specify a custom hex code for the swatch color.
3. `Image`: `File` (one value). This enables you to upload an optional image to display as the swatch color.

After defining these fields, exit the settings menu and navigate to `Content` → `Metaobjects`. You will see your newly created `Color Swatch` metaobject. Click into it, then click `Add Entry` in the top-right corner to start creating your general color swatches with names, hex codes, and optional images.

Once this is completed, navigate to `Shopify Search & Discovery` → `Filters` → `Color` and group your product color option names (if any exist) under the same general color names defined in the `color_swatch` metaobject entries. This ensures consistent and user-friendly filtering for your store.

### Metafields

This template uses metafields to make working with custom data in Shopify easier. To enable product metafields, navigate to `Settings` → `Custom Data` → `Products` and add the following product metafield definitions:

1. `filter_color`: `Metaobject` list metafield that references the `color_swatch` metaobject. This ensures general color names, hexcodes, or images can be associated with a product for filtering on collection pages.
2. `matching_colors`: `Product` list metafield that connects to products with matching colors. Provides full access to the referenced product's data, which is ideal for checking availability, options, media, and more.
3. `details`: `Rich Text` metafield for displaying additional product details, such as specifications, materials, or care instructions. Used to enrich product descriptions and provide product-specific information to customers.
4. `shipping`: `Rich Text` metafield for sharing shipping information, like delivery timelines, restrictions, or return policies. Ideal for ensuring customers quickly know all the necessary shipping info before purchasing.

Once created, these metafields will be accessible on each product page.

### Customer Accounts

In order to setup customer account functionality, make sure that all API permissions under `Customers` are enabled within your main "Headless Storefront" app. Next, navigate to `Notifications` → `Customer Notifications` → `Customer Account Password Reset` and edit the code. You'll want to find the "Reset your password" button and replace the `<a>` tag with the following:

```html
{% assign url_parts = customer.reset_password_url  | split: '/' %}
<a href="https://your-site-domain.com/account/reset?id={{url_parts[5]}}&token={{url_parts[6]}}" class="button__text">Reset your password</a>
```

This will redirect password reset emails to your custom domain while maintaining the necessary security parameters. Remember to replace `your-site-domain.com` with your actual domain name.

## 📫 Klaviyo Setup (Optional)

Nitrogen also features Klaviyo integration for email marketing. This is a great way to send product updates, special offers, and back-in-stock notifications to customers.

The template includes two streamlined [Klaviyo API proxies](https://github.com/rylanharper/nitrogen/blob/master/server/api/klaviyo.ts): one for general client subscriptions and another for back-in-stock subscriptions. Both are designed to work seamlessly with the latest `2025-01-15` API version while ensuring optimal performance and security.

### API Keys

Within your Shopify dashboard, install the [Klaviyo: Email Marketing & SMS](https://apps.shopify.com/klaviyo-email-marketing) app and go through the initial setup to connect Klaviyo to your storefront. After you complete this, login to your Klaviyo dashboard and navigate to `Settings` → `Account` → `API Keys`. Here you can find your public API key and also generate your private API Key.

### List IDs

To ensure client subscriptions are directed to the appropriate email list (e.g., your newsletter), you need to assign the newsletter list ID to the `listId` variable in the [klaviyo-newsletter](https://github.com/rylanharper/Nitrogen/blob/master/app/components/klaviyo/klaviyo-newsletter.vue) component. You can locate your newsletter list ID by logging into your Klaviyo dashboard and navigating to `Audience` → `Lists & Segments`. Select your `Newsletter` list, then click on `Settings` to view the List ID.

## ✳️ Nuxt Setup

To begin using Nitrogen, you'll need to add the following environment variables:

```ini
# Shopify
NUXT_SHOPIFY_STOREFRONT=https://your-shop-name.myshopify.com
NUXT_SHOPIFY_ACCESS_TOKEN=your_storefront_access_token
NUXT_SHOPIFY_API_VERSION=2025-01

# Klaviyo
NUXT_KLAVIYO_PUBLIC_API_KEY=your_public_api_key
NUXT_KLAVIYO_PRIVATE_API_KEY=your_private_api_key
NUXT_KLAVIYO_API_VERSION=2025-01-15
```

> [!WARNING]
> It is strongly recommended that you use the `2024-07` Storefront API version or higher. If not, you will not have access to new API features found within this template (this will cause breaking changes).

### Development

1. Install dependencies using `pnpm install`
2. Generate your project types using `pnpm codegen`
3. Start the development server using `pnpm dev`

## ⚡ Basic Usage

Nitrogen provides a [minimal GraphQL client](https://github.com/rylanharper/nitrogen/blob/master/server/utils/graphql-client.ts) that seamlessly integrates with Shopify's Storefront API. It uses a [server-side proxy](https://github.com/rylanharper/nitrogen/blob/master/server/api/shopify.ts) to handle API authentication and requests, while offering a typed interface for executing GraphQL operations.

### GraphQL Operations

This project includes pre-built GraphQL operations for common Shopify queries and mutations, such as retrieving cart data, localization, and more. All available operations can be found in the [operations folder](https://github.com/rylanharper/nitrogen/tree/master/server/operations). Feel free to add or remove operations that fit your project needs.

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
- Submit a Pull Request: If you’d like to contribute, fork the repository, make your changes, and submit a pull request for review.

I actively monitor this repository and will do my best to respond quickly. Whether it’s fixing a small typo or adding a new feature, every contribution helps!
