import { Func } from '@faasjs/func';
import { CloudFunction } from '../../index';

describe('validator/required', function () {
  describe('event', function () {
    test('normal', async function () {
      const cf = new CloudFunction({ validator: { event: { rules: { key: { required: true } } } } });
      const handler = new Func({
        plugins: [cf],
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        async handler () { }
      }).export().handler;

      await handler({ key: 1 });

      try {
        await handler({});
      } catch (error) {
        expect(error.message).toEqual('[event] key is required.');
      }
    });

    describe('array', function () {
      test('empty', async function () {
        const cf = new CloudFunction({ validator: { event: { rules: { key: { config: { rules: { sub: { required: true } } } } } } } });
        const handler = new Func({
          plugins: [cf],
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          async handler () { }
        }).export().handler;

        await handler({});

        await handler({ key: [] });
      });

      test('plain object', async function () {
        const cf = new CloudFunction({ validator: { event: { rules: { key: { config: { rules: { sub: { required: true } } } } } } } });
        const handler = new Func({
          plugins: [cf],
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          async handler () { }
        }).export().handler;

        await handler({});

        try {
          await handler({ key: [{}] });
        } catch (error) {
          expect(error.message).toEqual('[event] key.sub is required.');
        }
      });
    });

    test('object', async function () {
      const http = new CloudFunction({ validator: { event: { rules: { key: { config: { rules: { sub: { required: true } } } } } } } });
      const handler = new Func({
        plugins: [http],
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        async handler () { }
      }).export().handler;

      await handler({});

      try {
        await handler({ key: {} });
      } catch (error) {
        expect(error.message).toEqual('[event] key.sub is required.');
      }
    });
  });
});
