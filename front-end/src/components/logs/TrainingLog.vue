<template>
<div id="training-log">
  <span class="program-name">{{ $store.state.programs.program.metadata.name }} Training Log</span>

  <div class="program-wrapper">
    <div class="program-month" :style="{ gridTemplateColumns: columns }">
      <div class="program-day-column">
        <span class="filler-day-label" />
        <span class="day-label" v-for="n in days">Day {{ n }}</span>
      </div>
      <div class="program-week" v-for="(week, index) in weeks">
        <span class="week-label">Week {{ index + 1 }}</span>
        <div class="program-day" v-for="day in week" @click="handleDetails(day)">
          <ul class="exercise-list">
            <li v-for="exercise in day">
              <strong>{{ exercise.name }}</strong>
              <br />
              {{ exercise.scheme }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <b-modal id="session-details-modal" title="Session details">
    <div class="session-details">
      <span class="header-fields" v-for="field in headerFields">{{ field }}</span>
    </div>
    <div class="session-details" v-for="exercise in details">
      <span>{{ exercise.name }}</span>
      <span>{{ exercise.scheme.sets }}</span>
      <span>{{ exercise.scheme.reps }}</span>
      <span>{{ exercise.scheme.load }}</span>
      <span>{{ exercise.scheme.loadType }}</span>
    </div>
    <footer slot="modal-footer">
      <b-btn variant="secondary" @click="handleCancel">Cancel</b-btn>
      <b-btn variant="success" @click="handleSave">Save</b-btn>
    </footer>
  </b-modal>
</div>
</template>

<script>
import api from '@/../utils/api';

export default {
  name: 'training-log',
  data() {
    return {
      columns: '0.125fr',
      days: 7,
      weeks: [],
      headerFields: [
        'Exercise',
        'Sets',
        'Reps',
        'Load',
        'Load Type'
      ],
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
        this.columns += ' 1fr';
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
        scheme: scheme + ' @ ' + load
      };
    },
    handleClose(modalId) {
      this.$root.$emit('hide::modal', modalId);
    },
    handleOpen(modalId) {
      this.$root.$emit('show::modal', modalId);
    },
    handleDetails(session) {
      var formattedSession = JSON.parse(JSON.stringify(session));
      var formattedScheme = formattedSession.map(this.splitSchemeString);

      for (var i = 0; i < formattedSession.length; i++) {
        formattedSession[i].scheme = JSON.parse(JSON.stringify(formattedScheme[i]));
      }

      this.details = formattedSession;
      this.handleOpen('session-details-modal');
    },
    splitSchemeString(value) {
      var regex = /\d*(%|rpe|$)/g;
      var x = value.scheme.indexOf('x');
      var at = value.scheme.indexOf(' @');

      var sets = value.scheme.slice(0, x);
      var reps = value.scheme.slice(x + 1, at);
      var load = value.scheme.match(regex)[0].replace('rpe', '');

      var loadTypeStart = value.scheme.indexOf(load);
      var loadType = value.scheme.slice(loadTypeStart + load.length).replace('/', '');

      return {
        sets: sets,
        reps: reps,
        load: load,
        loadType: loadType
      };
    },
    handleCancel() {
      this.handleClose('session-details-modal');
    },
    handleSave() {
      this.handleClose('session-details-modal');
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
  cursor: pointer;
}
.program-day:hover {
  background-color: #f9f9f9;
}
.exercise-list {
  margin-bottom: 0;
  padding-left: 20px;
}
.session-details {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
}
</style>
