import program from '../index';

program.exitOverride();

describe('root', function () {
  test('without root', function () {
    try {
      program.parse(['fake', 'faas']);
    } catch (error) {
      console.error(error);
    }

    expect(process.env.FaasRoot).toBeUndefined();
  });

  test('with root', function () {
    const root = __dirname;
    try {
      program.parse(['fake', 'faas', '-r', root]);
    } catch (error) {
      console.error(error);
    }

    expect(process.env.FaasRoot).toEqual(root + '/');
  });

  test('with wrong root', function () {
    try {
      program.parse(['fake', 'faas', '-r', '/abc']);
    } catch (error) {
      expect(error.message).toEqual('Can\'t find root path: /abc');
    }
  });
});
