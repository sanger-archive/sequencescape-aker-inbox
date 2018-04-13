<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import axios from 'axios';

import { AUTH_LOGOUT } from './store/action-types';

export default {
  name: 'app',
  created() {
    axios.interceptors.response.use(undefined, err => new Promise(() => {
      if (err.status === 401 && err.config && !err.config__isRetryRequest) {
        this.$store.dispatch(AUTH_LOGOUT);
      }
      throw err;
    }));
  },
};
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  /* color: #2c3e50; */
  /* margin-top: 60px; */
}
</style>
