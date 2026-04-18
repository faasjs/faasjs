[@faasjs/core](../README.md) / SessionOptions

# Type Alias: SessionOptions

> **SessionOptions** = `object`

Encryption and signing options for the [Session](../classes/Session.md) helper.

## Properties

### cipherName?

> `optional` **cipherName?**: `string`

Cipher name used to encrypt the session payload.

#### Default

```ts
'aes-256-cbc'
```

### digest?

> `optional` **digest?**: `string`

Hash algorithm used by PBKDF2 and HMAC.

#### Default

```ts
'sha256'
```

### iterations?

> `optional` **iterations?**: `number`

PBKDF2 iteration count used for key derivation.

#### Default

```ts
100
```

### key?

> `optional` **key?**: `string`

Cookie key used to store the encrypted session payload.

### keylen?

> `optional` **keylen?**: `number`

Total derived key length in bytes.

#### Default

```ts
64
```

### salt?

> `optional` **salt?**: `string`

Salt used for deriving the encryption key.

#### Default

```ts
'salt'
```

### secret

> **secret**: `string`

Secret source used to derive encryption and signing keys.

This must be configured explicitly. FaasJS throws during session
initialization when it is missing.

### signedSalt?

> `optional` **signedSalt?**: `string`

Salt used for deriving the signing key.

#### Default

```ts
'signedSalt'
```
