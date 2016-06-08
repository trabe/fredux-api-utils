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

  const url = "http://what/frus";
  const callBody = { "name": "Peter" };
  const callParams = { "key": "value" };
  const apiCall = method => apiCalls[method](url, { body: callBody, params: callParams });

  const requestUrl = `${url}?key=value`;
  const withMockCall = (status, body, fn) => {
    fetchMock.mock(requestUrl, { body, status });
    fn();
    fetchMock.restore();
  }

  const assertApiCalled = method => {
    expect(fetchMock.called(requestUrl)).toEqual(true);
    const lastCall = fetchMock.lastCall(requestUrl)[0];
    expect(JSON.parse(lastCall.body)).toEqual({"name": "Peter"});
    expect(lastCall.method).toEqual(availableMethods[method]);
  }

  const raise = e => setTimeout(() => { throw e }, 0);

  Object.keys(availableMethods).forEach(method => {

    describe(method, () => {

      context("successful request", () => {
        context("with body", () => {
          it("returns a resolved promise", (done) => {
            const responseBody = { key: "value" };

            withMockCall(200, responseBody, () => {
              apiCall(method).then((response) => {
                expect(response).toEqual(responseBody);
                done();
              }).catch(e => raise(e));

              assertApiCalled(method);
            })
          })
        })

        context("without body", () => {
          it("returns a resolved promise", (done) => {
            withMockCall(200, null, () => {
              apiCall(method).then((response) => {
                expect(response).toEqual("");
                done();
              }).catch(e => raise(e));

              assertApiCalled(method);
            })
          })
        })
      })

      context("error request", () => {
        context("with body", () => {
          it("returns a rejected promise", (done) => {
            const errorBody = { error: "error" };

            withMockCall(500, errorBody, () => {
              apiCall(method).catch((error) => {
                expect(error).toEqual(errorBody);
                done();
              })

              assertApiCalled(method);
            })
          })
        })

        context("without body", () => {
          it("returns a rejected promise", (done) => {
            withMockCall(500, null, () => {
              apiCall(method).catch((error) => {
                expect(error).toEqual("");
                done();
              })

              assertApiCalled(method);
            })
          })
        })
      })
    })
  })
})

