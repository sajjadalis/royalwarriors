import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Init Vue PapaParse
import VuePapaParse from 'vue-papa-parse'
Vue.use(VuePapaParse)

// Init Vue Tabluator
import VueTabulator from 'vue-tabulator';
Vue.use(VueTabulator);

Vue.config.productionTip = false

new Vue({
  router,
  render: function (h) { return h(App) },
}).$mount('#app')
