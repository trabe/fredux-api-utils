/* eslint-disable max-nested-callbacks */
import "isomorphic-fetch";
import fetchMock from "fetch-mock";
import expect from "expect";
import * as apiCalls from "../src/api-utils";

describe("api calls", () => {
  const availableMethods = {
    get: "GET",
    post: "POST",
    put: "PUT",
    del: "DELETE",
  };

  const baseUrl = "http://what/frus";
  const callBody = { name: "Peter" };
  const callParams = { key: "value" };
  const callHeaders = { "Content-Type": "Custom", "X-Head": "xHead" };

  /* eslint-disable import/namespace */
  const apiCall = method => apiCalls[method](baseUrl, { body: callBody, params: callParams });
  const rawApiCall = method => apiCalls[`${method}Raw`](baseUrl, { body: callBody, params: callParams });
  const apiCallWithEmptyParams = method => apiCalls[method](baseUrl, { body: callBody, params: {} });
  const apiCallWithNoParams = method => apiCalls[method](baseUrl, { body: callBody, params: null });
  const apiCallWithExtraHeaders = method =>
    apiCalls[method](baseUrl, { body: callBody, params: null, headers: callHeaders });
  const apiCallWithTimeoutOption = method => apiCalls[method](baseUrl, { body: callBody, params: {}, timeout: 2000 });
  /* eslint-disable */

  const requestUrl = `${baseUrl}?key=value`;
  const withMockCall = (status, body, fn, url = requestUrl) => {
    fetchMock.mock(url, { body, status });
    fn();
    fetchMock.restore();
  };

  const assertApiCalled = (method, url = requestUrl) => {
    expect(fetchMock.called(url)).toEqual(true);
    const lastCall = fetchMock.lastCall(url)[0];
    expect(JSON.parse(lastCall.body)).toEqual({ name: "Peter" });
    expect(lastCall.method).toEqual(availableMethods[method]);
  };

  const assertHeader = (name, value, url = requestUrl) => {
    const lastCall = fetchMock.lastCall(url)[0];
    expect(lastCall.headers.get(name)).toEqual(value);
  };

  const assertOption = (name, value, url = requestUrl) => {
    const lastCall = fetchMock.lastCall(url)[0];
    expect(lastCall[name]).toEqual(value);
  };

  const raise = e =>
    setTimeout(
      () => {
        throw e;
      },
      0,
    );

  Object.keys(availableMethods).forEach(method => {
    describe(method, () => {
      context("raw call", () => {
        it("returns a resolved promise", done => {
          const responseBody = { key: "value" };

          withMockCall(200, responseBody, () => {
            rawApiCall(method)
              .then(response => {
                expect(response.status).toEqual(200);
                response.text().then(response => {
                  expect(JSON.parse(response)).toEqual(responseBody);
                  done();
                });
              })
              .catch(e => raise(e));
            assertApiCalled(method);
            assertHeader("Content-Type", "application/json");
          });
        });
      });

      context("successful request", () => {
        context("with body", () => {
          it("returns a resolved promise", done => {
            const responseBody = { key: "value" };

            withMockCall(200, responseBody, () => {
              apiCall(method)
                .then(response => {
                  expect(response).toEqual(responseBody);
                  done();
                })
                .catch(e => raise(e));

              assertApiCalled(method);
              assertHeader("Content-Type", "application/json");
            });
          });
        });

        context("without body", () => {
          it("returns a resolved promise", done => {
            withMockCall(200, null, () => {
              apiCall(method)
                .then(response => {
                  expect(response).toEqual("");
                  done();
                })
                .catch(e => raise(e));

              assertApiCalled(method);
              assertHeader("Content-Type", "application/json");
            });
          });
        });

        context("without params", () => {
          it("returns a resolved promise", done => {
            withMockCall(
              200,
              null,
              () => {
                apiCallWithNoParams(method)
                  .then(response => {
                    expect(response).toEqual("");
                    done();
                  })
                  .catch(e => raise(e));

                assertApiCalled(method, baseUrl);
                assertHeader("Content-Type", "application/json", baseUrl);
              },
              baseUrl,
            );
          });
        });

        context("with empty params", () => {
          it("returns a resolved promise", done => {
            withMockCall(
              200,
              null,
              () => {
                apiCallWithEmptyParams(method)
                  .then(response => {
                    expect(response).toEqual("");
                    done();
                  })
                  .catch(e => raise(e));

                assertApiCalled(method, baseUrl);
                assertHeader("Content-Type", "application/json", baseUrl);
              },
              baseUrl,
            );
          });
        });
      });

      context("error request", () => {
        context("with body", () => {
          it("returns a rejected promise", done => {
            const errorBody = { error: "error" };

            withMockCall(500, errorBody, () => {
              apiCall(method).catch(error => {
                expect(error).toEqual(errorBody);
                done();
              });

              assertApiCalled(method);
              assertHeader("Content-Type", "application/json");
            });
          });
        });

        context("without params", () => {
          it("returns a resolved promise", done => {
            const errorBody = { error: "error" };

            withMockCall(
              500,
              errorBody,
              () => {
                apiCallWithNoParams(method).catch(error => {
                  expect(error).toEqual(errorBody);
                  done();
                });

                assertApiCalled(method, baseUrl);
                assertHeader("Content-Type", "application/json", baseUrl);
              },
              baseUrl,
            );
          });
        });

        context("without body", () => {
          it("returns a rejected promise", done => {
            withMockCall(500, null, () => {
              apiCall(method).catch(error => {
                expect(error).toEqual("");
                done();
              });

              assertApiCalled(method);
              assertHeader("Content-Type", "application/json");
            });
          });
        });
      });

      context("with custom headers", () => {
        it("returns a resolved promise", done => {
          withMockCall(
            200,
            null,
            () => {
              apiCallWithExtraHeaders(method)
                .then(response => {
                  expect(response).toEqual("");
                  done();
                })
                .catch(e => raise(e));

              assertApiCalled(method, baseUrl);
              assertHeader("Content-Type", "Custom", baseUrl);
              assertHeader("X-Head", "xHead", baseUrl);
            },
            baseUrl,
          );
        });
      });

      context("with timeout option", () => {
        it("returns a resolved promise", done => {
          withMockCall(
            200,
            null,
            () => {
              apiCallWithTimeoutOption(method)
                .then(response => {
                  expect(response).toEqual("");
                  done();
                })
                .catch(e => raise(e));

              assertApiCalled(method, baseUrl);
              assertOption("timeout", 2000, baseUrl);
            },
            baseUrl,
          );
        });
      });
    });
  });
});
