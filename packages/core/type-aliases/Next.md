[**@faasjs/core**](../README.md)

[@faasjs/core](../README.md) / Next

# Type Alias: Next

> **Next** = () => `Promise`\<`void`>>>>\>

Continue to the next lifecycle hook in the current plugin chain.

Each plugin hook should call this at most once. Calling `next()` multiple times
rejects with `Error('next() called multiple times')`.

## Returns

`Promise`\<`void`\>
