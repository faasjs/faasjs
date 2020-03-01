import { FuncWarpper } from '@faasjs/test';

describe('links', function () {
  test('should work', async function () {
    const func = new FuncWarpper(require.resolve('../links.func'));

    const res = await func.handler({});

    expect(JSON.parse(res.body)).toEqual({
      data: [
        {
          text: 'FaasJS Documentation',
          href: 'https://faasjs.com/'
        },
        {
          text: 'Nuxt Documentation',
          href: 'https://nuxtjs.org/'
        }
      ]
    });
  });
});
