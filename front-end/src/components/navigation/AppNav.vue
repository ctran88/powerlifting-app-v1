<template>
<div id="app-nav">
  <b-navbar toggleable type="inverse" variant="inverse" toggle-breakpoint="sm">

    <b-nav-toggle target="nav_collapse" />

    <b-link class="navbar-brand" href="/">
      <span>The Powerlifting Notebook</span>
    </b-link>

    <b-collapse is-nav id="nav_collapse">
      <b-nav is-nav-bar v-for="route in $router.options.routes.slice(0, 1)" :key="route.name">
        <router-link class="nav-link" :to="route.path">{{ route.name }}</router-link>
      </b-nav>
      
      <b-nav is-nav-bar class="ml-auto">
        <b-button id="btn-signout" @click="handleSignout" v-if="$store.state.signedIn">Sign out</b-button>
        <div v-else>
          <b-button id="btn-register" to="register">Register</b-button>
          <b-button id="btn-signin" to="signin">Sign in</b-button>
        </div>
      </b-nav>
    </b-collapse>
  </b-navbar>
  <dash-nav v-if="$store.state.signedIn && ['Home', 'Sign in', 'Page not found'].indexOf($route.name) === -1" />
</div>
</template>

<script>
import DashNav from './DashNav';
import { signout } from '@/../utils/auth';

export default {
  name: 'app-nav',
  components: {
    DashNav
  },
  methods: {
    handleSignout() {
      var client = 'https://192.168.54.54:8080';
      
      signout()
        .then((result) => {
          if (result) {
            window.location.replace(client);
          }
        })
        .catch((error) => {
          console.log('Error signing out: ', error);
        });
    }
  }
};
</script>

<style scoped>
.navbar {
  width: 100%;
  position: fixed;
  padding: 0.61rem 1rem;
  z-index: 100;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5),
              0 2px 8px 0 rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5),
                   0 2px 8px 0 rgba(0, 0, 0, 0.4);
  -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5),
                      0 2px 8px 0 rgba(0, 0, 0, 0.4);
}
#btn-register {
  color: #ffffff;
  border-color: #0A3E65;
  background-color: #0A3E65;
  cursor: pointer;
}
#btn-register:hover, #btn-register:active {
  color: #ffffff;
  background-color: #225174;
}
#btn-signin, #btn-signout {
  color: #C8D80D;
  border-color: #C8D80D;
  background-color: transparent;
  cursor: pointer;
}
#btn-signin:hover, #btn-signin:active,
#btn-signout:hover, #btn-signout:active {
  color: #ffffff;
  background-color: #C8D80D;
}
</style>
