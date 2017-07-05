<template>
<div id='top-nav'>
  <b-navbar toggleable type='inverse' variant='inverse' class='navbar-double' />
  <b-navbar toggleable type='inverse' variant='inverse' :style='styles' :class='{ hide: $store.state.sideNavHidden }'>
    <!-- signed in and not at home page -->
    <b-nav is-nav-bar v-if='$store.state.signedIn && ['Home'].indexOf($route.name) === -1'>
      <b-btn class='btn-toggle' @click='handleToggle'><span class='navbar-toggler-icon' /></b-btn>
      <span id='route-name'>{{ $route.name }}</span>
    </b-nav>
    <!-- signed in -->
    <b-nav is-nav-bar v-else-if='$store.state.signedIn'>
      <b-link class='navbar-brand' href='/'>The Powerlifting Notebook</b-link>
      <router-link class='nav-link' to='dash'>My Dashboard</router-link>
    </b-nav>
    <!-- not signed in -->
    <b-nav is-nav-bar v-else>
      <b-link class='navbar-brand' href='/'>The Powerlifting Notebook</b-link>
      <router-link class='nav-link' to='about'>About us</router-link>
    </b-nav>
  
    <!-- create account/sign in buttons -->
    <b-nav is-nav-bar class='ml-auto'>
      <b-button id='btn-signout' @click='handleSignout' v-if='$store.state.signedIn' :class='{ hide: $store.state.sideNavHidden, home: atHome }'>Sign out</b-button>
      <div v-else>
        <b-button id='btn-create-account' to='create-account'>Create an account</b-button>
        <b-button id='btn-signin' to='signin'>Sign in</b-button>
      </div>
    </b-nav>
  </b-navbar>
</div>
</template>

<script>
import SideNav from './SideNav';
import { signout } from '@/../utils/auth';

export default {
  name: 'top-nav',
  components: {
    SideNav
  },
  data() {

    return {
      styles: {
        left: ''
      }
    };

  },
  created() {

    // set left padding if side nav is hidden or not
    this.setStyles();
    this.$watch('$route', this.setStyles);

  },
  computed: {

    /**
     * Returns if at home page or not
     *
     * @return     {boolean}  Returns true if at home page, else false
     */
    atHome() {

      return this.$route.name === 'Home' ? true : false;

    }

  },
  methods: {

    /**
     * Sets padding left to 0 if at home page or if side nav is hidden, else 200px
     */
    setStyles() {

      if (this.$route.name === 'Home') {
        this.styles.left = '0';
        this.$store.dispatch('setSideNavHiddenOff');
      } else {
        this.styles.left = '280px';
      }

    },

    /**
     * Toggles side nav as hidden or not
     */
    handleToggle() {

      if (this.$store.state.sideNavHidden) {
        this.$store.dispatch('setSideNavHiddenOff');
      } else {
        this.$store.dispatch('setSideNavHiddenOn');
      }

    },

    /**
     * Handles sign out procedure
     */
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
.navbar-double {
  position: fixed;
  height: 100px;
  width: 100%;
  z-index: 8;
}
.navbar {
  position: fixed;
  height: 100px;
  width: 100%;
  border-bottom: 1px solid rgba(0, 0, 0, 0.8);
  z-index: 9;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5),
              0 2px 8px 0 rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5),
                   0 2px 8px 0 rgba(0, 0, 0, 0.4);
  -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5),
                      0 2px 8px 0 rgba(0, 0, 0, 0.4);
  transform: translateX(0);
  transition: transform 0.8s;
}
.navbar.hide {
  transform: translateX(-280px);
}
.btn-toggle {
  background-color: transparent;
  border: none;
  padding: 10px;
  margin-right: 20px;
  font-size: 20px;
  cursor: pointer;
}
#route-name {
  color: #ffffff;
  font-size: 28pt;
}
#btn-create-account {
  color: #ffffff;
  border-color: #0A3E65;
  background-color: #0A3E65;
  cursor: pointer;
}
#btn-create-account:hover, #btn-create-account:active {
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
#btn-signout {
  transform: translateX(-280px);
  transition: transform 0.8s;
}
#btn-signout.hide,
#btn-signout.home {
  transform: translateX(0);
}
</style>
