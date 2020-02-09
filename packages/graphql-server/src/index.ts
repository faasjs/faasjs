import { buildFederatedSchema } from '@apollo/federation';
import { GraphQLSchemaModule } from 'apollo-graphql';
import { Plugin, InvokeData, Next } from '@faasjs/func';
import { ApolloServerBase, Config, GraphQLOptions, runHttpQuery } from 'apollo-server-core';
import { renderPlaygroundPage } from '@apollographql/graphql-playground-html';
import { Headers } from 'apollo-server-env';
import { ApolloGateway } from '@apollo/gateway';

export interface GraphQLServerConfig extends Config{
  schemas?: GraphQLSchemaModule[];
  gateways?: {
    name: string;
    url: string;
  }[];
}

class ApolloServer extends ApolloServerBase {
  async createGraphQLServerOptions (
    event: any,
    context: any,
  ): Promise<GraphQLOptions> {
    return await super.graphQLServerOptions({ event,
      context });
  }
  
  async load (): Promise<void> {
    await this.willStart();
  }

  async handler (event: any, context: any): Promise<any> {
    const options = await this.createGraphQLServerOptions(event, context);
    
    return runHttpQuery([event, context], {
      method: event.httpMethod,
      options,
      query: JSON.parse(event.body),
      request: {
        url: event.path,
        method: event.httpMethod,
        headers: new Headers(event.headers),
      }
    }).then(function (response: any) {
      return {
        body: response.graphqlResponse,
        statusCode: 200,
        headers: response.responseInit.headers,
      };
    }).catch(function (error: any) {
      if (error.name !== 'HttpQueryError') return Promise.reject(error);
      return {
        body: error.message,
        statusCode: error.statusCode,
        headers: error.headers,
      };
    });
  }
}

export class GraphQLServer implements Plugin {
  public type: string = 'graphQL';
  private config: GraphQLServerConfig;
  private server: ApolloServer;

  constructor (config: GraphQLServerConfig) {
    this.config = config;
    
    // 将 schemas 转换为 FederatedSchema
    if (this.config.schemas) {
      this.config.schema = buildFederatedSchema(this.config.schemas);
      delete this.config.schemas;
    }

    // 将 gateways 转换为 Gateway
    if (this.config.gateways) {
      this.config.gateway = new ApolloGateway({
        serviceList: this.config.gateways,
        debug: true,
        experimental_pollInterval: 10000
      });
      delete this.config.gateways;
    }
  }

  async onMount (_, next: Next): Promise<any> {
    if (this.config.gateway) {
      await this.config.gateway.load({});
      this.config.subscriptions = false;
    }

    this.server = new ApolloServer(this.config);

    await this.server.load();

    await next();
  }

  async onInvoke (data: InvokeData, next: Next): Promise<any> {
    switch (data.event.httpMethod) {
      case 'POST':
        if (data.event.body) {
          data.response = await this.server.handler(data.event, data.context);
        } else {
          data.response = {
            body: 'POST body missing.',
            statusCode: 500,
          };
        }
        break;
      case 'GET':
        data.response = {
          body: renderPlaygroundPage({
            endpoint: data.event.path
          }),
          statusCode: 200,
          headers: {
            'Content-Type': 'text/html'
          }
        };
        break;
      default:
        data.response = {
          body: 'Unknow method.',
          statusCode: 500,
        };
    }

    await next();
  }
}
