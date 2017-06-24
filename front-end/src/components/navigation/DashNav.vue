<template>
<div class="dash-nav">
  <div class="row">
    <nav class="col-sm-2 col-md-1 hidden-xs-down sidebar">
      <b-nav vertical v-for="route in $router.options.routes.slice(3, -1)" :key="route.name">
        <router-link class="nav-link" :to="route.path">{{ route.name }}</router-link>
      </b-nav>
    </nav>
  </div>
</div>
</template>

<script>
export default {
  name: 'dash-nav'
};
</script>

<style scoped>
.sidebar {
  background-color: #3E4041;
  padding: 10px;
  height: 100%;
  position: fixed;
  margin-top: 60px;
  z-index: 101;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5),
              0 2px 8px 0 rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5),
                   0 2px 8px 0 rgba(0, 0, 0, 0.4);
  -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.5),
                      0 2px 8px 0 rgba(0, 0, 0, 0.4);
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
</style>
