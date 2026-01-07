import type { CodegenConfig } from '@graphql-codegen/cli'

import { adminApiCustomScalars, storefrontApiCustomScalars } from './codegen.helpers'
import { adminApiSchema, storefrontApiSchema } from './codegen.schema'

if (!storefrontApiSchema) {
  throw new Error(
    'Missing required Shopify environment variables for Storefront API Codegen support.',
  )
}

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    // Admin
    ...(adminApiSchema && {
      './types/shopify-admin.d.ts': {
        schema: adminApiSchema,
        documents: './modules/shopify/runtime/resources/graphql/admin/**/*.ts',
        plugins: ['typescript', 'typescript-operations'],
        config: {
          skipTypename: true,
          useTypeImports: true,
          defaultScalarType: 'unknown',
          useImplementingTypes: true,
          enumsAsTypes: true,
          scalars: adminApiCustomScalars,
        },
      },
    }),
    // Storefront
    ...(storefrontApiSchema && {
      './types/shopify-storefront.d.ts': {
        schema: storefrontApiSchema,
        documents: './modules/shopify/runtime/resources/graphql/storefront/**/*.ts',
        plugins: ['typescript', 'typescript-operations'],
        config: {
          skipTypename: true,
          useTypeImports: true,
          defaultScalarType: 'unknown',
          useImplementingTypes: true,
          enumsAsTypes: true,
          scalars: storefrontApiCustomScalars,
        },
      },
    }),
  },
}

export default config
