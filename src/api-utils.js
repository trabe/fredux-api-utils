function buildFetchRequest({ endpoint, options: { method, body } }) {
  let options = { method, headers: {}, credentials: "same-origin" };
  if (body) {
    options.body = JSON.stringify(body);
    options.headers["Content-Type"] = "application/json";
  }
  return new Request(endpoint, options);
}

const addParams = (endpoint, params) => {
  return `${endpoint}${ (params && Object.keys(params).length > 0) ? "?" + Object.keys(params).map(key => `${key}=${params[key]}`).join("&") : ""}`;
};


const responseBody = response => {
  return response.text().then(text => {
    try {
      return JSON.parse(text);
    } catch(Error) {
      return text;
    }
  });
};

const makeRequest = (method) => (endpoint, { body, params } = {}) => {
  const fetchReq = buildFetchRequest({ endpoint: addParams(endpoint, params), options: { method, body } });

  return fetch(fetchReq);
};

const parseResponse = fn => (...args) => fn(...args).then(
  response => new Promise((resolve, reject) => responseBody(response).then(response.ok? resolve : reject))
);

// Usage: post("/users", {body: {"name": "Peter"}, params: {"key": "value"}})

export const getRaw = makeRequest("GET");
export const postRaw = makeRequest("POST");
export const putRaw = makeRequest("PUT");
export const delRaw = makeRequest("DELETE");

export const get = parseResponse(getRaw);
export const post = parseResponse(postRaw);
export const put = parseResponse(putRaw);
export const del = parseResponse(delRaw);
