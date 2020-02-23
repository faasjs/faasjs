import { Func } from '@faasjs/func';
import { TypeORM } from '..';
import { Entity, PrimaryColumn } from 'typeorm';

it('should work', async function () {
  @Entity()
  class User {
    @PrimaryColumn()
    id: number;
  }

  const typeORM = new TypeORM({
    config: {
      type: 'sqlite',
      database: ':memory:',
      synchronize: true,
      entities: [User]
    }
  });

  const handler = new Func({
    plugins: [typeORM],
    async handler () {
      const UserRepo = typeORM.getRepository(User);
      const user = new User();
      user.id = 1;
      await UserRepo.save(user);
      return UserRepo.findOne(1);
    }
  }).export().handler;

  expect(await handler({})).toEqual({ id: 1 });
});
