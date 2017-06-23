<template>
<div id='app'>
  <app-nav v-show="['Sign in', 'Page not found'].indexOf($route.name) == -1"></app-nav>
  <router-view></router-view>
</div>
</template>

<script>
import AppNav from './components/navigation/AppNav';
import { isSignedIn } from '@/../utils/auth';

export default {
  name: 'app',
  components: {
    AppNav
  },
  beforeCreate() {
    this.$nextTick(function() {
      window.addEventListener('hashchange', this.handleIsSignedIn)
      window.addEventListener('load', this.handleIsSignedIn)
    });
  },
  methods: {
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
}
#main-content-card {
  margin: 100px 40px 60px 180px;
  padding: 60px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
              0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -moz-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
                   0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -webkit-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
                      0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
</style>
