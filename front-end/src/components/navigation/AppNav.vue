<template>
<div id="app-nav">
  <b-navbar toggleable type="inverse" variant="inverse" toggle-breakpoint="sm">

    <b-nav-toggle target="nav_collapse"></b-nav-toggle>

    <b-link class="navbar-brand" href="/">
      <span>The Powerlifting Notebook</span>
    </b-link>

    <b-collapse is-nav id="nav_collapse">
      <b-nav is-nav-bar v-for="route in $router.options.routes.slice(0,-1)" :key="route.name">
        <router-link class="nav-link" :to="route.path">{{ route.name }}</router-link>
      </b-nav>
      
      <b-nav is-nav-bar class="ml-auto">
        <b-button id="btn-signout" @click="handleSignout" v-if="$store.state.signedIn">Sign out</b-button>
        <b-button id="btn-signin" to="signin" v-else>Sign in</b-button>
      </b-nav>
    </b-collapse>
  </b-navbar>
  <dash-nav v-if="$store.state.signedIn && ['Home', 'Sign in', 'Page not found'].indexOf($route.name) === -1"></dash-nav>
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
      signout();
    }
  }
};
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.5),
              0 4px 8px 0 rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.5),
                   0 4px 8px 0 rgba(0, 0, 0, 0.4);
  -webkit-box-shadow: 0 2px 6px 0 rgba(0, 0, 0, 0.5),
                      0 4px 8px 0 rgba(0, 0, 0, 0.4);
  width: 100%;
  position: fixed;
  padding: 0.61rem 1rem;
  z-index: 100;
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
