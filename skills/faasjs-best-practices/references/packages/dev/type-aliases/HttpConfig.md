[@faasjs/dev](../README.md) / HttpConfig

# Type Alias: HttpConfig

> **HttpConfig** = `object`

Configuration for the [Http](../classes/Http.md) plugin.

## Properties

### config?

> `optional` **config?**: `object`

Runtime HTTP behavior overrides consumed by the current core runtime.

#### cookie?

> `optional` **cookie?**: [`CookieOptions`](CookieOptions.md)

Cookie and session configuration injected into invoke data.

### name?

> `optional` **name?**: `string`

Instance name used when mounting multiple HTTP plugins.
