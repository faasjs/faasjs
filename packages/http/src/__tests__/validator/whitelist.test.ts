import { Func } from '@faasjs/func';
import { Http } from '../../index';

describe('validator/whitelist', function () {
  describe('params', function () {
    describe('normal', function () {
      test('error', async function () {
        const http = new Http({
          validator: {
            params: {
              whitelist: 'error',
              rules: {
                key: {}
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
          body: '{"key":1,"key2":2,"key3":3}'
        });

        expect(res2.statusCode).toEqual(500);
        expect(res2.body).toEqual('{"error":{"message":"[params] Unpermitted keys: key2, key3"}}');
      });

      test('ignore', async function () {
        const http = new Http({
          validator: {
            params: {
              whitelist: 'ignore',
              rules: {
                key: {}
              }
            }
          }
        });
        const handler = new Func({
          plugins: [http],
          handler () {
            return http.params;
          }
        }).export().handler;

        const res2 = await handler({
          headers: { 'content-type': 'application/json' },
          body: '{"key":1,"key2":2,"key3":3}'
        });

        expect(res2.statusCode).toEqual(200);
        expect(res2.body).toEqual('{"data":{"key":1}}');
      });

      describe('onError', function () {
        test('no return', async function () {
          const http = new Http({
            validator: {
              params: {
                whitelist: 'error',
                rules: {
                  key: {}
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

          const res = await handler({
            headers: { 'content-type': 'application/json' },
            body: '{"key1":1,"key2":2}'
          });

          expect(res.statusCode).toEqual(500);
          expect(res.body).toEqual('{"error":{"message":"[params] Unpermitted keys: key1, key2"}}');
        });

        test('return message', async function () {
          const http = new Http({
            validator: {
              params: {
                whitelist: 'error',
                rules: {
                  key: {}
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

          const res = await handler({
            headers: { 'content-type': 'application/json' },
            body: '{"key1":1,"key2":2}'
          });

          expect(res.statusCode).toEqual(500);
          expect(res.body).toEqual('{"error":{"message":"params.whitelist  key1,key2"}}');
        });

        test('return all', async function () {
          const http = new Http({
            validator: {
              params: {
                whitelist: 'error',
                rules: {
                  key: {}
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

          const res = await handler({
            headers: { 'content-type': 'application/json' },
            body: '{"key1":1,"key2":2}'
          });

          expect(res.statusCode).toEqual(401);
          expect(res.headers.key).toEqual('value');
          expect(res.body).toEqual('{"error":{"message":"params.whitelist  key1,key2"}}');
        });
      });
    });

    describe('array', function () {
      test('error', async function () {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  config: {
                    whitelist: 'error',
                    rules: {
                      sub: {}
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

        const res = await handler({
          headers: { 'content-type': 'application/json' },
          body: '{"key":[{"sub":1}]}'
        });

        expect(res.statusCode).toEqual(201);

        const res2 = await handler({
          headers: { 'content-type': 'application/json' },
          body: '{"key":[{"key1":1,"key2":2}]}'
        });

        expect(res2.statusCode).toEqual(500);
        expect(res2.body).toEqual('{"error":{"message":"[params] Unpermitted keys: key.key1, key.key2"}}');
      });

      test('ignore', async function () {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  config: {
                    whitelist: 'ignore',
                    rules: {
                      sub: {}
                    }
                  }
                }
              }
            }
          }
        });
        const handler = new Func({
          plugins: [http],
          handler () {
            return http.params.key;
          }
        }).export().handler;

        const res2 = await handler({
          headers: { 'content-type': 'application/json' },
          body: '{"key":[{"sub":1,"key":2}]}'
        });

        expect(res2.statusCode).toEqual(200);
        expect(res2.body).toEqual('{"data":[{"sub":1}]}');
      });
    });

    describe('object', function () {
      test('error', async function () {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  config: {
                    whitelist: 'error',
                    rules: {
                      sub: {}
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

        const res = await handler({
          headers: { 'content-type': 'application/json' },
          body: '{"key":{"sub":1}}'
        });

        expect(res.statusCode).toEqual(201);

        const res2 = await handler({
          headers: { 'content-type': 'application/json' },
          body: '{"key":{"key1":1,"key2":2}}'
        });

        expect(res2.statusCode).toEqual(500);
        expect(res2.body).toEqual('{"error":{"message":"[params] Unpermitted keys: key.key1, key.key2"}}');
      });

      test('ignore', async function () {
        const http = new Http({
          validator: {
            params: {
              rules: {
                key: {
                  config: {
                    whitelist: 'ignore',
                    rules: {
                      sub: {}
                    }
                  }
                }
              }
            }
          }
        });
        const handler = new Func({
          plugins: [http],
          handler () {
            return http.params.key;
          }
        }).export().handler;

        const res2 = await handler({
          headers: { 'content-type': 'application/json' },
          body: '{"key":{"sub":1,"key":2}}'
        });

        expect(res2.statusCode).toEqual(200);
        expect(res2.body).toEqual('{"data":{"sub":1}}');
      });
    });
  });

  describe('cookie', function () {
    test('error', async function () {
      const http = new Http({
        validator: {
          cookie: {
            whitelist: 'error',
            rules: {
              key: {}
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
          cookie: 'key=1;key2=2;key3=3'
        }
      });

      expect(res2.statusCode).toEqual(500);
      expect(res2.body).toEqual('{"error":{"message":"[cookie] Unpermitted keys: key2, key3"}}');
    });

    test('ignore', async function () {
      const http = new Http({
        validator: {
          cookie: {
            whitelist: 'ignore',
            rules: {
              key: {}
            }
          }
        }
      });
      const handler = new Func({
        plugins: [http],
        handler () {
          return http.cookie.content;
        }
      }).export().handler;

      const res2 = await handler({
        headers: {
          cookie: 'key=1;key2=2;key3=3'
        }
      });

      expect(res2.statusCode).toEqual(200);
      expect(res2.body).toEqual('{"data":{"key":"1"}}');
    });
  });

  describe('session', function () {
    describe('normal', function () {
      test('error', async function () {
        const http = new Http({
          validator: {
            session: {
              whitelist: 'error',
              rules: {
                key: {}
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
            cookie: `key=${http.session.encode({
              key: 1,
              key2: 2,
              key3: 3
            })}`
          }
        });

        expect(res2.statusCode).toEqual(500);
        expect(res2.body).toEqual('{"error":{"message":"[session] Unpermitted keys: key2, key3"}}');
      });

      test('ignore', async function () {
        const http = new Http({
          validator: {
            session: {
              whitelist: 'ignore',
              rules: {
                key: {}
              }
            }
          }
        });
        const handler = new Func({
          plugins: [http],
          handler () {
            return http.session.content;
          }
        }).export().handler;

        await handler({});

        const res = await handler({
          headers: {
            cookie: `key=${http.session.encode({
              key: 1,
              key2: 2,
              key3: 3
            })}`
          }
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('{"data":{"key":1}}');
      });
    });

    describe('array', function () {
      test('error', async function () {
        const http = new Http({
          validator: {
            session: {
              rules: {
                key: {
                  config: {
                    whitelist: 'error',
                    rules: {
                      sub: {}
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

        await handler({});

        const res = await handler({
          headers: {
            cookie: `key=${http.session.encode({ key: [{ sub: 1 }] })}`
          }
        });

        expect(res.statusCode).toEqual(201);

        const res2 = await handler({
          headers: {
            cookie: `key=${http.session.encode({
              key: [{
                key1: 1,
                key2: 2
              }]
            })}`
          }
        });

        expect(res2.statusCode).toEqual(500);
        expect(res2.body).toEqual('{"error":{"message":"[session] Unpermitted keys: key.key1, key.key2"}}');
      });

      test('ignore', async function () {
        const http = new Http({
          validator: {
            session: {
              rules: {
                key: {
                  config: {
                    whitelist: 'ignore',
                    rules: {
                      sub: {}
                    }
                  }
                }
              }
            }
          }
        });
        const handler = new Func({
          plugins: [http],
          handler () {
            return http.session.content.key;
          }
        }).export().handler;

        await handler({});

        const res2 = await handler({
          headers: {
            cookie: `key=${http.session.encode({
              key: [{
                sub: 1,
                key: 2
              }]
            })}`
          }
        });

        expect(res2.statusCode).toEqual(200);
        expect(res2.body).toEqual('{"data":[{"sub":1}]}');
      });
    });

    describe('object', function () {
      test('error', async function () {
        const http = new Http({
          validator: {
            session: {
              rules: {
                key: {
                  config: {
                    whitelist: 'error',
                    rules: {
                      sub: {}
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

        await handler({});

        const res = await handler({
          headers: {
            cookie: `key=${http.session.encode({ key: { sub: 1 } })}`
          }
        });

        expect(res.statusCode).toEqual(201);

        const res2 = await handler({
          headers: {
            cookie: `key=${http.session.encode({
              key: {
                key1: 1,
                key2: 2
              }
            })}`
          }
        });

        expect(res2.statusCode).toEqual(500);
        expect(res2.body).toEqual('{"error":{"message":"[session] Unpermitted keys: key.key1, key.key2"}}');
      });

      test('ignore', async function () {
        const http = new Http({
          validator: {
            session: {
              rules: {
                key: {
                  config: {
                    whitelist: 'ignore',
                    rules: {
                      sub: {}
                    }
                  }
                }
              }
            }
          }
        });
        const handler = new Func({
          plugins: [http],
          handler () {
            return http.session.content.key;
          }
        }).export().handler;

        await handler({});

        const res = await handler({
          headers: {
            cookie: `key=${http.session.encode({
              key: {
                sub: 1,
                key: 2
              }
            })}`
          }
        });

        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual('{"data":{"sub":1}}');
      });
    });
  });
});
