<template>
<div id='app'>
  <top-nav v-show='["Sign in", "Create an account", "Page not found"].indexOf($route.name) == -1' />
  <side-nav v-if='$store.state.signedIn && ["Home", "Sign in", "Create an account", "Page not found"].indexOf($route.name) === -1' />
  
  <b-card id='main-content-card' v-if='["Home", "Sign in", "Create an account", "Page not found"].indexOf($route.name) === -1' :class='{ hide: $store.state.sideNavHidden }'>
    <router-view />
  </b-card>
  <router-view v-else />
</div>
</template>

<script>
import TopNav from './components/navigation/TopNav';
import SideNav from './components/navigation/SideNav';
import { isSignedIn } from '@/../utils/auth';

export default {
  name: 'app',
  components: {
    TopNav,
    SideNav
  },
  beforeCreate() {

    // checks signed in status on hash change and load
    this.$nextTick(function() {

      window.addEventListener('hashchange', this.handleIsSignedIn)
      window.addEventListener('load', this.handleIsSignedIn)

    });

  },
  methods: {

    /**
     * Checks signed in status
     */
    async handleIsSignedIn() {

      var response = await isSignedIn();

      if (response.data === 'Not signed in.' && this.$store.state.signedIn !== false) {
        this.$store.dispatch('setSignedOut');
      } else if (response.data !== 'Not signed in.' && this.$store.state.signedIn === false) {
        this.$store.dispatch('setSignedIn');
        this.$store.dispatch('setUserInfo', response.data.info);
      }
      
    }
  }
};
</script>

<style>
body {
  background-color: #f4f4f4;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
#main-content-card {
  margin: 130px 30px 60px 310px;
  padding: 60px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2),
              0 1px 8px 0 rgba(0, 0, 0, 0.19);
  -moz-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2),
                   0 1px 8px 0 rgba(0, 0, 0, 0.19);
  -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2),
                      0 1px 8px 0 rgba(0, 0, 0, 0.19);
  transition: margin-left 0.8s;
}
#main-content-card.hide {
  margin-left: 30px;
}
</style>
