import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Report from '../components/Report.vue'

Vue.use(VueRouter)

const routes = [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/report/:report',
      name: 'Report',
      component: Report
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router