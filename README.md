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

 * get
 * post
 * put
 * del
