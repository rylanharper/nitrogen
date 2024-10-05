# Nitrogen

**Nitrogen** is a Nuxt.js template inspired by Shopify's Hydrogen framework for headless commerce. This template is designed to empower Nuxt and Vue developers to build fast, scalable, and customizable storefronts, incorporating key features from Hydrogen’s starter theme.

> [!IMPORTANT]
> This template is designed for Nuxt/Vue developers who are already familiar with the Shopify API and have prior experience building headless storefronts. While it demonstrates best practices for using Nuxt with the Shopify GraphQL API, it assumes a foundational knowledge of these technologies.

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

To begin using Nitrogen, you'll need to set up the following environment variables:

```ts
SHOPIFY_STOREFRONT=
SHOPIFY_ACCESS_TOKEN=
SHOPIFY_API_VERSION=
```

Make sure to populate these variables with your Shopify store's specific information:

- `SHOPIFY_STOREFRONT`: Your Shopify store's URL
- `SHOPIFY_ACCESS_TOKEN`: Your Storefront API access token
- `SHOPIFY_API_VERSION`: The version of the Shopify API you're using (`2024-07`)

> [!WARNING]
> These environment variables are crucial for connecting your Nitrogen-based storefront to your Shopify backend. It recommended that you use the `2024-07` API version or higher when using this template. If not, you will not have access to certain graphql features such as filters or swatches.
