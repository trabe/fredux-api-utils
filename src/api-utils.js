const array = a => (a instanceof Array ? a : [a]);

const isFormDataObj = e => (typeof FormData !== "undefined" && e instanceof FormData);

const urlParameter = (key, value) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;

const toUrlParams = obj =>
  Object.keys(obj)
    .reduce(
      (parts, key) => {
        const values = array(obj[key]);
        values.forEach(value => parts.push(urlParameter(key, value)));
        return parts;
      },
      [],
    )
    .join("&");

const caseInsensitiveHasKey = (obj, key) => Object.keys(obj).some(k => k.toLowerCase() === key.toLowerCase());

function buildFetchRequest(
  {
    endpoint,
    options: {
      body,
      cache = "default",
      credentials = "same-origin",
      headers = {},
      formData,
      method = "GET",
      mode = "same-origin",
      redirect = "follow",
      referrer = "client",
      timeout = 0,
    },
  },
) {
  const options = {
    cache,
    credentials,
    headers,
    method,
    mode,
    redirect,
    referrer,
    timeout,
  };

  if (body && formData) {
    throw new Error("Cannot set multiple body types. Use either body or formData params");
  }

  if (body) {
    options.body = JSON.stringify(body);
    if (!caseInsensitiveHasKey(headers, "Content-Type")) {
      options.headers["Content-Type"] = "application/json";
    }
  }

  if (formData) {
    options.body = formData;

    if (!isFormDataObj(formData)) {
      options.body = toUrlParams(options.body);

      if (!caseInsensitiveHasKey(headers, "Content-Type")) {
        options.headers["Content-Type"] = "application/x-www-form-urlencoded";
      }
    }
  }

  return new Request(endpoint, options);
}

const addQuery = (endpoint, params) =>
  (!params || Object.keys(params).length === 0 ? endpoint : `${endpoint}?${toUrlParams(params)}`);

const makeRequest = method =>
  (endpoint, options = {}) => {
    const { params, ...rest } = options;

    const fetchReq = buildFetchRequest({
      endpoint: addQuery(endpoint, params),
      options: { method, ...rest },
    });

    return fetch(fetchReq);
  };

export const get = makeRequest("GET");
export const post = makeRequest("POST");
export const put = makeRequest("PUT");
export const patch = makeRequest("PATCH");
export const del = makeRequest("DELETE");
