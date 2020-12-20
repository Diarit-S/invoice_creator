import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)


export default new VueRouter({
  routes: [
    { path: '/', component: () => import('./pages/creator.vue')},
    { path: '/selector', component: () => import('./pages/editOrCreatePaper.vue')},
    { name: 'tableView', path: '/tableView', component: () => import('./pages/tableView.vue') },
    { name: 'documentSelector', path: '/selectDocument/:type', component: () => import('./pages/documentSelector.vue') },
    { name: 'sendEmail', path: '/sendEmail/:email', component: () => import('./pages/sendEmail.vue') }
  ]
})