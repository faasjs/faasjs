[**@faasjs/jobs**](../README.md)

[@faasjs/jobs](../README.md) / parseCronExpression

# Function: parseCronExpression()

> **parseCronExpression**(`expression`): [`CronMatcher`](../type-aliases/CronMatcher.md)[]

Parse a cron expression into an array of field matchers.

Accepts the standard 5-field format: `minute hour dayOfMonth month dayOfWeek`.
Supports comma-separated values, ranges (`-`), steps (`/`), and wildcards (`*`).
A single-value step such as `5/10` starts at 5 and continues to the field maximum.
Day-of-week accepts both numeric (0–7) and abbreviated names (SUN–SAT).

## Parameters

### expression

`string`

A cron expression string.

## Returns

[`CronMatcher`](../type-aliases/CronMatcher.md)[]

An array of five matcher functions, one per field.

## Throws

If the expression is empty, has the wrong number of fields,
or contains invalid values.

## Example

```ts
parseCronExpression('0 9 * * 1-5')
// every weekday at 9:00
```
