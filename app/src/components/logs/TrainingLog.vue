<template>
  <div id="view-program">
    <span class="program-name">{{ program.name }} Training Log</span>

    <div class="program-wrapper">
      <div class="program-month" :style="{ gridTemplateColumns: columns }">
        <div class="program-day-column">
          <span class="filler-day-label"></span>
          <span class="day-label" v-for="n in days">Day {{ n }}</span>
        </div>
        <div class="program-week" v-for="(week, index) in weeks">
          <span class="week-label">Week {{ index + 1 }}</span>
          <div class="program-day"
            v-for="day in week"
            @click.stop="handleOpenLog(day)"
          >
            <ul class="exercise-list">
              <li v-for="exercise in day">
                <strong>{{ exercise.variations }}{{ exercise.exercise }}</strong>
                <br />
                {{ exercise.scheme }} {{ exercise.loadScheme }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <v-dialog
      lazy
      v-model="dialog"
    >
      <v-card>
        <v-card-title>
          <span class="headline">Session log - {{ formattedDate }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field label="Weigh in" v-model="log.weighIn"></v-text-field>
          <div class="session-log" v-for="(exercise, index) in log.exercises">
            <span>{{ exercise.variations }} {{ exercise.exercise }}</span>
            <v-text-field label="Sets" v-model="log.exercises[index].sets"></v-text-field>
            <v-text-field label="Reps" v-model="log.exercises[index].reps"></v-text-field>
            <v-text-field label="Weight" v-model="log.exercises[index].weight"></v-text-field>
            <v-text-field label="RPE" v-model="log.exercises[index].rpe"></v-text-field>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            @click.native="dialog = false"
          >Cancel</v-btn>
          <v-btn
            flat
            @click.native="handleSave"
          >Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { firebasedb } from '@/../utils/firebase';

  export default {
    name: 'training-log',
    data: function() {
      return {
        id: this.$store.state.programs.id,
        program: '',
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
          date: '',
          weighIn: '',
          exercises: []
        },
        formattedDate: '',
        dialog: false
      };
    },
    firebase: {
      programs: {
        source: firebasedb.ref('/programs'),
        cancelCallback(error) {
          console.error('firebasedb error: ', error);
        }
      }
    },
    mounted: function() {
      this.getProgram();
    },
    methods: {
      /**
       * Handles retrieving and populating program
       */
      getProgram: function() {
        this.$firebaseRefs.programs
          .orderByKey()
          .equalTo(this.id)
          .once('value')
            .then((snapshot) => {
              var data = snapshot.val();

              if (data !== null) {
                var key = Object.keys(data)[0];
                var program = JSON.parse(JSON.stringify(data[key]));
  
                this.program = program;
                this.formatMicrocycles();
              } else {
                console.log('No data found.');
              }
            });
      },

      /**
       * Formats microcycles then pushes it to weeks array for display
       */
      formatMicrocycles() {
        var keys = Object.keys(this.program);
  
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].match(/week\d/g)) {
            this.columns += ' 1fr';
            this.weeks.push(this.formatSession(this.program[keys[i]]));
          }
        }
      },

      /**
       * Formats session information
       *
       * @param      {Object}  week   The week
       * @return     {Object}  Formatted week
       */
      formatSession(week) {
        var keys = Object.keys(week);
        var formattedWeek = [];

        // iterate over days of the week
        for (var i = 0; i < keys.length; i++) {
          var day = week[keys[i]];
          var session = [];
  
          // iterate over each exercise of the day
          for (var j = 0; j < day.length; j++) {
            var formattedExercise = this.formatExercise(day[j]);
            session.push(formattedExercise);
          }

          formattedWeek.push(session);
        }

        return formattedWeek;
      },

      /**
       * Formats exercise name, variation, and scheme for display.
       *
       * @param      {Object}  day   The day
       * @return     {Object}  Object with formatted exercise information
       */
      formatExercise: function(day) {
        var exercise = day.main || day.accessories || 'rest';
        var loadScheme = '';

        if (day.variations) {
          var variations = day.variations.join(' ') + ' ';
        }

        if (exercise === 'rest') {
          var scheme = '';
        } else {
          scheme = day.sets + 'x' + day.reps;
        }

        switch (day.loadType) {
          case 'weight':
            loadScheme = '@ ' + day.load;
            break;
          case 'rpe':
            loadScheme = '@ ' + day.loadType + ' ' + day.load;
            break;
          case '%/1rm':
          case '%/ts':
            loadScheme = '@ ' + day.load + day.loadType;
            break;
        }

        return {
          variations: variations,
          exercise: exercise,
          scheme: scheme,
          loadScheme: loadScheme
        };
      },

      /**
       * Handles initializing data when opening log dialog.
       *
       * @param      {Array}  day     The day
       */
      handleOpenLog: function(day) {
        this.log.date = new Date().toISOString();
        this.formattedDate = new Date().toUTCString().slice(0, -13);
        this.log.exercises = JSON.parse(JSON.stringify(day));
        this.dialog = true;
      }

      // /**
      //  * Makes an api call to retrieve log based on session id. If there is no log, sets default log information based on number of exercises in session array.
      //  *
      //  * @param      {Object}  session       The session
      //  * @param      {string}  microcycleId  The microcycle identifier
      //  */
      // handleLog(session, microcycleId) {
      //   var query = '?_session=' + session._id;

      //   api.get('/training/logs' + query)
      //     .then((response) => {
      //       this.log.logId = response.data.logs[0]._id;
      //       this.log.programId = response.data.logs[0].metadata._program;
      //       this.log.microcycleId = response.data.logs[0].metadata._microcycle;
      //       this.log.sessionId = response.data.logs[0].metadata._session;
      //       this.log.date = response.data.logs[0].metadata.date;
      //       this.log.weighIn = response.data.logs[0].weighIn;
      //       this.log.exercises = JSON.parse(JSON.stringify(response.data.logs[0].main.concat(response.data.logs[0].accessories)));
      //     })
      //     .catch(() => {
      //       this.log.logId = '';
      //       this.log.programId = this.$store.state.programs.program._id;
      //       this.log.microcycleId = microcycleId;
      //       this.log.sessionId = session._id;
      //       this.log.weighIn = '';
      //       this.log.exercises = [];

      //       for (var i = 0; i < session.session.length; i++) {
      //         var exercise = {
      //           exercise: session.session[i].name,
      //           variations: session.session[i].variations.trim()
      //         };

      //         this.log.exercises.push(exercise);
      //       }
      //     });

      //   this.handleOpen('session-log-modal');
      // },

      // /**
      //  * Splits the scheme string into key/values
      //  *
      //  * @param      {Object}  value   Exercise object
      //  * @return     {Object}  Formatted exercise scheme
      //  */
      // splitSchemeString(value) {
      //   var regex = /\d*(%|rpe|$)/g;
      //   var x = value.scheme.indexOf('x');
      //   var at = value.scheme.indexOf(' @');

      //   var sets = value.scheme.slice(0, x);
      //   var reps = value.scheme.slice(x + 1, at);
      //   var load = value.scheme.match(regex)[0].replace('rpe', '');

      //   var loadTypeStart = value.scheme.indexOf(load);
      //   var loadType = value.scheme.slice(loadTypeStart + load.length).replace('/', '');

      //   return {
      //     sets: sets,
      //     reps: reps,
      //     load: load,
      //     loadType: loadType
      //   };
      // },

      // /**
      //  * Saves log information
      //  *
      //  * @param      {Object}  session  The session
      //  */
      // handleSave(session) {
      //   // prepare payload object
      //   var payload = {
      //     metadata: {
      //       date: new Date().toISOString(),
      //       _program: this.log.programId,
      //       _microcycle: this.log.microcycleId,
      //       _session: this.log.sessionId
      //     },
      //     weighIn: this.log.weighIn,
      //     main: [],
      //     accessories: []
      //   };

      //   // prepares and pushes exercise object to either main or accessories array
      //   for (var i = 0; i < this.log.exercises.length; i++) {
      //     var exercise = {
      //       exercise: this.log.exercises[i].exercise,
      //       variations: this.log.exercises[i].variations,
      //       sets: this.log.exercises[i].sets,
      //       reps: this.log.exercises[i].reps,
      //       weight: this.log.exercises[i].weight,
      //       rpe: this.log.exercises[i].rpe
      //     };

      //     if (['squat', 'bench press', 'deadlift'].indexOf(exercise.exercise) === -1) {
      //       payload.accessories.push(exercise);
      //     } else {
      //       payload.main.push(exercise);
      //     }
      //   }

      //   // if logId exists (set from api call on handleLog), then makes patch api call, else makes post api call
      //   if (this.log.logId) {
      //     var query = this.log.logId;

      //     api.patch('/training/logs/' + query, payload)
      //       .then((response) => {
      //         if (response.status === 200) {
      //           console.log('Log updated successfully.');
      //         }
      //       })
      //       .catch((error) => {
      //         console.log('Error updating log: ', error);
      //       });
      //   } else {
      //     api.post('/training/logs', payload)
      //       .then((response) => {
      //         if (response.status === 201) {
      //           console.log('Log saved successfully.');
      //         }
      //       })
      //       .catch((error) => {
      //         console.log('Error saving log: ', error);
      //       });
      //   }

      //   this.handleClose('session-log-modal');
      // }

    }
  };
</script>

<style scoped>
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
