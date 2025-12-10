import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "src/graphql/schema/**/*.ts",
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript", "typescript-resolvers"],
      config: {
        mappers: {
          User: "../models/MUser.js#UserDocument",
          Document: "../models/MDocument.js#DocumentDocument",
        },
      },
    },
  },
};

export default config;
