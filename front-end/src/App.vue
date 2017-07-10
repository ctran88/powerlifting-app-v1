<template>
  <v-app id="app" standalone>
    <!-- not signed in toolbar -->
    <v-toolbar
      class="grey darken-4"
      dark
      v-if="!$store.state.signedIn && ['Sign in', 'Create an account', 'Page not found'].indexOf($route.name) === -1"
    >
      <v-toolbar-side-icon class="hidden-md-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>The Powerlifting Notebook</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat to="about">About us</v-btn>
        <v-btn flat to="create-account">Create an account</v-btn>
        <v-btn flat to="signin">Sign in</v-btn>
      </v-toolbar-items>
    </v-toolbar>

    <!-- signed in toolbar -->
    <v-toolbar
      class="grey darken-4"
      dark
      v-else-if="$store.state.signedIn && ['Sign in', 'Create an account', 'Page not found'].indexOf($route.name) === -1"
    >
      <v-toolbar-side-icon @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>The Powerlifting Notebook</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn flat @click.native.stop="handleSignout">Sign out</v-btn>
    </v-toolbar>
    
    <!-- drawer -->
    <v-navigation-drawer
      persistent
      v-model="drawer"
      light
      enable-resize-watcher
      overflow
      absolute
      v-else-if="$store.state.signedIn && ['Sign in', 'Create an account', 'Page not found'].indexOf($route.name) === -1"
    >
      <!-- drawer header -->
      <v-list class="pa-0">
        <v-list-tile avatar tag="div">
          <v-list-tile-avatar>
            <img src="https://randomuser.me/api/portraits/men/85.jpg" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>The Powerlifting Notebook</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <!-- coach menu -->
      <v-list
        class="pt-0"
        dense
        v-if="$store.getters.userInfo.accountType === 'coach'"
      >
        <v-divider></v-divider>
        <v-list-tile v-for="route in $router.options.routes.slice(4, 6)" :key="route.name">
          <v-list-tile-content>
            <router-link :to="route.path">{{ route.name }}</router-link>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <!-- client menu -->
      <v-list
        class="pt-0"
        dense
        v-else
      >
        <v-divider></v-divider>
        <v-list-tile v-for="route in routes" :key="route.name">
          <v-list-tile-content>
            <router-link :to="route.path">{{ route.name }}</router-link>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- main -->
    <main>
      <v-container fluid>
        <router-view></router-view>
      </v-container>
    </main>
  
    <!-- footer -->
    <v-footer>
      <span>© 2017 The Powerlifting Notebook</span>
    </v-footer>
  </v-app>
</template>

<script>
  import { firebase } from '@/../utils/firebase';

  export default {
    name: 'app',
    data: function() {
      return {
        drawer: true
      };
    },
    computed: {
      /**
       * Returns new route array for client side nav
       *
       * @return     {Array}  The client routes array
       */
      routes: function() {
        var router = this.$router.options.routes;
        var clientRoutes = [];

        for (var i = 0; i < router.length; i++) {
          if (router[i].name === 'Programs') {
            clientRoutes.push(router[i]);
          }
        }

        return clientRoutes;
      }
    },
    beforeCreate: function() {
      window.addEventListener('load', this.checkSignInStatus);
    },
    methods: {
      /**
       * Checks and sets auth status
       */
      checkSignInStatus: function() {
        firebase.auth().onIdTokenChanged((user) => {
          if (user) {
            this.$store.dispatch('setSignedIn');
            this.$store.dispatch('setUserInfo', user);
          } else {
            this.$store.dispatch('setSignedOut');
          }
        });
      },

      /**
       * Handles sign out procedure
       */
      handleSignout: function() {
        var client = 'https://192.168.54.54:8080';
        
        firebase.auth().signOut()
          .then(() => {
            this.$store.dispatch('setSignedOut');
            window.location.replace(client);
          })
          .catch((error) => {
            console.log('Error signing out: ', error);
          });
      }
    }
  };
</script>

<style>
  body {
    background-color: #f4f4f4;
  }
  footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    text-align: center;
  }
</style>
