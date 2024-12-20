# Nitrogen

Nitrogen is a Nuxt template inspired by Shopify's Hydrogen framework for headless commerce. This template is designed to empower Nuxt and Vue developers to build fast, scalable, and customizable storefronts that incorporate key features from Hydrogen's starter theme.

> [!IMPORTANT]
> This template is designed for developers who are already familiar with the GraphQL Storefront API and have prior experience building headless storefronts.

## ✨ Key Features

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
- 💪 Strongly typed

## 💎 Shopify Setup

Before using Nitrogen, you must configure your Shopify store as follows:

### API Permissions

Within your Shopify admin dashboard, navigate to `Settings` → `Apps and Sales Channels` → `Develop Apps` and create a custom app. Name it "Headless Storefront" so it's clear what it's being used for and configure the necessary Storefront API permissions needed for your project. To keep things simple, enable all Storefront API access scopes. Once the app is created, retrieve your storefront API access token to use in the project’s environment variables.

### Localization

To support international currencies and localized experiences, enable Markets within your Shopify admin dashboard. Navigate to `Settings` → `Markets` and configure your global currency markets by either selecting `International` or `Add Market`. This allows customers to view prices in their local currency and switch between markets.

### Filtering Products

To enable product filters, install the [Shopify Search & Discovery](https://apps.shopify.com/search-and-discovery?search_id=81e9e3f8-f482-4c8c-83c2-a80090d606df&surface_detail=search+and+discovery&surface_inter_position=1&surface_intra_position=5&surface_type=search) app. Once this is installed, navigate to `Apps` → `Shopify Search & Discovery` → `Filters` and set up basic filter options. You'll likely need to remove some default options, or add more if needed. This template uses the `availability`, `color`, `size`, and `productType` filter options.

### Metafields

This template uses metafields to make working with Shopify easier. To enable product metafields, navigate to `Settings` → `Custom Data` → `Products` and add the following product metafield definitions:

1. `matching_colors`: A product reference list metafield that handles product swatch colors. This metafield allows access to the full data of referenced products, which is ideal for checking availability, option names/values, media, and more.
2. `details`: A rich-text metafield designed to display additional product details, such as specifications, materials, or care instructions. Perfect for enhancing product descriptions with structured content.
3. `shipping`: A rich-text metafield for sharing shipping-specific information, like delivery timelines, restrictions, or return policies.

### Customer Accounts

In order to setup customer account functionality, make sure that all API permissions under `Customers` are enabled within your main "Headless Storefront" app. Next, navigate to `Notifications` → `Customer Notifications` → `Customer Account Password Reset` and edit the code. You'll want to find the "Reset your password" button and replace the `<a>` tag with the following:

```html
{% assign url_parts = customer.reset_password_url  | split: '/' %}
<a href="https://your-site-domain.com/account/reset?id={{url_parts[5]}}&token={{url_parts[6]}}" class="button__text">Reset your password</a>
```

This will redirect password reset emails to your custom domain while maintaining the necessary security parameters. Remember to replace `your-site-domain.com` with your actual domain name.

## 📫 Klaviyo Setup

Nitrogen also features Klaviyo integration for email marketing. This is a great way to send product updates, special offers, and back-in-stock notifications to customers.

The template includes two streamlined Klaviyo API proxies: one for general client subscriptions and another for back-in-stock subscriptions. Both are designed to work seamlessly with the latest `2024-10-15` API version while ensuring optimal performance and security.

### API Keys

Within your Shopify admin, install the [Klaviyo: Email Marketing & SMS](https://apps.shopify.com/klaviyo-email-marketing) app and go through the initial setup to connect Klaviyo to your storefront. After you complete this, login to your Klaviyo dashboard and navigate to `Settings` → `Account` → `API Keys`. Here you can find your public API key and also generate your private API Key.

### List IDs

To ensure client subscriptions are directed to the appropriate email list (e.g., your newsletter), you need to assign the newsletter list ID to the listId variable in the [klaviyo-newsletter](https://github.com/rylanharper/Nitrogen/tree/master/server/operations) component. You can locate your newsletter list ID by logging into your Klaviyo dashboard and navigating to `Audience` → `Lists & Segments`. Select your `Newsletter` list, then click on `Settings` to view the List ID.

## ✳️ Nuxt Setup

To begin using Nitrogen, you'll need to set up the following environment variables:

```ini
# Shopify
NUXT_SHOPIFY_STOREFRONT=https://your-shop-name.myshopify.com
NUXT_SHOPIFY_ACCESS_TOKEN=your_storefront_access_token
NUXT_SHOPIFY_API_VERSION=2024-07

# Klaviyo
NUXT_KLAVIYO_PUBLIC_API_KEY=your_public_api_key
NUXT_KLAVIYO_PRIVATE_API_KEY=your_private_api_key
NUXT_KLAVIYO_API_VERSION=2024-10-15
```

> [!WARNING]
> It is strongly recommended that you use the `2024-07` Storefront API version or higher. If not, you will not have access to new API features found within this template (this will cause breaking changes).

### Development

1. Install dependencies using `pnpm install`
2. Generate your project types using `pnpm codegen`
3. Start the development server using `pnpm run dev`

## ⚡ Basic Usage

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
- Contribute: If you’d like to contribute, fork the repository, make your changes, and submit a pull request for review.

I actively monitor this repository and will do my best to respond quickly. Community feedback and contributions are always appreciated!
