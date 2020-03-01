import defaults from './default';

const config: any = defaults;

config.modules.push(['@faasjs/nuxt', {
  baseUrl: 'https://api.example.com/'
}]);

export default config;
