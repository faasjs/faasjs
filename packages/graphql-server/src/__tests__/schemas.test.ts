import { Func } from '@faasjs/func';
import { GraphQLServer, gql } from '../index';

describe('schemas', function () {
  const typeDefs = gql`
    extend type Query {
      hello(name: String): Hello
    }
    type Hello {
      name: String
    }`;
  it('should work', async function () {
    const handler = new Func({
      plugins: [new GraphQLServer({
        config: {
          schemas: [{
            typeDefs,
            resolvers: {
              Query: {
                hello (_, args) {
                  return { name: `Hello, ${args.name}` };
                }
              }
            }
          }]
        }
      })]
    }).export().handler;

    const res = await handler({
      httpMethod: 'POST',
      body: '{"query":"{hello(name:\\"world\\"){name}}"}'
    });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('{"data":{"hello":{"name":"Hello, world"}}}\n');
  });

  describe('context', function () {
    it('be normal', async function () {
      const handler = new Func({
        plugins: [new GraphQLServer({
          config: {
            schemas: [{
              typeDefs,
              resolvers: {
                Query: {
                  hello (_, __, context) {
                    return { name: `Hello, ${context.event.httpMethod}` };
                  }
                }
              }
            }]
          }
        })]
      }).export().handler;

      const res = await handler({
        httpMethod: 'POST',
        body: '{"query":"{hello{name}}"}'
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual('{"data":{"hello":{"name":"Hello, POST"}}}\n');
    });

    it('be object', async function () {
      const handler = new Func({
        plugins: [new GraphQLServer({
          config: {
            schemas: [{
              typeDefs,
              resolvers: {
                Query: {
                  hello (_, __, context) {
                    return { name: `Hello, ${context.event.httpMethod}` };
                  }
                }
              }
            }],
            context: { event: { httpMethod: 'GET' } }
          }
        })]
      }).export().handler;

      const res = await handler({
        httpMethod: 'POST',
        body: '{"query":"{hello{name}}"}'
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual('{"data":{"hello":{"name":"Hello, GET"}}}\n');
    });

    it('be function', async function () {
      const handler = new Func({
        plugins: [new GraphQLServer({
          config: {
            schemas: [{
              typeDefs,
              resolvers: {
                Query: {
                  hello (_, __, context) {
                    return { name: `Hello, ${context.event.httpMethod}` };
                  }
                }
              }
            }],
            context () { return { event: { httpMethod: 'GET' } }; }
          }
        })]
      }).export().handler;

      const res = await handler({
        httpMethod: 'POST',
        body: '{"query":"{hello{name}}"}'
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual('{"data":{"hello":{"name":"Hello, GET"}}}\n');
    });

    it('be async function', async function () {
      const handler = new Func({
        plugins: [new GraphQLServer({
          config: {
            schemas: [{
              typeDefs,
              resolvers: {
                Query: {
                  hello (_, __, context) {
                    return { name: `Hello, ${context.event.httpMethod}` };
                  }
                }
              }
            }],
            async context () { return Promise.resolve({ event: { httpMethod: 'GET' } }); }
          }
        })]
      }).export().handler;

      const res = await handler({
        httpMethod: 'POST',
        body: '{"query":"{hello{name}}"}'
      });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual('{"data":{"hello":{"name":"Hello, GET"}}}\n');
    });
  });
});
