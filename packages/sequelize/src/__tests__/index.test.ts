import { Func } from '@faasjs/func';
import { Sequelize, Model, DataTypes } from '..';

class User extends Model {
  public id!: number;
}

User.setInitData({
  attributes: {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    }
  },
  options: { timestamps: false }
});

describe('Sequelize', function () {
  it('config with code', async function () {
    const orm = new Sequelize({
      config: {
        dialect: 'sqlite',
        database: ':memory:',
        sync: { force: true },
        models: [User]
      }
    });

    const handler = new Func({
      plugins: [orm],
      async handler () {
        const user = new User();
        user.id = 1;
        await user.save();
        return User.findByPk(1);
      }
    }).export().handler;

    expect((await handler({})).id).toEqual(1);
  });

  it('config with env', async function () {
    process.env.SECRET_SEQUELIZE_DIALECT = 'sqlite';
    process.env.SECRET_SEQUELIZE_DATABASE = ':memory:';

    const orm = new Sequelize({
      config: {
        models: [User],
        sync: { force: true }
      }
    });

    const handler = new Func({
      plugins: [orm],
      async handler () {
        const user = new User();
        user.id = 1;
        await user.save();
        return User.findByPk(1);
      }
    }).export().handler;

    expect((await handler({})).id).toEqual(1);
  });
});
