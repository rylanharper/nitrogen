import type { CodegenConfig } from '@graphql-codegen/cli';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.SHOPIFY_STOREFRONT || !process.env.SHOPIFY_API_VERSION || !process.env.SHOPIFY_ACCESS_TOKEN) {
  throw new Error('Missing required environment variables for the Shopify API');
}

export const storefrontApiSchema: CodegenConfig['schema'] = {
  [`https://${process.env.SHOPIFY_STOREFRONT}.myshopify.com/api/${process.env.SHOPIFY_API_VERSION}/graphql.json`]:
    {
      headers: {
        'X-Shopify-Storefront-Access-Token': process.env.SHOPIFY_ACCESS_TOKEN,
        'content-type': 'application/json'
      }
    }
};
