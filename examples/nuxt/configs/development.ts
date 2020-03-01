import { resolve } from 'path';
import defaults from './default';

const config: any = defaults;

config.modules.push(['@faasjs/nuxt', {
  root: resolve('./funcs')
}]);

export default config;
