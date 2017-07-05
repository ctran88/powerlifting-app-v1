<template>
<div id='dash'>
  hello i'm the dash
</div>
</template>

<script>
import Router from 'vue-router';

export default {
  name: 'dash',
  mounted() {

    var router = new Router();
    
    if (this.$store.getters.userInfo.accountType === 'coach') {
      router.push('/clients');
    } else {
      router.push('/programs');
    }
    

  }
};
</script>

<style scoped>

</style>
