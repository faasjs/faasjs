# GraphQL-Server

基于 [Apollo Federation](https://www.apollographql.com/docs/apollo-server/federation/introduction/) 构建分布式 GraphQL Serverless 服务。

此插件非 `faasjs` 内置，使用前请先通过 `yarn add @faasjs/graphql-server@beta` 安装。

## 使用示例

### @apollo/federation

```typescript
import { Func } from '@faasjs/func';
import { GraphQLServer, gql } from '@faasjs/graphql-server';

const gqls = new GraphQLServer({
  config: {
    schemas: [
      {
        typeDefs: gql`
  extend type Query {
    hello(name: String): Hello
  }
  type Hello {
    name: String
  }`,
        resolvers: {
          Query: {
            hello (_, args) {
              return { name: `Hello, ${args.name}` };
            }
          }
        }
      }
    ]
  },
  http: {
    method: 'ANY' // 在非 production 环境下，使用 GET 请求，将默认打开 graphql 的 playground
  }
});

export default new Func({
  plugins: [gqls]
})
```

### @apollo/gateway

```typescript
import { Func } from '@faasjs/func';
import { GraphQLServer } from '@faasjs/graphql-server';

const gqls = new GraphQLServer({
  config: {
    gateways: [
      {
        name: 'products',
        url: 'http://gql.com/products'
      },
      {
        name: 'orders',
        url: 'http://gql.com/orders'
      }
    ]
  },
  http: {
    method: 'ANY' // 在非 production 环境下，使用 GET 请求，将默认打开 graphql 的 playground
  }
});

export default new Func({
  plugins: [gqls]
})
```
