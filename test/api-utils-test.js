import "isomorphic-fetch";
import fetchMock from "fetch-mock";

import expect from "expect";
import sinon from "sinon";
import * as apiCalls from "../src/api-utils";

describe('api calls', () => {

  const availableMethods = {
    get: "GET",
    post: "POST",
    put: "PUT",
    del: "DELETE"
  }

  it('creates a promise', () => {
    Object.keys(availableMethods).forEach(method => {
      const request = "http://what/frus?key=value";
      fetchMock.mock(request, 200);

      apiCalls[method]("http://what/frus", {body: {"name": "Peter"}, params: {"key": "value"}});

      // OMFG!! a call object in fetch mock is an array with the call as the first element and some freaking options as the second.
      const lastCall = fetchMock.lastCall(request)[0];

      expect(fetchMock.called(request)).toEqual(true);
      expect(JSON.parse(lastCall.body)).toEqual({"name": "Peter"});
      expect(lastCall.method).toEqual(availableMethods[method]);

      fetchMock.restore();
    })
  })
})

