<template>
<div>
  <app-nav></app-nav>
  <div class="container-fluid">
    <div class="row">
      <nav class="col-sm-3 col-md-2 hidden-xs-down sidebar">
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
</div>
</template>

<script>
import AppNav from './AppNav';

export default {
  name: 'dash-nav',
  components: {
    AppNav
  }
};
</script>

<style scoped>
.sidebar {
  background-color: #153355;
  height: 100%;
}
a {
  color: #ffffff;
}
a.active {
  background-color: rgba(200, 216, 13, 0.7);
  color: #ffffff;
}
a:hover {
  color: #C8D80D;
}
</style>
