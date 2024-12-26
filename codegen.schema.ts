import type { CodegenConfig } from '@graphql-codegen/cli';

import dotenv from 'dotenv';

dotenv.config();

if (!process.env.NUXT_SHOPIFY_STOREFRONT || !process.env.NUXT_SHOPIFY_API_VERSION || !process.env.NUXT_SHOPIFY_ACCESS_TOKEN) {
  throw new Error('Missing required environment variables for the Shopify API.');
}

export const storefrontApiSchema: CodegenConfig['schema'] = {
  [`${process.env.NUXT_SHOPIFY_STOREFRONT}/api/${process.env.NUXT_SHOPIFY_API_VERSION}/graphql.json`]:
    {
      headers: {
        'X-Shopify-Storefront-Access-Token': process.env.NUXT_SHOPIFY_ACCESS_TOKEN,
        'content-type': 'application/json'
      }
    }
};
