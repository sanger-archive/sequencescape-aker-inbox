<template>
  <div>
    <b-container>
      <b-form class="form-signin" @submit.prevent="login">
        <h2 class="form-signin-heading">Please sign in</h2>
        <label for="inputEmail" class="sr-only">Email address</label>
        <b-input v-model="username"
                 required
                 id="inputEmail"
                 placeholder="user@example.com"
                 type="email"
                 class="form-control" />
        <label for="inputPassword" class="sr-only">Password</label>
        <b-input v-model="password"
                 required
                 id="inputPassword"
                 placeholder="Password" type="password" class="form-control" />
        <b-button type="submit" size="lg" block variant="primary">Sign in</b-button>
      </b-form>
    </b-container>
  </div>
</template>

<script>
import { AUTH_REQUEST } from '../store/action-types';

export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',
    };
  },
  methods: {
    login() {
      const { username, password } = this;
      this.$store.dispatch(AUTH_REQUEST, { username, password }).then(() => {
        this.$router.push('/inbox');
      });
    },
  },
  beforeCreate() {
    document.body.className = 'login';
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #eee;
}
.form-signin {
  max-width: 330px;
  padding: 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}
.form-signin .checkbox {
  font-weight: 400;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="email"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
</style>
