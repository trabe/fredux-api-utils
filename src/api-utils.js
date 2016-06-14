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
      return JSON.parse(text)
    } catch(Error) {
      return text;
    }
  })
}

const makeRequest = (method) => (endpoint, { body, params } = {}) => {
  const fetchReq = buildFetchRequest({ endpoint: addParams(endpoint, params), options: { method, body } });

  return new Promise((resolve, reject) => {
    fetch(fetchReq).then(response => {
      responseBody(response).then(response.ok? resolve : reject)
    })
  })
}

// Usage: post("/users", {body: {"name": "Peter"}, params: {"key": "value"}})
export const get = makeRequest("GET");
export const post = makeRequest("POST");
export const put = makeRequest("PUT");
export const del = makeRequest("DELETE");
