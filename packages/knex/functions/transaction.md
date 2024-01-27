[@faasjs/knex](../README.md) / transaction

# Function: transaction()

> **transaction**\<`TResult`\>(`scope`, `config`?, `options`?): `Promise`\<`TResult`\>

## Type parameters

• **TResult** = `any`

## Parameters

• **scope**: (`trx`) => `Promise`\<`TResult`\>

• **config?**: `TransactionConfig`

• **options?**: `Object`

• **options\.trx?**: `Transaction`\<`any`, `any`[]\>

## Returns

`Promise`\<`TResult`\>
