import { Func } from '@faasjs/func';
import { TypeORM } from '..';
import { Entity, PrimaryColumn, getConnection } from 'typeorm';

describe('typeORM', function () {
  beforeEach(async function () {
    try {
      await getConnection().close();
    } catch (error) {
      console.error(error);
    }
  });
  
  it('config with code', async function () {
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

  it('config with env', async function () {
    process.env.SECRET_TYPEORM_TYPE = 'sqlite';
    process.env.SECRET_TYPEORM_DATABASE = ':memory:';

    @Entity()
    class User {
      @PrimaryColumn()
      id: number;
    }

    const typeORM = new TypeORM({
      config: {
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
});
