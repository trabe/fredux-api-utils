/* eslint-disable max-nested-callbacks */
import "isomorphic-fetch";
import fetchMock from "fetch-mock";
import expect from "expect";
import { get, post, put, del } from "../src/api-utils";

const defaultUrl = "http://what/frus";

const withMockCall = ({ url = defaultUrl, body = "", status = 200 }, fn) => {
  fetchMock.mock(url, { body, status });
  fn(url);
  fetchMock.restore();
};

const lastCall = (url = defaultUrl) => fetchMock.lastCall(url)[0];

describe("api methods", () => {
  it("get does a GETº", () => {
    withMockCall({}, url => {
      get(url);
      expect(lastCall().method).toEqual("GET");
    });
  });

  it("post does a POST", () => {
    withMockCall({}, url => {
      post(url);
      expect(lastCall().method).toEqual("POST");
    });
  });

  it("put does a PUT", () => {
    withMockCall({}, url => {
      put(url);
      expect(lastCall().method).toEqual("PUT");
    });
  });

  it("del does a DELETE", () => {
    withMockCall({}, url => {
      del(url);
      expect(lastCall().method).toEqual("DELETE");
    });
  });
});

describe("options forwarding", () => {
  it("forwards fetch options", () => {
    withMockCall({}, url => {
      get(url, { cache: "ca", credentials: "cr", mode: "m", redirect: "rd", referrer: "re", timeout: 100 });

      // Fetch mock only allows testinf this values :(
      expect(lastCall().redirect).toEqual("rd");
      expect(lastCall().timeout).toEqual(100);
    });
  });

  it("has default fetch options", () => {
    withMockCall({}, url => {
      get(url);

      // Fetch mock only allows testinf this values :(
      expect(lastCall().redirect).toEqual("follow");
      expect(lastCall().timeout).toEqual(0);
    });
  });
});

describe("url params handling", () => {
  it("does not append a query string if no params", () => {
    withMockCall({}, url => {
      get(url);
      expect(lastCall().url).toEqual(url);
    });
  });

  it("appends a query string if params present", () => {
    withMockCall({ url: `${defaultUrl}?test=1&testM=a&testM=b` }, url => {
      get(defaultUrl, { params: { test: 1, testM: ["a", "b"] } });
      expect(lastCall(url).url).toEqual(url);
    });
  });
});

describe("body handling", () => {
  it("fails with multiple body types", () => {
    expect(() => get(defaultUrl, { body: "t", formData: "f" })).toThrow(/either body or formData/);
  });

  describe("json body", () => {
    it("handles the body", () => {
      withMockCall({}, url => {
        post(url, { body: { test: 1 } });
        expect(JSON.parse(lastCall().body)).toEqual({ test: 1 });
        expect(lastCall().headers.get("Content-Type")).toEqual("application/json");
      });
    });

    it("respects forced content types", () => {
      withMockCall({}, url => {
        post(url, { body: { test: 1 }, headers: { "Content-Type": "custom" } });
        expect(JSON.parse(lastCall().body)).toEqual({ test: 1 });
        expect(lastCall().headers.get("Content-Type")).toEqual("custom");
      });
    });
  });

  describe("from data body", () => {
    it("handles the body", () => {
      withMockCall({}, url => {
        post(url, { formData: { test: 1, testM: ["a", "b"] } });
        expect(lastCall().body).toEqual("test=1&testM=a&testM=b");
        expect(lastCall().headers.get("Content-Type")).toEqual("application/x-www-form-urlencoded");
      });
    });

    it("respects forced content-types", () => {
      withMockCall({}, url => {
        post(url, { formData: { test: 1 }, headers: { "Content-Type": "custom" } });

        expect(lastCall().body).toEqual("test=1");
        expect(lastCall().headers.get("Content-Type")).toEqual("custom");
      });
    });
  });

  describe("response handling", () => {
    it("returns a promise", done => {
      withMockCall({}, url => {
        get(url).then(res => {
          expect(res.status).toEqual(200);
          res.text().then(() => done());
        });
      });
    });
  });
});
