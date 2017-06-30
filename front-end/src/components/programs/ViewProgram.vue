<template>
<main id="view-program">
  <span class="program-name">Program name</span>

  <div class="program-wrapper">

    <div class="program-month">
      <div class="program-header">
        <span></span>
        <span class="day-label" v-for="n in days">Day {{ n }}</span>
      </div>
      <div class="program-week" v-for="n in weeks">
        <span class="week-label">Week {{ n }}</span>
        <div class="program-day">
          Paused Low Bar Squat 3x10 @75%/1rm
          Close Grip Bench press 3x10 @8/rpe
          Conventional Block Deadlift 3x10 @90%/ts
        </div>
        <div class="program-day"></div>
        <div class="program-day"></div>
        <div class="program-day"></div>
        <div class="program-day"></div>
        <div class="program-day"></div>
        <div class="program-day"></div>
      </div>
    </div>
  </div>
</main>
</template>

<script>
import api from '@/../utils/api';

export default {
  name: 'view-program',
  data() {
    return {
      weeks: 4,
      days: 7
    };
  },
  mounted() {
    // this function is called before the setUserInfo acton can be completed (from App.vue), so user object is not set yet.  Set timetout as a workaround.
    setTimeout(this.getProgram(), 100);
  },
  methods: {
    getProgram() {
      var query = '?_id=' + this.$store.state.programs.program._id;

      api.get('training/programs' + query)
        .then((response) => {
          this.$store.dispatch('setProgram', response.data.programs[0]);
          this.setMetadataDefaults();
        })
        .catch((error) => {
          console.log('Program not found.');
        });
    }
  }
};
</script>

<style scoped>
.program-name {
  font-size: 20pt;
  font-weight: bold;
}
.program-month,
.program-week {
  display: grid;
  grid-column-gap: 1px;
  grid-row-gap: 1px;
  background-color: #e1e1e1;
}
.program-month {
  grid-template-columns: 1fr;
  border: 1px solid #e1e1e1;
}
.program-week {
  grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
.program-day {
  height: 100px;
  background-color: #ffffff;
}
.program-day:hover {
  background-color: #f9f9f9;
  cursor: pointer;
}
.program-header {
  display: grid;
  grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
.week-label {
  padding-right: 10px;
  text-align: right;
}
.day-label {
  padding-left: 10px;
}
</style>
