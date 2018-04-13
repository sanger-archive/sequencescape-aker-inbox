import Vue from 'vue';
import Vuex from 'vuex';
import actions from './actions';
import mutations from './mutations';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0,
    token: localStorage.getItem('user-token') || '',
    status: '',
  },
  actions,
  mutations,
  getters: {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
  },
});
