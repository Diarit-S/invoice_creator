import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)


export default new VueRouter({
  routes: [
    { path: '/', component: () => import('./pages/creator.vue')},
    {name: 'tableView', path: '/tableView', component: () => import('./pages/tableView.vue') }
  ]
})