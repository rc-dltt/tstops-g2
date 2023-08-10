# caching

Add directives in all subraphs

```graphql
enum CacheControlScope {
  PUBLIC
  PRIVATE
}

directive @cacheControl(
  maxAge: Int
  scope: CacheControlScope
  inheritMaxAge: Boolean
) on FIELD_DEFINITION | OBJECT | INTERFACE | UNION
```

You can add caching to queries, entities and/or fields

**A shared entity must be cached in all subgraphs or the gateway will ignore the caching directive**


You can either add `@cacheControl(inheritMaxAge: true)` on the field or `@cacheControl(maxAge: <number>)` to the extended entity
