import 'regenerator-runtime/runtime'
import Vue from 'vue'
import App from './pages/app.vue'
import Faas from '@faasjs/vue-plugin'

Vue.use(Faas, {
  domain: '',
})

new Vue({
  el: '#app',
  render: h => h(App),
})
