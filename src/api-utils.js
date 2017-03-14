function buildFetchRequest({ endpoint, options: { method, body, headers = {}, timeout = 0, mode, credentials = "same-origin" } }) {
  let options = { method, headers, credentials, timeout };
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

const addParams = (endpoint, params) => (
  `${endpoint}${(params && Object.keys(params).length > 0) ? "?" + Object.keys(params).map(key => `${key}=${params[key]}`).join("&") : ""}`
);


const responseBody = response => {
  return response.text().then(text => {
    try {
      return JSON.parse(text);
    } catch(Error) {
      return text;
    }
  });
};

const makeRequest = method => (endpoint, { body, params, headers, timeout, mode, credentials } = {}) => {
  const fetchReq = buildFetchRequest({ endpoint: addParams(endpoint, params), options: { method, body, headers, timeout, mode, credentials } });

  return fetch(fetchReq);
};

const parseResponse = fn => (...args) => fn(...args).then(
  response => new Promise((resolve, reject) => responseBody(response).then(response.ok? resolve : reject))
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
