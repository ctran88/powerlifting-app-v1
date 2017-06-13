<template>
<nav class="navbar navbar-toggleable-sm navbar-inverse fixed-top bg-inverse">
  <button class="navbar-toggler navbar-toggler-right hidden-md-up" type="button" data-toggle="collapse" data-target="#navbar-main" aria-controls="navbar-main" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <router-link class="navbar-brand" to="/">The Powerlifting Notebook</router-link>

  <div class="collapse navbar-collapse" id="navbar-main">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item" v-for="route in this.$router.options.routes">
        <router-link class="nav-link" :to="route.path">{{ route.name }}</router-link>
      </li>
    </ul>

    <form id="form-signout" class="form-inline mt-2 mt-md-0" v-if="$store.state.signedIn" @submit.prevent="handleSignout">
      <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Sign out</button>
    </form>
    <form id="form-signin" class="form-inline mt-2 mt-md-0" v-else @submit.prevent="handleSignin">
      <input class="form-control mr-sm-2" type="email" placeholder="Email" v-model="email">
      <input class="form-control mr-sm-2" type="password" placeholder="Password" v-model="password">
      <button class="btn btn-outline-primary my-2 my-sm-0" type="submit">Sign in</button>
    </form>
  </div>
</nav>
</template>

<script>
import { signin, signout, isSignedIn } from '@/../utils/auth';

export default {
  name: 'app-nav',
  data() {
    return {
      email: '',
      password: ''
    };
  },
  created() {
    this.$nextTick(function() {
      this.isSignedIn();
    });
  },
  methods: {
    handleSignin() {
      signin(this.email, this.password);
    },
    handleSignout() {
      signout();
    },
    async isSignedIn() {
      var response = await isSignedIn();

      if (response.data === 'Signed in.') {
        this.$store.dispatch('setSignedIn');
      } else {
        this.$store.dispatch('setSignedOut');
      }
    }
  }
};
</script>

<style scoped>
.navbar {
  -moz-box-shadow: 0 2px 8px 0px rgba(34, 34, 34, 0.9);
  -webkit-box-shadow: 0 2px 8px 0px rgba(34, 34, 34, 0.9);
  box-shadow: 0 2px 8px 0px rgba(34, 34, 34, 0.9);
  padding: 0.61rem 1rem;
}
.btn-outline-primary {
  color: #C8D80D;
  border-color: #C8D80D;
}
  .btn-outline-primary:hover,
  .btn-outline-primary:active {
    color: #ffffff;
    background-color: #C8D80D;
  }
</style>
