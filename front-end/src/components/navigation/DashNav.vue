<template>
<div class="container-fluid">
  <div class="row">
    <nav class="col-sm-2 col-md-1 hidden-xs-down sidebar">
      <ul class="nav flex-column">
        <li class="nav-item">
          <a class="nav-link active" href="#">Dashboard</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Program</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Training Log</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#">Metrics</a>
        </li>
      </ul>
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
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5),
              0 6px 10px 0 rgba(0, 0, 0, 0.4);
  -moz-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5),
                   0 6px 10px 0 rgba(0, 0, 0, 0.4);
  -webkit-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.5),
                      0 6px 10px 0 rgba(0, 0, 0, 0.4);
  z-index: 101;
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
