<template>
  <v-app id="app" standalone>
    <!-- not signed in toolbar -->
    <v-toolbar
      class="grey darken-4"
      dark
      v-if="!$store.state.signedIn && ['Sign in', 'Create an account', 'Page not found'].indexOf($route.name) === -1"
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
      v-if="$store.state.signedIn && ['Sign in', 'Create an account', 'Page not found'].indexOf($route.name) === -1"
    >
      <!-- drawer header -->
      <v-list class="pa-0">
        <v-list-tile avatar tag="div">
          <v-list-tile-avatar>
            <img src="./assets/barbell.jpg" />
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title>
              <a class="brand" href="/">The Powerlifting Notebook</a>
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>

      <!-- coach menu -->
      <v-list
        class="pt-0"
        dense
        v-if="$store.getters.user.accountType === 'coach'"
      >
        <v-divider></v-divider>
        <v-list-tile v-for="route in $router.options.routes.slice(4, 7)" :key="route.name">
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

    <!-- signed in toolbar -->
    <v-toolbar
      class="grey darken-4"
      dark
      v-if="$store.state.signedIn && ['Sign in', 'Create an account', 'Page not found'].indexOf($route.name) === -1"
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
          <v-list-tile v-for="item in items" :key="item">
            <v-list-tile-title @click.stop="handleMenuSelect(item.title)">{{ item.title }}</v-list-tile-title>
          </v-list-tile>
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

        if (this.$store.state.signedIn) {
          this.handleCheckSignInStatus();
        }
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
      window.addEventListener('load', this.handleCheckSignInStatus);
    },
    methods: {
      /**
       * Checks and sets sign in status
       */
      handleCheckSignInStatus: function() {
        checkSignInStatus((user) => {
          if (user) {
            this.$firebaseRefs.users.child(user.uid).on('value', (snapshot) => {
              var userInfo = JSON.parse(JSON.stringify(snapshot.val()));

              userInfo.displayName = user.displayName;
              userInfo.email = user.email;
              userInfo.uid = user.uid;
              userInfo.photoURL = user.photoURL;

              this.$store.dispatch('setUserInfo', userInfo);
              this.$store.dispatch('setSignedIn');
            });
          } else {
            this.handleSignout();
            this.$store.dispatch('setSignedOut');
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
            this.$router.push({ name: 'Home' });
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
