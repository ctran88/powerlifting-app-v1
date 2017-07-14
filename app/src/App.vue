<template>
  <v-app id="app">
    <div v-if="loading"></div>
    <!-- not signed in toolbar -->
    <v-toolbar
      class="grey darken-4"
      dark
      v-else-if="!$store.state.signedIn && ['Sign in', 'Create an account', 'Invitation', 'Page not found'].indexOf($route.name) === -1"
    >
      <v-toolbar-side-icon class="hidden-md-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <a class="brand" href="/">The Powerlifting Notebook</a>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat to="about">About us</v-btn>
        <v-btn flat to="create-account">Create an account</v-btn>
        <v-btn flat to="signin">Sign in</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    
    <!-- drawer -->
    <v-navigation-drawer
      persistent
      v-model="drawer"
      light
      enable-resize-watcher
      overflow
      v-if="$store.state.signedIn && ['Sign in', 'Create an account', 'Invitation', 'Page not found'].indexOf($route.name) === -1"
    >
      <!-- drawer header -->
      <v-list class="pa-1">
        <v-list-tile avatar tag="div">
          <v-list-tile-avatar>
            <img src="./assets/barbell.jpg" />
          </v-list-tile-avatar>
          <v-list-tile class="brand" href="/">The Powerlifting Notebook</v-list-tile>
        </v-list-tile>
      </v-list>
      <v-divider></v-divider>

      <!-- coach menu -->
      <v-list v-if="$store.getters.user.accountType === 'coach'">
        <v-list-tile
          v-for="route in $router.options.routes.slice(5, 8)"
          :key="route.name"
          :to="route.path"
        >{{ route.name }}</v-list-tile>
      </v-list>

      <!-- client menu -->
      <v-list v-else>
        <v-list-tile
          v-for="route in routes"
          :key="route.name"
          :to="route.path"
        >{{ route.name }}</v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- signed in toolbar -->
    <v-toolbar
      class="grey darken-4"
      dark
      v-if="$store.state.signedIn && ['Sign in', 'Create an account', 'Invitation', 'Page not found'].indexOf($route.name) === -1"
    >
      <v-toolbar-side-icon @click.native.stop="handleToggleDrawer"></v-toolbar-side-icon>
      <v-toolbar-title v-if="$route.name === 'Home'">
        <a class="brand" href="/">The Powerlifting Notebook</a>
      </v-toolbar-title>
      <v-toolbar-title v-else>
        <span class="route-label">{{ $route.name }}</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-menu offset-y>
        <v-btn flat slot="activator">
          <v-list-tile-avatar class="mr-3">
            <img :src="$store.state.user.photoURL" />
          </v-list-tile-avatar>
          <span>{{ $store.state.user.displayName }}</span>
        </v-btn>
        <v-list>
          <v-list-tile
            v-for="item in items"
            :key="item"
            @click.native="handleMenuSelect(item.title)"
          >{{ item.title }}</v-list-tile>
        </v-list>
      </v-menu>
    </v-toolbar>

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
  import { firebasedb } from '@/../utils/firebase';
  import { checkSignInStatus, signout } from '@/../utils/auth';

  export default {
    name: 'app',
    data: function() {
      return {
        loading: true,
        drawer: false,
        items: [
          {
            title: 'Settings'
          },
          {
            title: 'Sign out'
          }
        ]
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
    watch: {
      '$route': function(to, from) {
        if (to.name === 'Home') {
          this.drawer = false;
        }

        // checks for sign in, sign out, password change, and token expiry events. if not signed in, signs out user.
        checkSignInStatus((user) => {
          // not entirely sure if this whole block is needed. not sure if user is automatically signed out or not if user is not detected.
          if (!user) {
            var excludeRoutes = [
              'Sign in',
              'Create an account',
              'Invitation',
              'About',
              'Page not found'
            ];

            if (excludeRoutes.indexOf(this.$route.name) === -1) {
              this.handleSignout();
            }
          }
        });
      }
    },
    firebase: {
      users: {
        source: firebasedb.ref('users'),
        cancelCallback(error) {
          console.error('firebasedb error: ', error);
        }
      }
    },
    mounted: function() {
      // called once
      this.handleInitialDataFetch();
      // constant observer
      this.handleDataChange();
    },
    methods: {
      /**
       * Checks and sets sign in status once when a page is loaded.
       */
      handleInitialDataFetch: function() {
        checkSignInStatus((user) => {
          if (user) {
            this.$firebaseRefs.users.child(user.uid).once('value', (snapshot) => {
              var userInfo = JSON.parse(JSON.stringify(snapshot.val()));

              userInfo.displayName = user.displayName;
              userInfo.email = user.email;
              userInfo.uid = user.uid;
              userInfo.photoURL = user.photoURL;

              this.$store.dispatch('setUserInfo', userInfo);
              this.$store.dispatch('setSignedIn');
              this.loading = false;
            });
          } else {
            this.loading = false;
          }
        });
      },

      /**
       * Checks and sets sign in status when data is changed
       */
      handleDataChange: function() {
        checkSignInStatus((user) => {
          if (user) {
            this.$firebaseRefs.users.on('child_changed', (snapshot) => {
              var userInfo = JSON.parse(JSON.stringify(snapshot.val()));

              userInfo.displayName = user.displayName;
              userInfo.email = user.email;
              userInfo.uid = user.uid;
              userInfo.photoURL = user.photoURL;

              this.$store.dispatch('setUserInfo', userInfo);
              this.$store.dispatch('setSignedIn');
            });
          }
        });
      },

      /**
       * Handles drawer toggle button
       */
      handleToggleDrawer: function() {
        this.drawer = !this.drawer;
      },

      /**
       * Handles dropdown menu select from signed in menu
       *
       * @param      {string}  item    The item
       */
      handleMenuSelect: function(item) {
        switch (item) {
          case 'Settings':
            this.$router.push({ name: 'User settings' });
            break;
          case 'Sign out':
            this.handleSignout();
            break;
        }
      },

      /**
       * Handles sign out procedure
       */
      handleSignout: function() {
        signout()
          .then(() => {
            this.$store.dispatch('setSignedOut');
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
</style>

<style scoped>
  .brand {
    cursor: pointer;
    text-decoration: none;
    color: #ffffff;
  }
  .route-label {
    cursor: auto;
  }
</style>
