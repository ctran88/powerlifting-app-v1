<template>
<div id='training-log'>
  <span class='program-name'>{{ $store.state.programs.program.metadata.name }} Training Log</span>

  <div class='program-wrapper'>
    <div class='program-month' :style='{ gridTemplateColumns: columns }'>
      <div class='program-day-column'>
        <span class='filler-day-label' />
        <span class='day-label' v-for='n in days'>Day {{ n }}</span>
      </div>
      <div class='program-week' v-for='(week, index) in weeks'>
        <span class='week-label'>Week {{ index + 1 }}</span>
        <div class='program-day' v-for='day in week.week' @click='handleLog(day, week._id)'>
          <ul class='exercise-list'>
            <li v-for='exercise in day.session'>
              <strong>{{ exercise.variations }} {{ exercise.name }}</strong>
              <br />
              {{ exercise.scheme }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>

  <b-modal id='session-log-modal' size='lg' title='Session log'>
    <strong class='weigh-in'>Weigh in:</strong>
    <b-form-input id='input-weigh-in' text='text' size='sm' v-model='log.weighIn' />
    <div class='session-log'>
      <strong class='header-fields' v-for='field in headerFields'>{{ field }}</strong>
    </div>
    <div class='session-log' v-for='(exercise, index) in log.exercises'>
      <span>{{ exercise.variations }} {{ exercise.exercise }}</span>
      <b-form-input text='text' size='sm' v-model='log.exercises[index].sets' />
      <b-form-input text='text' size='sm' v-model='log.exercises[index].reps' />
      <b-form-input text='text' size='sm' v-model='log.exercises[index].weight' />
      <b-form-input text='text' size='sm' v-model='log.exercises[index].rpe' />
    </div>
    <footer slot='modal-footer'>
      <b-btn variant='secondary' @click='handleCancel'>Cancel</b-btn>
      <b-btn variant='success' @click='handleSave'>Save</b-btn>
    </footer>
  </b-modal>
</div>
</template>

<script>
import api from '@/../utils/api';
import general from '@/mixins/general';
import programs from '@/mixins/programs';

export default {
  name: 'training-log',
  mixins: [
    general,
    programs
  ],
  data() {

    return {
      columns: '0.125fr',
      days: 7,
      weeks: [],
      headerFields: [
        'Exercise',
        'Sets',
        'Reps',
        'Weight',
        'RPE'
      ],
      log: {
        programId: '',
        microcycleId: '',
        sessionId: '',
        date: '',
        weighIn: '',
        exercises: []
      }
    };

  },
  mounted() {

    // this function is called before the setUserInfo acton can be completed (from App.vue), so user object is not set yet.  Set timetout as a workaround.
    setTimeout(this.getProgram(), 100);

  },
  methods: {

    /**
     * Format microcycles then pushes it to weeks array for display
     */
    formatMicrocycles() {

      var microcycles = this.$store.state.programs.program.microcycles;

      for (var i = 0; i < microcycles.length; i++) {
        var week = {
          _id: microcycles[i]._id,
          week: microcycles[i].sessions.map(this.formatSession)
        };

        this.columns += ' 1fr';
        this.weeks.push(week);
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
        return {
          _id: value._id,
          session: accessories
        };
      } else if (accessories.length === 0) {
        return {
          _id: value._id,
          session: main
        };
      } else {
        return {
          _id: value._id,
          session: main.concat(accessories)
        };
      }

    },

    /**
     * Makes an api call to retrieve log based on session id. If there is no log, sets default log information based on number of exercises in session array.
     *
     * @param      {Object}  session       The session
     * @param      {string}  microcycleId  The microcycle identifier
     */
    handleLog(session, microcycleId) {

      var query = '?_session=' + session._id;

      api.get('/training/logs' + query)
        .then((response) => {
          this.log.logId = response.data.logs[0]._id;
          this.log.programId = response.data.logs[0].metadata._program;
          this.log.microcycleId = response.data.logs[0].metadata._microcycle;
          this.log.sessionId = response.data.logs[0].metadata._session;
          this.log.date = response.data.logs[0].metadata.date;
          this.log.weighIn = response.data.logs[0].weighIn;
          this.log.exercises = JSON.parse(JSON.stringify(response.data.logs[0].main.concat(response.data.logs[0].accessories)))
        })
        .catch((error) => {
          this.log.logId = '';
          this.log.programId = this.$store.state.programs.program._id;
          this.log.microcycleId = microcycleId;
          this.log.sessionId = session._id;
          this.log.weighIn = '';
          this.log.exercises = [];

          for (var i = 0; i < session.session.length; i++) {
            var exercise = {
              exercise: session.session[i].name,
              variations: session.session[i].variations.trim()
            };

            this.log.exercises.push(exercise);
          }
        });
      
      this.handleOpen('session-log-modal');

    },

    /**
     * Splits the scheme string into key/values
     *
     * @param      {Object}  value   Exercise object
     * @return     {Object}  Formatted exercise scheme
     */
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

    /**
     * Closes log modal without saving
     */
    handleCancel() {

      this.handleClose('session-log-modal');

    },

    /**
     * Saves log information
     *
     * @param      {Object}  session  The session
     */
    handleSave(session) {

      // prepare payload object
      var payload = {
        metadata: {
          date: new Date().toISOString(),
          _program: this.log.programId,
          _microcycle: this.log.microcycleId,
          _session: this.log.sessionId
        },
        weighIn: this.log.weighIn,
        main: [],
        accessories: []
      };

      // prepares and pushes exercise object to either main or accessories array
      for (var i = 0; i < this.log.exercises.length; i++) {
        var exercise = {
          exercise: this.log.exercises[i].exercise,
          variations: this.log.exercises[i].variations,
          sets: this.log.exercises[i].sets,
          reps: this.log.exercises[i].reps,
          weight: this.log.exercises[i].weight,
          rpe: this.log.exercises[i].rpe
        };

        if (['squat', 'bench press', 'deadlift'].indexOf(exercise.exercise) === -1) {
          payload.accessories.push(exercise);
        } else {
          payload.main.push(exercise);
        }
      }

      // if logId exists (set from api call on handleLog), then makes patch api call, else makes post api call
      if (this.log.logId) {
        var query = this.log.logId;

        api.patch('/training/logs/' + query, payload)
          .then((response) => {
            if (response.status === 200) {
              console.log('Log updated successfully.');
            }
          })
          .catch((error) => {
            console.log('Error updating log.');
          });
      } else {
        api.post('/training/logs', payload)
          .then((response) => {
            if (response.status === 201) {
              console.log('Log saved successfully.');
            }
          })
          .catch((error) => {
            console.log('Error saving log: ', error);
          });
      }

      this.handleClose('session-log-modal');

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
#input-weigh-in {
  margin-left: 10px;
  width: 80px;
  display: inline-block;
}
.session-log {
  display: grid;
  grid-template-columns: 2fr repeat(4, 1fr);
}
.form-control {
  width: 50%;
}
</style>
