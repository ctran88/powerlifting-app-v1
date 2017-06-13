<template>
<div id='container'>
  <app-nav></app-nav>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <button @click="isSignedIn()">See cookie info</button>
  </div>
</div>
</template>

<script>
import AppNav from './AppNav';
import { isSignedIn } from '@/../utils/auth';

export default {
  name: 'cookie',
  components: {
    AppNav
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App!'
    }
  },
  methods: {
    async isSignedIn() {
      var response = await isSignedIn();

      if (response.data === 'Signed in.') {
        this.$store.dispatch('setSignedIn');
      } else {
        this.$store.dispatch('setSignedOut');
      }
    }
  }
}
</script>

<style scoped>
h1, h2 {
  font-weight: normal;
}
</style>
