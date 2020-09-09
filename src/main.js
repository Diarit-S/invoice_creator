import Vue from 'vue'
import App from './App.vue'
import 'buefy/dist/buefy.css'
import { Input, Field, Select } from 'buefy'

Vue.use(Input)
Vue.use(Field)
Vue.use(Select)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
