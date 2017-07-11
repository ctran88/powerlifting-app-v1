<template>
<div id='view-program'>
  <span class='program-name'>{{ $store.state.programs.program.metadata.name }}</span>

  <div class='program-wrapper'>
    <div class='program-month' :style='{ gridTemplateColumns: columns }'>
      <div class='program-day-column'>
        <span class='filler-day-label' />
        <span class='day-label' v-for='n in days'>Day {{ n }}</span>
      </div>
      <div class='program-week' v-for='(week, index) in weeks'>
        <span class='week-label'>Week {{ index + 1 }}</span>
        <div class='program-day' v-for='day in week'>
          <ul class='exercise-list'>
            <li v-for='exercise in day'>
              <strong>{{ exercise.variations }} {{ exercise.name }}</strong>
              <br />
              {{ exercise.scheme }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import programs from '@/mixins/programs';

export default {
  name: 'view-program',
  mixins: [
    programs
  ],
  data() {
    return {
      columns: '0.125fr',
      days: 7,
      weeks: [],
      details: ''
    };
  },
  mounted() {
    // this function is called before the setUserInfo acton can be completed (from App.vue), so user object is not set yet.  Set timetout as a workaround.
    setTimeout(this.getProgram(), 100);
  },
  methods: {

    /**
     * Formats microcycles then pushes it to weeks array for display
     */
    formatMicrocycles() {
      var microcycles = this.$store.state.programs.program.microcycles;

      for (var i = 0; i < microcycles.length; i++) {
        this.columns += ' 1fr';
        this.weeks.push(microcycles[i].sessions.map(this.formatSession));
      }
    },

    /**
     * Formats session information
     *
     * @param      {Object}  value   The array element (day/session)
     * @return     {Object}  Formatted session information with id
     */
    formatSession(value) {
      var main = value.main.map(this.formatExercise);
      var accessories = value.accessories.map(this.formatExercise);

      if (main.length === 0) {
        return accessories;
      } else if (accessories.length === 0) {
        return main;
      } else {
        return main.concat(accessories);
      }
    }

  }
};
</script>

<style scoped>
button {
  cursor: pointer;
}
.program-name {
  font-size: 26pt;
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
  border: 1px solid #e1e1e1;
  overflow: scroll;
}
.program-day-column {
  display: grid;
  grid-template-rows: 0fr repeat(7, 1fr);
}
.day-label {
  text-align: right;
  padding-right: 10px;
  min-height: 100px;
}
.filler-day-label {
  height: 24px;
}
.program-week {
  min-width: 300px;
  grid-template-rows: 0fr repeat(7, 1fr);
}
.week-label {
  padding-left: 10px;
}
.program-day {
  min-height: 100px;
  background-color: #ffffff;
  padding: 5px;
}
.program-day:hover {
  background-color: #f9f9f9;
}
.exercise-list {
  margin-bottom: 0;
  padding-left: 20px;
}
</style>
