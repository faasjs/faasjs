import { Resolver, Query, Arg } from 'type-graphql';
import { Repository, getRepository } from '@faasjs/typeorm';
import { User } from './user.type';

export { User };

@Resolver(User)
export class UserResolver {
  private readonly repository: Repository<User>;

  constructor () {
    this.repository = getRepository<User>(User);
  }

  @Query(() => User, { name: 'getUser' })
  protected async getOne (@Arg('username') username: string) {
    return this.repository.findOne(username);
  }
}
