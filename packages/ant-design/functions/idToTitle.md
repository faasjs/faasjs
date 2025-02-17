[@faasjs/ant-design](../README.md) / idToTitle

# Function: idToTitle()

> **idToTitle**(`id`): `string`

Converts an identifier string to a title case string.

This function takes an identifier string with words separated by underscores,
capitalizes the first letter of each word, and joins them together without spaces.

## Parameters

### id

`string`

The identifier string to convert.

## Returns

`string`

The converted title case string.

## Example

```typescript
idToTitle('example_id'); // returns 'ExampleId'
```
