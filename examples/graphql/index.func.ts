import 'reflect-metadata';
import { Func } from '@faasjs/func';
import { GraphQLServer, gql } from '@faasjs/graphql-server';
import { buildTypeDefsAndResolvers } from 'type-graphql';
import { TypeORM } from '@faasjs/typeorm';
import { User, UserResolver } from './models/user.resolver';

const orm = new TypeORM({ config: { entities: [User] } });

const gqls = new GraphQLServer({
  config: {
    async schemas () {
      const schema: any = await buildTypeDefsAndResolvers({ resolvers: [UserResolver] });
      schema.typeDefs = gql(schema.typeDefs);
      return schema;
    }
  },
  http: {
    name: 'inner',
    config: { method: 'ANY' }
  }
});

export default new Func({ plugins: [gqls, orm] });
