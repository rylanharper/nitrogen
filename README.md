# Nitrogen

**Nitrogen** is a Nuxt.js template inspired by Shopify's Hydrogen framework for headless commerce. This template is designed to empower Nuxt and Vue developers to build fast, scalable, and customizable storefronts, incorporating key features from Hydrogen’s starter theme.

> [!IMPORTANT]
> This template is designed for developers who are already familiar with the Shopify API and have prior experience building headless storefronts.

## Key Features

- 🛒 Cart functionality
- 🔒 User authentication, with password reset
- 👤 Full customer account functionality
- 🗂️ Collection/search filters and sort
- 👕 Collection and product pages
- 🔍 Search functionality
- 🌐 Shop localization
- 💪 Strongly typed

## Get Started

### Shopify

1. Within your Shopify admin dashboard, create a custom app and configure the necessary Storefront API permissions needed for your project (enable all Storefront API access scopes to keep things simple). Give your app a name like "Headless Storefront" so it's clear what it's being used for. Once the app is created, retrieve your Storefront API access token to use in the project’s environment variables.

2. To enable product filtering, install the [Shopify Search & Discovery](https://apps.shopify.com/search-and-discovery?search_id=81e9e3f8-f482-4c8c-83c2-a80090d606df&surface_detail=search+and+discovery&surface_inter_position=1&surface_intra_position=5&surface_type=search) and set up basic filters. This project uses the product type, size, and color filter options. To customize filters, modify the `getFilterValuesFromUrl` function within the `use-collection-helpers` composable.

3. Add a custom `related_products` metafield to display related products on your product pages. This metafield allows you to reference the full data of related products, which is ideal for managing color swatches, media, etc.

### Nuxt

1. To begin using Nitrogen, you'll need to set up the following environment variables:

```ini
SHOPIFY_STOREFRONT=
SHOPIFY_ACCESS_TOKEN=
SHOPIFY_API_VERSION=
```

> [!WARNING]
> It is recommended that you use the `2024-07` API version or higher. If not, you will not have access to new API features found within this template.

2. Install the dependencies:

```bash
pnpm install # or npm
```

3. Start the project:

```bash
pnpm dev
```
