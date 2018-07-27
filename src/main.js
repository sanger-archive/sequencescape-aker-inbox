// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import axios from 'axios';
import Vue from 'vue';
import BootstrapVue from 'bootstrap-vue';
import App from './App';
import router from './router';
import store from './store';

require('./assets/css/main.css');

Vue.use(BootstrapVue);

Vue.config.productionTip = true;

const token = localStorage.getItem('user-token');
if (token) {
  axios.defaults.headers.common.Authorization = token;
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
