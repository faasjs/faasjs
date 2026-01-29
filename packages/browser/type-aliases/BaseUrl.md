[@faasjs/browser](../README.md) / BaseUrl

# Type Alias: BaseUrl

> **BaseUrl** = `` `${string}/` ``

Template literal type for URL strings that must end with a forward slash.

Ensures that base URLs used in FaasJS requests always have a trailing '/' character,
which is required for proper URL construction when appending action paths.

## Remarks

- Type only accepts strings ending with '/' (e.g., 'https://api.example.com/', '/')
- Strings without trailing '/' will fail TypeScript type checking
- Used by FaasBrowserClient constructor and Options type
- Ensures consistent URL formatting across the codebase
- Throws Error at runtime if baseUrl doesn't end with '/'

## See

 - FaasBrowserClient for usage in client creation
 - Options for usage in request options
