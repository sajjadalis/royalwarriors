import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../components/Home.vue'
import Table from'../components/Table.vue'

Vue.use(VueRouter)

const routes = [
    {
    path: '/',
    name: 'home',
    component: Home
    },
    {
    path: '/table',
    name: 'table',
    component: Table
    }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router