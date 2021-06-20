import { buildFederatedSchema } from '@apollo/federation';
import { GraphQLSchemaModule } from 'apollo-graphql';
import { Plugin, InvokeData, Next, MountData, DeployData } from '@faasjs/func';
import { ApolloServerBase, Config, runHttpQuery, gql, Context } from 'apollo-server-core';
import { renderPlaygroundPage } from '@apollographql/graphql-playground-html';
import { Headers } from 'apollo-server-env';
import { ApolloGateway } from '@apollo/gateway';
import { Http, HttpConfig } from '@faasjs/http';
import deepMerge from '@faasjs/deep_merge';

export { gql, GraphQLSchemaModule };

interface ApolloServerConfig extends Config {
  context?: Context | ((...args: any) => Context) | ((...args: any) => Promise<Context>)
  schemas?: GraphQLSchemaModule[] | (() => GraphQLSchemaModule[]) | (() => Promise<GraphQLSchemaModule[]>)
  gateways?: {
    name: string
    url: string
  }[]
}

export interface GraphQLServerConfig{
  name?: string
  config: ApolloServerConfig
  http?: HttpConfig
}

class ApolloServer extends ApolloServerBase {
  async load (): Promise<void> {
    await this.willStart();
  }

  async handler (data: InvokeData): Promise<any> {
    const options = await super.graphQLServerOptions(data);

    return await runHttpQuery([data.event, data.context], {
      method: data.event.httpMethod,
      options,
      query: JSON.parse(data.event.body),
      request: {
        url: data.event.path,
        method: data.event.httpMethod,
        headers: new Headers(data.event.headers)
      }
    }).then(function (response: any) {
      return {
        body: response.graphqlResponse,
        statusCode: 200,
        headers: response.responseInit.headers
      };
    }).catch(function (error: any) {
      if (error.name !== 'HttpQueryError') return Promise.reject(error);
      return {
        body: error.message,
        statusCode: error.statusCode,
        headers: error.headers
      };
    });
  }
}

export class GraphQLServer implements Plugin {
  public readonly type: string = 'graphQLServer'
  public readonly name: string
  public http: Http
  private config: ApolloServerConfig
  private server: ApolloServer

  constructor (config: GraphQLServerConfig) {
    this.config = config.config;
    this.http = new Http(config.http);
    this.name = config.name || this.type;
  }

  async onMount (data: MountData, next: Next): Promise<any> {
    await this.http.onMount(data, async () => {
      // 将 schemas 转换为 FederatedSchema
      if (this.config.schemas) {
        if (typeof this.config.schemas === 'function') this.config.schemas = await this.config.schemas();

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

      const configContext = this.config.context;
      this.config.context = async function (invokeData: InvokeData): Promise<Context> {
        const data = deepMerge(invokeData);

        if (configContext)
          if (typeof configContext === 'function') return Object.assign(data, await configContext(data)); else return Object.assign(data, configContext);

        return data;
      };

      if (this.config.gateway) {
        await this.config.gateway.load({});
        this.config.subscriptions = false;
      }

      this.server = new ApolloServer(this.config);

      await this.server.load();

      await next();
    });
  }

  async onInvoke (data: InvokeData, next: Next): Promise<any> {
    await this.http.onInvoke(data, async () => {
      switch (data.event.httpMethod) {
        case 'POST':
          if (data.event.body) data.response = await this.server.handler(data); else throw Error('Missing body');
          break;
        case 'GET':
          data.response = {
            body: renderPlaygroundPage({ endpoint: data.event.path }),
            statusCode: 200,
            headers: { 'Content-Type': 'text/html' }
          };
          break;
        default:
          throw Error(`Unknown method: ${data.event.httpMethod}`);
      }

      await next();
    });
  }

  async onDeploy (data: DeployData, next: Next): Promise<void> {
    await this.http.onDeploy(data, next);
  }
}
