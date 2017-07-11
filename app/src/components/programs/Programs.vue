<template>
  <div id="programs">
    <coach-programs v-if='$store.getters.user.accountType === "coach"' />
    <client-programs v-else />
  </div>
</template>

<script>
  import CoachPrograms from './CoachPrograms';
  import ClientPrograms from './ClientPrograms';

  export default {
    name: 'programs',
    components: {
      CoachPrograms,
      ClientPrograms
    }
  };
</script>

<style scoped>

</style>
