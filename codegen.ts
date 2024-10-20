import type { CodegenConfig } from '@graphql-codegen/cli';
import { storefrontApiSchema } from './codegen.schema';
import { customerAccountApiCustomScalars } from './codegen.helpers';

const config: CodegenConfig = {
  schema: storefrontApiSchema,
  documents: './server/graphql/**/*.ts',
  generates: {
    './types/shopify.ts': {
      plugins: ['typescript', 'typescript-operations'],
      config: {
        useTypeImports: true,
        defaultScalarType: 'unknown',
        useImplementingTypes: true,
        enumsAsTypes: true,
        skipTypename: true,
        scalars: customerAccountApiCustomScalars
      }
    }
  }
};

export default config;
