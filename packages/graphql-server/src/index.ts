import { buildFederatedSchema } from '@apollo/federation';
import { GraphQLSchemaModule } from 'apollo-graphql';
import { Plugin, InvokeData, Next } from '@faasjs/func';
import { ApolloServerBase, Config, GraphQLOptions, runHttpQuery, gql } from 'apollo-server-core';
import { renderPlaygroundPage } from '@apollographql/graphql-playground-html';
import { Headers } from 'apollo-server-env';
import { ApolloGateway } from '@apollo/gateway';

export { gql };

interface ApolloServerConfig extends Config {
  schemas?: GraphQLSchemaModule[];
  gateways?: {
    name: string;
    url: string;
  }[];
}

export interface GraphQLServerConfig{
  name?: string;
  config: ApolloServerConfig;
}

class ApolloServer extends ApolloServerBase {
  async createGraphQLServerOptions (
    event: any,
    context: any,
  ): Promise<GraphQLOptions> {
    return await super.graphQLServerOptions({
      event,
      context 
    });
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
    if (this.config.config.schemas) {
      this.config.config.schema = buildFederatedSchema(this.config.config.schemas);
      delete this.config.config.schemas;
    }

    // 将 gateways 转换为 Gateway
    if (this.config.config.gateways) {
      this.config.config.gateway = new ApolloGateway({
        serviceList: this.config.config.gateways,
        debug: true,
        experimental_pollInterval: 10000
      });
      delete this.config.config.gateways;
    }

    const configContext = this.config.config.context;
    this.config.config.context = function (args) {
      const data = {
        event: args.event,
        context: args.context
      };
      if (configContext) 
        if (typeof configContext === 'function') {
          return Object.assign(data, configContext(args));
        } else {
          return Object.assign(data, configContext);
        }

      return data;
    };
  }

  async onMount (_, next: Next): Promise<any> {
    if (this.config.config.gateway) {
      await this.config.config.gateway.load({});
      this.config.config.subscriptions = false;
    }

    this.server = new ApolloServer(this.config.config);

    await this.server.load();

    await next();
  }

  async onInvoke (data: InvokeData, next: Next): Promise<any> {
    switch (data.event.httpMethod) {
      case 'POST':
        if (data.event.body) 
          data.response = await this.server.handler(data.event, data.context);
        else 
          throw Error('Missing body');
        
        break;
      case 'GET':
        data.response = {
          body: renderPlaygroundPage({ endpoint: data.event.path }),
          statusCode: 200,
          headers: { 'Content-Type': 'text/html' }
        };
        break;
      default:
        throw Error('Unknown method');
    }

    await next();
  }
}
