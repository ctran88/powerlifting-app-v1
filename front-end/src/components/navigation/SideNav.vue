<template>
<div class='side-nav'>
  <div class='sidebar col-2' :class='{ hide: $store.state.sideNavHidden }'>
    <b-link class='navbar-brand' href='/'>The Powerlifting Notebook</b-link>

    <!-- coach side nav -->
    <div v-if='$store.getters.userInfo.accountType === "coach"'>
      <b-nav vertical v-for='route in $router.options.routes.slice(4, 6)' :key='route.name'>
        <router-link class='nav-link' :to='route.path'>{{ route.name }}</router-link>
      </b-nav>
    </div>

    <!-- client side nav -->
    <div v-else>
      <b-nav vertical v-for='route in routes' :key='route.name'>
        <router-link class='nav-link' :to='route.path'>{{ route.name }}</router-link>
      </b-nav>
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: 'side-nav',
  computed: {

    /**
     * Returns new route array for client side nav
     *
     * @return     {Array}  The client routes array
     */
    routes() {

      var router = this.$router.options.routes;
      var clientRoutes = [];

      for (var i = 0; i < router.length; i++) {
        if (router[i].name === 'Programs') {
          clientRoutes.push(router[i]);
        }
      }

      return clientRoutes;

    }
  }
};
</script>

<style scoped>
.sidebar {
  background-color: #3E4041;
  border-right: 1px solid rgba(0, 0, 0, 0.8);
  padding: 10px;
  min-width: 280px;
  width: 280px;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5),
              0 2px 8px 0 rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5),
                   0 2px 8px 0 rgba(0, 0, 0, 0.4);
  -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5),
                      0 2px 8px 0 rgba(0, 0, 0, 0.4);
  transform: translateX(0);
  transition: transform 0.8s;
}
.sidebar.hide {
  transform: translateX(-100%);
}
a {
  color: #ffffff;
}
a.active {
  color: #C8D80D;
}
a:hover {
  color: #C8D80D;
}
.navbar-brand {
  font-size: 16pt;
  font-weight: bold;
  white-space: normal;
}
</style>
