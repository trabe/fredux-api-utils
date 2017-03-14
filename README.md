# Fredux API utils

## Description

This library provides a set of functions which build http requests. This
library relies on the standard *fetch* api, and should be polyfilled in older browsers.

## Installing fredux-api-utils
```
npm install --save fredux-api-utils
```

## Usage

To send some URL params:

```javascript
import { get } from "fredux-api-utils";

get("/users", { params: {"key": "value"} })
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

To send an object as the JSON body:

```javascript
import { post } from "fredux-api-utils";

get("/users", { body: {"name": "Peter"} })
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

To add some headers. `Content-Type: application/json` will always be set unless you explicitely pass
a `Content-Type` header.

```javascript
import { post } from "fredux-api-utils";

get("/users", { headers: { "my-custom-header": "custom" } })
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

To set a timeout in ms.

```javascript
import { get } from "fredux-api-utils";

get("/users", { timeout: 2000 })
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

To change default request mode:

```javascript
import { get } from "fredux-api-utils";

get("/users", { mode: "no-cors" })
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

Of course, you can use all the options together:

```javascript
import { post } from "fredux-api-utils";

get("/users", {
    body: { "name": "Peter" },
    params: { "key": "value" },
    headers: { "my-custom-header": "custom" },
    timeout: 2000 })
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

## Available API methods

 * `get(endpoint, options)`
 * `post(endpoint, options)`
 * `put(endpoint, options)`
 * `del(endpoint, options)`

Where `endpoint` is a string with the resource you wish to fetch and `options` is an
object containing custom settings you want to apply to the request. The possible options are:

* `body`: any JSON body.
* `params`: an object containing query params.
* `headers`: any headers you want to add to your request.
* `timeout`: any timeout in milliseconds. The default is `0`.
* `credentials`: sets the policy for sending cookies. One of `omit`, `same-origin`, or `include`. Using `same-origin` as default.
* `mode`: the mode you want to use for the request, e.g., `cors`, `no-cors`, `same-origin`, or `navigate`. The default is `cors`.

The value returned for all methods is a `Promise`.


## CHANGELOG

### v1.2.0

* Added support for credentials option in requests

### v1.1.0

* Added support for mode option in requests

### v1.0.0

* Initial release
