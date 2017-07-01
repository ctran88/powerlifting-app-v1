<template>
<main id="view-program">
  <span class="program-name">{{ $store.state.programs.program.metadata.name }}</span>

  <div class="program-wrapper">
    <div class="program-month">
      <div class="program-header">
        <span />
        <span class="day-label" v-for="n in days">Day {{ n }}</span>
      </div>
      <div class="program-week" v-for="(week, index) in weeks">
        <span class="week-label">Week {{ index + 1 }}</span>
        <div class="program-day" v-for="day in week" @click="handleDetails(day)">
          <ul class="exercise-list">
            <li v-for="exercise in day">
              {{ exercise.name }}
              <br />
              {{ exercise.scheme }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <b-modal id="session-details-modal" title="Session details">
    {{ details }}
    <footer slot="modal-footer">
      <b-btn variant="secondary" @click="handleClose('session-details-modal')">OK</b-btn>
    </footer>
  </b-modal>
</main>
</template>

<script>
import api from '@/../utils/api';

export default {
  name: 'view-program',
  data() {
    return {
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
    getProgram() {
      var query = '?_id=' + this.$store.state.programs.program._id;

      api.get('training/programs' + query)
        .then((response) => {
          this.$store.dispatch('setProgram', response.data.programs[0]);
          this.formatMicrocycles();
        })
        .catch((error) => {
          console.log('Program not found.');
        });
    },
    formatMicrocycles() {
      var microcycles = this.$store.state.programs.program.microcycles;

      for (var i = 0; i < microcycles.length; i++) {
        this.weeks.push(microcycles[i].sessions.map(this.formatSession));
      }
    },
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
    },
    formatExercise(value) {
      var name = '';
      var scheme = value.sets + 'x' + value.reps;
      var load = '';

      if (value.variations) {
        name = value.variations + ' ' + value.exercise;
      } else {
        name = value.exercise;
      }

      if (value.weight !== 0) {
        load = value.weight;
      } else if (value.rpe !== 0) {
        load = value.rpe + 'rpe';
      } else if (value.percent !== 0) {
        load = value.percent + '%/' + value.percentOf;
      }

      return {
        name: name,
        scheme: scheme + ' ' + load
      };
    },
    handleClose(modalId) {
      this.$root.$emit('hide::modal', modalId);
    },
    handleOpen(modalId) {
      this.$root.$emit('show::modal', modalId);
    },
    handleDetails(session) {
      this.details = session;
      this.handleOpen('session-details-modal');
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
  grid-template-columns: 1fr;
  border: 1px solid #e1e1e1;
  overflow: scroll;
}
.program-week {
  grid-template-columns: 0.5fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
}
.program-day {
  min-height: 100px;
  background-color: #ffffff;
  padding: 5px;
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
.exercise-list {
  margin-bottom: 0;
  padding-left: 20px;
}
</style>
