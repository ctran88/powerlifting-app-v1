<template>
<div class="side-nav">
  <div class="sidebar col-2" :class="{ hide: $store.state.sideNavHidden }">
    <b-link class="navbar-brand" href="/">The Powerlifting Notebook</b-link>

    <b-nav vertical v-for="route in $router.options.routes.slice(3, -1)" :key="route.name">
      <router-link class="nav-link" :to="route.path">{{ route.name }}</router-link>
    </b-nav>
  </div>
</div>
</template>

<script>
export default {
  name: 'side-nav'
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
