<template>
  <div id="home">
    <h1 id="row-first">The Powerlifting</h1>
    <br />
    <h1 id="row-second">Notebook</h1>
    <img id="background" src="../../assets/barbell.jpg">
  </div>
</template>

<script>
  export default {
    name: 'home'
  };
</script>

<style scoped>
  #home {
    display: flex;
  }
  #background {
    min-height: 100%;
    min-width: 100%;
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
