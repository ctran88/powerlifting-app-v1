<template>
  <div id="home">
    <h1 id="row-first">The Powerlifting</h1>
    <br />
    <h1 id="row-second">Notebook</h1>
  </div>
</template>

<script>
  export default {
    name: 'home'
  };
</script>

<style scoped>
  #home {
    height: 100%;
    width: 100%;
    position: fixed;
    background-image: url('../assets/barbell.jpg');
    background-size: cover;
  }
  h1 {
    color: #ffffff;
    position: fixed;
    font-size: 6rem;
  }
  #row-first {
    top: 200px;
    left: 50px;
  }
  #row-second {
    top: 315px;
    left: 315px;
  }
</style>
