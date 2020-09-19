import Vue from 'vue'
import App from './App.vue'

import axios from "axios"
import axiosSetup from "@/utils/axios-setup"

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
  Table
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

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
