[@faasjs/ant-design](../README.md) / setDrawerProps

# Type Alias: setDrawerProps

> **setDrawerProps** = `Dispatch`\<`SetStateAction`\<[`DrawerProps`](../interfaces/DrawerProps.md)\>\>

State setter used to update hook-managed drawer props.

Each call shallow-merges the provided object, or the object returned by an
updater function, into the existing drawer props. When `open` is set to
`false`, previous drawer props are discarded and the drawer resets to its
initial props.
