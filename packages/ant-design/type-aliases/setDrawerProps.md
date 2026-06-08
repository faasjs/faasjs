[@faasjs/ant-design](../README.md) / setDrawerProps

# Type Alias: setDrawerProps

> **setDrawerProps** = `Dispatch`\<`SetStateAction`\<[`DrawerProps`](../interfaces/DrawerProps.md)\>\>

State setter used to update hook-managed drawer props.

Each call shallow-merges the provided object, or the object returned by an
updater function, into the existing drawer props. Omitted keys are preserved;
set a key to `undefined` or a new value when you need to clear or replace it.
