[@faasjs/ant-design](../README.md) / setModalProps

# Type Alias: setModalProps

> **setModalProps** = `Dispatch`\<`SetStateAction`\<[`ModalProps`](../interfaces/ModalProps.md)\>\>

State setter used to update hook-managed modal props.

Each call shallow-merges the provided object, or the object returned by an
updater function, into the existing modal props. When `open` is set to
`false`, previous modal props are discarded and the modal resets to its
initial props.
