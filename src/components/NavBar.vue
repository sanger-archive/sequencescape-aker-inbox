<template>
  <div>
    <b-navbar toggleable="md" type="dark" variant="info" >
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

      <b-navbar-brand href="#">Aker</b-navbar-brand>

      <b-navbar-nav>
        <b-nav-item href="#" active>DNA Pipeline</b-nav-item>
        <b-nav-item href="#" >Cellular Pipeline</b-nav-item>
      </b-navbar-nav>

      <b-navbar-nav class="ml-auto">
        <b-nav-item @click="logout" >Logout</b-nav-item>
      </b-navbar-nav>
    </b-navbar>
  </div>
</template>

<script>
import { AUTH_LOGOUT } from '../store/action-types';

export default {
  name: 'nav-bar',
  methods: {
    logout() {
      this.$store.dispatch(AUTH_LOGOUT)
        .then(() => {
          this.$router.push('/login');
        });
    },
  },
};
</script>
