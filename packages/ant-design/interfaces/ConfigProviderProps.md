[@faasjs/ant-design](../README.md) / ConfigProviderProps

# Interface: ConfigProviderProps

Props for the `@faasjs/ant-design` [ConfigProvider](../functions/ConfigProvider.md).

This provider owns FaasJS Ant Design component copy, small component defaults,
and optional FaasJS client initialization. It does not configure Ant Design's
token/theme provider; use the `configProviderProps` prop on `App` or Ant
Design's `ConfigProvider` for that boundary.

## Properties

### children

> **children**: `ReactNode`

Descendant components that consume the resolved config context.

### faasClientOptions?

> `optional` **faasClientOptions?**: [`FaasReactClientOptions`](../type-aliases/FaasReactClientOptions.md)

Optional FaasJS client options used to initialize [FaasReactClient](../functions/FaasReactClient.md).

Use this for request `baseUrl`, default browser-client options, and the
shared `onError` hook consumed by `faas` and `useFaas`.

### theme?

> `optional` **theme?**: `object`

FaasJS Ant Design theme overrides merged with the built-in defaults.

These values drive copy and small component defaults inside this package;
they are separate from Ant Design token configuration.

#### Blank?

> `optional` **Blank?**: `object`

Blank-component theme overrides.

##### Blank.text?

> `optional` **text?**: `string`

#### common?

> `optional` **common?**: `object`

Common shared copy and labels used across components.

##### common.add?

> `optional` **add?**: `string`

##### common.all?

> `optional` **all?**: `string`

##### common.blank?

> `optional` **blank?**: `string`

##### common.delete?

> `optional` **delete?**: `string`

##### common.required?

> `optional` **required?**: `string`

##### common.reset?

> `optional` **reset?**: `string`

##### common.search?

> `optional` **search?**: `string`

##### common.submit?

> `optional` **submit?**: `string`

#### Form?

> `optional` **Form?**: `object`

Form-component theme overrides.

##### Form.submit?

> `optional` **submit?**: `object`

##### Form.submit.text?

> `optional` **text?**: `string`

#### lang?

> `optional` **lang?**: `string`

Language code used to select localized defaults.

#### Title?

> `optional` **Title?**: `object`

Title-component theme overrides.

##### Title.separator?

> `optional` **separator?**: `string`

Separator inserted between title segments.

###### Default

```ts
' - '
```

##### Title.suffix?

> `optional` **suffix?**: `string`

Suffix appended to generated page titles.
