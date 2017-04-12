function buildFetchRequest(
  {
    endpoint,
    options: {
      method = "GET",
      body,
      headers = {},
      cache = "default",
      timeout = 0,
      mode = "same-origin",
      credentials = "same-origin",
    },
  },
) {

  const options = { method, headers, cache, timeout, mode, credentials };

  if (body) {
    options.body = JSON.stringify(body);
    if (!options.headers["Content-Type"]) {
      options.headers["Content-Type"] = "application/json";
    }
  }
  if (mode) {
    options.mode = mode;
  }

  return new Request(endpoint, options);
}

const addParams = (endpoint, params) => {
  if (!params || Object.keys(params).length === 0) {
    return endpoint;
  }

  const query = Object.keys(params).map(key => `${key}=${params[key]}`).join("&");
  return `${endpoint}?${query}`;
};

const responseBody = response => response.text().then(text => {
    try {
      return JSON.parse(text);
    } catch (e) {
      return text;
    }
  });

const makeRequest = method =>
  (endpoint, { body, params, headers, timeout, mode, credentials } = {}) => {
    const fetchReq = buildFetchRequest({
      endpoint: addParams(endpoint, params),
      options: { method, body, headers, timeout, mode, credentials },
    });

    return fetch(fetchReq);
  };

const parseResponse = fn =>
  (...args) =>
    fn(...args).then(
      response => new Promise((resolve, reject) => responseBody(response).then(response.ok ? resolve : reject)),
    );

// Usage: post("/users", {body: {"name": "Peter"}, params: {"key": "value"}, timeout: 2000, mode: "cors"})

export const getRaw = makeRequest("GET");
export const postRaw = makeRequest("POST");
export const putRaw = makeRequest("PUT");
export const delRaw = makeRequest("DELETE");

export const get = parseResponse(getRaw);
export const post = parseResponse(postRaw);
export const put = parseResponse(putRaw);
export const del = parseResponse(delRaw);
