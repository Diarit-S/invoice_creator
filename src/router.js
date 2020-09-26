import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)


export default new VueRouter({
  routes: [
    { path: '/', component: () => import('./pages/creator.vue')},
    { path: '/tableView', component: () => import('./pages/tableView.vue') }
  ]
})