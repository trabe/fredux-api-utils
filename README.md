# Fredux API utils

## Description

This library provides a set of functions which build http requests. This
library relies on the standard fetch api, and should be polyfilled in older browsers.

## Installing fredux-api-utils
```
npm install --save fredux-api-utils
```

## Usage

```
import { get } from "fredux-api-utils";

get("/users", params: {"key": "value"}}).
  then(response => console.log(response)).
  catch(error => console.log(error));
```

```
import { post } from "fredux-api-utils";

get("/users", {body: {"name": "Peter"}, params: {"key": "value"}}).
  then(response => console.log(response)).
  catch(error => console.log(error));
```

## Methods

 * get
 * post
 * put
 * del
