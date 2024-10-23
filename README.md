# Nitrogen

**Nitrogen** is a Nuxt template inspired by Shopify's Hydrogen framework for headless commerce. This template is designed to empower Nuxt and Vue developers to build fast, scalable, and customizable storefronts, incorporating key features from Hydrogen’s starter theme.

> [!IMPORTANT]
> This template is designed for developers who are already familiar with the Shopify API and have prior experience building headless storefronts.

## ✨ Key Features

- 🛒 Cart functionality
- 🔒 User authentication, with password reset
- 👤 Full customer account functionality
- 🗂️ Collection/search filters and sort
- 👕 Collection and product pages
- 🔍 Search functionality
- 🌐 Shop localization
- 💪 Strongly typed

## 🚀 Get Started

> [!NOTE]
> Nitrogen provides a solid foundation for headless Shopify development in Nuxt, but comes with opinionated choices regarding structure and organization. Feel free to customize the queries, functions, pages, and components to match your project's specific needs!

### Shopify

Before using Nitrogen, you must configure your Shopify store as follows:

1. Within your Shopify admin dashboard, create a custom app and configure the necessary Storefront API permissions needed for your project. Enable all Storefront API access scopes to keep things simple. Once the app is created, retrieve your storefront API access token to use in the project’s environment variables.

2. To support international currencies and localized experiences, enable Markets within your Shopify admin dashboard. Navigate to `Settings` > `Markets` > `Preferences` and configure your global currencies. This ensures that customers can see prices in their local currency and switch markets if needed.

3. To enable product filtering, install the [Shopify Search & Discovery](https://apps.shopify.com/search-and-discovery?search_id=81e9e3f8-f482-4c8c-83c2-a80090d606df&surface_detail=search+and+discovery&surface_inter_position=1&surface_intra_position=5&surface_type=search) app and set up basic filters. This template uses the availability, product type, size, and color filter options. You'll likely need to remove some default filter options, or you can add more filters if needed.

4. Additionally, you'll want to add a custom `related_products` metafield to display related products on your product pages. This metafield allows you to reference the full data of related products, which is ideal for managing matching color swatches, media, and more.

> [!TIP]
> [📖 Read the Storefront API documentation](https://shopify.dev/docs/api/storefront)

### Nuxt

To begin using Nitrogen, you'll need to set up the following environment variables:

```ini
SHOPIFY_STOREFRONT=
SHOPIFY_ACCESS_TOKEN=
SHOPIFY_API_VERSION=
```

> [!WARNING]
> It is strongly recommended that you use the `2024-07` API version or higher. If not, you will not have access to new API features found within this template.

### Development

1. Install dependencies using `pnpm install`
2. Generate your project types using `pnpm codgen`
3. Start the development server using `pnpm run dev`

> [!TIP]
> [📖 Read the Nuxt documentation](https://nuxt.com/)

## 🛠️ Basic Usage
