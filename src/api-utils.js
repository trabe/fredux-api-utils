function buildFetchRequest({ endpoint, options: { method, body } }) {
  let options = { method, headers: {}, credentials: "same-origin" };
  if (body) {
    options.body = JSON.stringify(body);
    options.headers["Content-Type"] = "application/json";
  }
return new Request(endpoint, options);
}

const addParams = (endpoint, params) => {
  return `${endpoint}${params ? "?" + Object.keys(params).map(key => `${key}=${params[key]}`).join("&") : ""}`;
};

const callFactory = (method) => (endpoint, { body, params } = {}) => () => {
  const fetchReq = buildFetchRequest({ endpoint: addParams(endpoint, params), options: { method, body } });
  return fetch(fetchReq)
    .then(response => response.json()
      .then(json => {
        if (!response.ok) {
          return Promise.reject(json);
        }
        return json;
      }));
};

// Usage: post("/users", {body: {"name": "Peter"}, params: {"key": "value"}})
export const get = callFactory("GET");
export const post = callFactory("POST");
export const put = callFactory("PUT");
export const del = callFactory("DELETE");
