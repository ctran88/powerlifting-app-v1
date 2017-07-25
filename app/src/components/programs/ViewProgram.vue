<template>
  <div id="view-program">
    <span class="program-name">{{ program.name }}</span>

    <div class="program-wrapper">
      <div class="program-month" :style="{ gridTemplateColumns: columns }">
        <div class="program-day-column">
          <span class="filler-day-label"></span>
          <span class="day-label" v-for="n in days">Day {{ n }}</span>
        </div>
        <div class="program-week" v-for="(week, index) in weeks">
          <span class="week-label">Week {{ index + 1 }}</span>
          <div class="program-day" v-for="day in week">
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
  </div>
</template>

<script>
  import { firebasedb } from '@/../utils/firebase';

  export default {
    name: 'view-program',
    data: function() {
      return {
        id: this.$store.state.programs.id,
        program: '',
        columns: '0.125fr',
        days: 7,
        weeks: []
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
      }
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
</style>
