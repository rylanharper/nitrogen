<p align="center">
  <a href="https://github.com/rylanharper/nitrogen">
    <img src="./public/logo.svg" width="145" height="145" alt="Nitrogen Logo" />
  </a>
</p>

# Nitrogen

Nitrogen is a Nuxt template inspired by Shopify's [Hydrogen](https://github.com/Shopify/hydrogen) framework for headless commerce. This template is designed to empower Nuxt developers to build fast, scalable, and customizable storefronts that incorporate key features from Hydrogen's starter theme.

> [!IMPORTANT]
> This template now uses the official [`@nuxtjs/shopify`](https://github.com/nuxt-modules/shopify) module for its Storefront and Customer Account API integration. Check out the module's documentation for more context on how to query and use Shopify data within Nuxt.

## ✨ Key Features

- 💪 Strongly typed
- 🛒 Cart functionality
- 🗂️ Collection pages, with pagination
- 🕹️ Collection filter and sort
- 👕 Product pages, with metafields
- 🔍 Search functionality
- 🌐 Shop localization
- 👤 Customer accounts
- 📊 Shopify analytics
- 💡 Sitemap, with robots
- 🎠 Embla Carousel
- 🎨 Tailwind v4
- 🔮 Codegen

## 💻 Development

Environment variables:

```ini
# Shopify
NUXT_SHOPIFY_NAME=your-shop-name

# Storefront API
NUXT_SHOPIFY_STOREFRONT_API_VERSION=2026-01
NUXT_SHOPIFY_STOREFRONT_PUBLIC_ACCESS_TOKEN=your_storefront_access_token

# Customer Account API
NUXT_SHOPIFY_CUSTOMER_ACCOUNT_API_VERSION=2026-01
NUXT_SHOPIFY_CUSTOMER_ACCOUNT_CLIENT_ID=your_client_id
NUXT_SHOPIFY_CUSTOMER_ACCOUNT_SESSION_PASSWORD=at_least_32_characters # openssl rand -base64 32

# Analytics
NUXT_SHOPIFY_ANALYTICS_STOREFRONT_ID=your_storefront_id
```

> [!WARNING]
> It is strongly recommended that you use the `2026-01` Storefront API version or higher. If not, you will not have access to new API features found within this template (this will cause breaking changes).

### Local Setup

1. Install dependencies using `pnpm install`
2. Start the development server using `pnpm dev`

Types are generated automatically on `nuxt prepare`, `nuxt dev` and `nuxt build`, so there is no separate codegen step.

## ⚡ Basic Usage

Shopify is wired up with the official [`@nuxtjs/shopify`](https://shopify.nuxtjs.org) module, which provides the typed clients, the server-side proxy, request caching, and type generation.

> [!TIP]
> Read the module's [documentation](https://shopify.nuxtjs.org) to learn how to query and use Shopify data within Nuxt.

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
