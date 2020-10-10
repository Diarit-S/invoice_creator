import Vue from 'vue'
import App from './App.vue'

import router from './router'

import axios from "axios"
import axiosSetup from "@/utils/axios-setup"

import moment from 'moment'

moment.locale('fr')

import 'buefy/dist/buefy.css'
import { 
  Input, 
  Field, 
  Select, 
  Dropdown, 
  Icon, 
  Tag, 
  Button,
  Modal,
  Datepicker,
  Numberinput,
  Table,
  Checkbox
} from 'buefy'

import '@/style/main.scss'

axiosSetup.initSetup()

Vue.prototype.$http = axios

Vue.use(Input)
Vue.use(Field)
Vue.use(Select)
Vue.use(Dropdown)
Vue.use(Icon)
Vue.use(Tag)
Vue.use(Button)
Vue.use(Modal)
Vue.use(Datepicker)
Vue.use(Numberinput)
Vue.use(Table)
Vue.use(Checkbox)

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
