<template>
  <div id="dashboard">
    hello i'm the dashboard
  </div>
</template>

<script>
  export default {
    name: 'dashboard',
    beforeRouteEnter: function(to, from, next) {
      next((vm) => {
        if (from.name === 'Sign in') {
          vm.$parent.drawer = true;
        }
      });
    }
  };
</script>

<style scoped>

</style>
