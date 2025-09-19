import type { CodegenConfig } from '@graphql-codegen/cli'

import { adminApiCustomScalars, storefrontApiCustomScalars } from './codegen.helpers'
import { adminApiSchema, storefrontApiSchema } from './codegen.schema'

const config: CodegenConfig = {
  overwrite: true,
  generates: {
    // Admin
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
    // Storefront
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
  },
}

export default config
