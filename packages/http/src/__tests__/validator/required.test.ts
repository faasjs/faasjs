import { Func } from '@faasjs/func';
import { Http } from '../../index';

describe('validator/required', function () {
  describe('params', function () {
    test('normal', async function () {
      const http = new Http({
        validator: {
          params: {
            rules: {
              key: {
                required: true
              }
            }
          }
        }
      });
      const handler = new Func({
        plugins: [http],
        handler () { }
      }).export().handler;

      const res = await handler({});

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual('{"error":{"message":"[params] key is required."}}');

      const res2 = await handler({
        headers: { 'content-type': 'application/json' },
        body: '{"key":1}'
      });

      expect(res2.statusCode).toEqual(201);
    });

    describe('onError', function () {
      test('no return', async function () {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  required: true
                }
              },
              onError: function () {
              }
            }
          }
        });
        const handler = new Func({
          plugins: [http],
          handler () { }
        }).export().handler;

        const res = await handler({});

        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual('{"error":{"message":"[params] key is required."}}');
      });

      test('return message', async function () {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  required: true
                }
              },
              onError: function (type, key, value) {
                return {
                  message: `${type} ${key} ${value}`
                };
              }
            }
          }
        });
        const handler = new Func({
          plugins: [http],
          handler () { }
        }).export().handler;

        const res = await handler({});

        expect(res.statusCode).toEqual(500);
        expect(res.body).toEqual('{"error":{"message":"params.rule.required key undefined"}}');
      });

      test('return all', async function () {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  required: true
                }
              },
              onError: function (type, key, value) {
                return {
                  statusCode: 401,
                  headers: {
                    key: 'value'
                  },
                  message: `${type} ${key} ${value}`
                };
              }
            }
          }
        });
        const handler = new Func({
          plugins: [http],
          handler () { }
        }).export().handler;

        const res = await handler({});

        expect(res.statusCode).toEqual(401);
        expect(res.headers.key).toEqual('value');
        expect(res.body).toEqual('{"error":{"message":"params.rule.required key undefined"}}');
      });
    });

    describe('array', function () {
      test('empty', async function () {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: {
                        required: true
                      }
                    }
                  }
                }
              }
            }
          }
        });
        const handler = new Func({
          plugins: [http],
          handler () { }
        }).export().handler;

        const res = await handler({});

        expect(res.statusCode).toEqual(201);

        const res2 = await handler({
          headers: { 'content-type': 'application/json' },
          body: '{"key":[]}'
        });

        expect(res2.statusCode).toEqual(201);
      });

      test('plain object', async function () {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: {
                        required: true
                      }
                    }
                  }
                }
              }
            }
          }
        });
        const handler = new Func({
          plugins: [http],
          handler () { }
        }).export().handler;

        const res = await handler({});

        expect(res.statusCode).toEqual(201);

        const res2 = await handler({
          headers: { 'content-type': 'application/json' },
          body: '{"key":[{}]}'
        });

        expect(res2.statusCode).toEqual(500);
        expect(res2.body).toEqual('{"error":{"message":"[params] key.sub is required."}}');
      });
    });

    test('object', async function () {
      const http = new Http({
        validator: {
          params: {
            rules: {
              key: {
                config: {
                  rules: {
                    sub: {
                      required: true
                    }
                  }
                }
              }
            }
          }
        }
      });
      const handler = new Func({
        plugins: [http],
        handler () { }
      }).export().handler;

      const res = await handler({});

      expect(res.statusCode).toEqual(201);

      const res2 = await handler({
        headers: { 'content-type': 'application/json' },
        body: '{"key":{}}'
      });

      expect(res2.statusCode).toEqual(500);
      expect(res2.body).toEqual('{"error":{"message":"[params] key.sub is required."}}');
    });
  });

  describe('cookie', function () {
    test('should work', async function () {
      const http = new Http({
        validator: {
          cookie: {
            rules: {
              key: {
                required: true
              }
            }
          }
        }
      });
      const handler = new Func({
        plugins: [http],
        handler () { }
      }).export().handler;

      const res = await handler({});

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual('{"error":{"message":"[cookie] key is required."}}');

      const res2 = await handler({
        headers: {
          cookie: 'key=1'
        }
      });

      expect(res2.statusCode).toEqual(201);
    });
  });

  describe('session', function () {
    test('normal', async function () {
      const http = new Http({
        validator: {
          session: {
            rules: {
              key: {
                required: true
              }
            }
          }
        }
      });
      const handler = new Func({
        plugins: [http],
        handler () { }
      }).export().handler;

      const res = await handler({});

      expect(res.statusCode).toEqual(500);
      expect(res.body).toEqual('{"error":{"message":"[session] key is required."}}');

      const res2 = await handler({
        headers: {
          cookie: `key=${http.session.encode({ key: 1 })}`
        }
      });

      expect(res2.statusCode).toEqual(201);
    });

    describe('array', function () {
      test('empty', async function () {
        const http = new Http({
          validator: {
            session: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: {
                        required: true
                      }
                    }
                  }
                }
              }
            }
          }
        });
        const handler = new Func({
          plugins: [http],
          handler () { }
        }).export().handler;

        const res = await handler({});

        expect(res.statusCode).toEqual(201);

        const res2 = await handler({
          headers: {
            cookie: `key=${http.session.encode({ key: [] })}`
          }
        });

        expect(res2.statusCode).toEqual(201);
      });

      test('plain object', async function () {
        const http = new Http({
          validator: {
            session: {
              rules: {
                key: {
                  config: {
                    rules: {
                      sub: {
                        required: true
                      }
                    }
                  }
                }
              }
            }
          }
        });
        const handler = new Func({
          plugins: [http],
          handler () { }
        }).export().handler;

        const res = await handler({});

        expect(res.statusCode).toEqual(201);

        const res2 = await handler({
          headers: {
            cookie: `key=${http.session.encode({ key: [{}] })}`
          }
        });

        expect(res2.statusCode).toEqual(500);
        expect(res2.body).toEqual('{"error":{"message":"[session] key.sub is required."}}');
      });
    });

    test('object', async function () {
      const http = new Http({
        validator: {
          session: {
            rules: {
              key: {
                config: {
                  rules: {
                    sub: {
                      required: true
                    }
                  }
                }
              }
            }
          }
        }
      });
      const handler = new Func({
        plugins: [http],
        handler () { }
      }).export().handler;

      const res = await handler({});

      expect(res.statusCode).toEqual(201);

      const res2 = await handler({
        headers: {
          cookie: `key=${http.session.encode({ key: {} })}`
        }
      });

      expect(res2.statusCode).toEqual(500);
      expect(res2.body).toEqual('{"error":{"message":"[session] key.sub is required."}}');
    });
  });
});
