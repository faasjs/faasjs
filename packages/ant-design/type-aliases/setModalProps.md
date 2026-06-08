[@faasjs/ant-design](../README.md) / setModalProps

# Type Alias: setModalProps

> **setModalProps** = `Dispatch`\<`SetStateAction`\<[`ModalProps`](../interfaces/ModalProps.md)\>\>

State setter used to update hook-managed modal props.

Each call shallow-merges the provided object, or the object returned by an
updater function, into the existing modal props. Omitted keys are preserved;
set a key to `undefined` or a new value when you need to clear or replace it.
