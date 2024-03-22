# Built-in Request Specifications

To ensure consistency and avoid confusion during team collaboration, FaasJS offers built-in request specifications and compatible browser plugins.

## Requests

### Headers

* **Content-Type:** `application/json; charset=UTF-8`

### Method

Standardized as `POST`.

### Path

By default, the request path mirrors the directory and file name within your project.

### Query Parameters

**Discouraged**. Use the Body section for parameter transmission instead.

### Body

Empty or formatted in JSON.

## Responses

### Headers

* **Content-Type:** `application/json; charset=UTF-8`

#### Status Codes

* **200** Request successful with response data.
* **201** Request successful but without response data.
* **500** Request failed.

Additional status codes can be implemented based on specific business needs.

### Body

#### 200 Status

* **data** (Required): Contains business information.

**Examples:**

Returns a string.

```json
{
  "data": "value"
}
```

Returns an object.

```json
{
  "data": {
    "key": "value"
  }
}
```

#### 201 Status

No body included.

#### 500 Status

* **error** (Required): Error object
  * **message** (Required): Description of the error

Example:

```json
{
  "error": {
    "message": "An error occurred."
  }
}
```

## Frequently Asked Questions

### Why not use form data submissions?

Form data submissions have two main drawbacks:

1. Limited format: data can only be submitted as strings.
2. Nested data limitations: complex nested data structures can lead to excessively large submissions.

### Why not use RESTful or GraphQL APIs?

RESTful APIs require a deeper understanding of verbs and nouns for developers.

GraphQL, while powerful, involves complex parsing and authorization processes. Utilizing frameworks like Apollo can be cumbersome within a FaaS environment.

Therefore, FaasJS adopts a simplified approach, combining the clarity of RESTful with the flexibility of GraphQL.

Requests are defined solely using `action` and `params`.
