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

get("/users", { params: { key1: "value1", key2: ["value2", "value3"] } })
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

To send an object as the JSON body:

```javascript
import { post } from "fredux-api-utils";

post("/users", { body: {name: "Peter"} })
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

To send form data as the body:

```javascript
import { post } from "fredux-api-utils";

post("/users", { formData: { key1: "value1", key2: ["value2", "value3"] } })
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

To send form data as `FormData` object:

```javascript
import { post } from "fredux-api-utils";

const formData = new FormData();
formData.append("name", "My Name");
formData.append("file", new Blob(["Some notes..."], { type: "text/plain" }));

// If there's not a Content-Type header, will use multipart/form-data
post("/users", { formData })
  .then(response => console.log(response))
  .catch(error => console.log(error));

```

To add some headers:


```javascript
import { post } from "fredux-api-utils";

post("/users", { headers: { "my-custom-header": "custom" } })
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

**NOTE**: when passing a `body` option, `Content-Type: application/json` will always be set unless you explicitely pass
a `Content-Type`. The same goes with `formData` and `Content-Type: x-www-form-urlencoded` unless you pass
a `FormData` object. In this case, `Content-Type: multipart/form-data` will be set automatically as default (you
can override it anyway).


To set several other options just pass them:

```javascript
import { get } from "fredux-api-utils";

get("/users", { timeout: 2000, mode: "no-cors" })
  .then(response => console.log(response))
  .catch(error => console.log(error));
```

## Available API methods

 * `get(endpoint, options)`
 * `post(endpoint, options)`
 * `put(endpoint, options)`
 * `patch(endpoint, options)`
 * `del(endpoint, options)`

Where `endpoint` is a string with the resource you wish to fetch and `options` is an
object containing custom settings you want to apply to the request. The possible options are:

* `body`: any JSON body.
* `formData`: any data to be passed as a `x-www-form-urlencoded` object or a `FormData` instance.
* `params`: an object containing query params.
* `headers`: any headers you want to add to your request.
* `timeout`: any timeout in milliseconds. The default is `0`.
* `credentials`: sets the policy for sending cookies. One of `omit`, `same-origin`, or `include`. Using `same-origin` as default.
* `mode`: the mode you want to use for the request, e.g., `cors`, `no-cors`, `same-origin`, or `navigate`. Defaults to `cors`.
* `redirect`: the redirect mode to use, e.g. `follow`, `error`, or `manual`. Defaults to `follow`.
* `referrer`: the referrer of the request, Defaults to `client`.
* `cache`: cache mode for the request, e.g. `default`, `no-store`, `reload`, `no-cache`, `force-cache`,`only-if-cached`. Defaults to `default`.

This options, for the most part adhere to the fetch Request API.


## CHANGELOG

### v2.2.0

* Add patch support

### v2.1.0

* Add FormData object support

### v2.0.1

* Fix headers check when forcing Content-Type to be case insensitive

### v2.0.0

* Removed the magic response parsing, thus removing the raw methods. Every method is raw now. Now all methods
  return a standard response

### v1.3.0

* Added support for cache, redirect and referrer options in request
* Add new option formData, to send params x-www-form-urlencoded in the body (in order to handle classic form posts)
* Add support for multivalued params

### v1.2.0

* Added support for credentials option in requests

### v1.1.0

* Added support for mode option in requests

### v1.0.0

* Initial release
