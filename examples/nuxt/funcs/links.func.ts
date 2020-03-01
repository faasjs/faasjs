import { Func } from '@faasjs/func';
import { Http } from '@faasjs/http';

export default new Func({
  plugins: [new Http()],
  handler () {
    return [
      {
        text: 'FaasJS Documentation',
        href: 'https://faasjs.com/'
      },
      {
        text: 'Nuxt Documentation',
        href: 'https://nuxtjs.org/'
      }
    ];
  }
});
