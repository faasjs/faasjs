[@faasjs/ant-design](../README.md) / ConfigProviderProps

# Interface: ConfigProviderProps

Props for the `@faasjs/ant-design` [ConfigProvider](../functions/ConfigProvider.md).

## Properties

### children

> **children**: `ReactNode`

Descendant components that consume the resolved config context.

### faasClientOptions?

> `optional` **faasClientOptions?**: [`FaasReactClientOptions`](../type-aliases/FaasReactClientOptions.md)

Optional FaasJS client options used to initialize [FaasReactClient](../functions/FaasReactClient.md).

### theme?

> `optional` **theme?**: `object`

Theme overrides merged with the built-in defaults.

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

##### common.pageNotFound?

> `optional` **pageNotFound?**: `string`

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

#### Link?

> `optional` **Link?**: `object`

Link-component theme overrides.

##### Link.style?

> `optional` **style?**: `CSSProperties`

##### Link.target?

> `optional` **target?**: `string`

'\_blank' as default

#### Title?

> `optional` **Title?**: `object`

Title-component theme overrides.

##### Title.separator?

> `optional` **separator?**: `string`

' - ' as default

##### Title.suffix?

> `optional` **suffix?**: `string`
