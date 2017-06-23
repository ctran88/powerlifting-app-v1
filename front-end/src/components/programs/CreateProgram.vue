<template>
<div id="create-program">
  <b-card id="main-content-card">
    <b-form-input v-model="name" type="text" placeholder="Program name"></b-form-input>
    <b-button class="btn-save" variant="success" @click="saveProgram">Save program</b-button>

    <b-tabs pills card v-for="(week, index) in weeks" :key="index" id="workout-week">
      <b-tab disabled id="week-label" :title="'Week ' + (index + 1)"></b-tab>
      <b-tab title="Day 1">
        <create-session :day='1' :week='week'></create-session>
      </b-tab>
      <b-tab title="Day 2">
        <create-session :day='2' :week='week'></create-session>
      </b-tab>
      <b-tab title="Day 3">
        <create-session :day='3' :week='week'></create-session>
      </b-tab>
      <b-tab title="Day 4">
        <create-session :day='4' :week='week'></create-session>
      </b-tab>
      <b-tab title="Day 5">
        <create-session :day='5' :week='week'></create-session>
      </b-tab>
      <b-tab title="Day 6">
        <create-session :day='6' :week='week'></create-session>
      </b-tab>
      <b-tab title="Day 7">
        <create-session :day='7' :week='week'></create-session>
      </b-tab>
      <template slot="tabs">
        <b-button class="ml-auto btn-week" variant="danger" @click="deleteWeek(index)">Delete</b-button>
      </template>
    </b-tabs>

    <b-button class="btn-week" variant="primary" @click="addWeek">Add a week</b-button>
  </b-card>
</div>
</template>

<script>
import CreateSession from './CreateSession';
import api from '@/../utils/api';
import Vue from 'vue';

export default {
  name: 'create-program',
  components: {
    CreateSession
  },
  data() {
    return {
      name: '',
      week: 0,
      weeks: []
    };
  },
  methods: {
    addWeek() {
      this.weeks.push(++this.week);
    },
    deleteWeek(index) {
      this.weeks.splice(index, 1);
    },
    saveProgram() {
      // overwrite entire program with every save
      this.$store.dispatch('resetProgram');

      var array = this.$children[0].$children;

      // find which children are the workout weeks
      for (var i = 0; i < array.length; i++) {
        // start of iterating through each week
        if (array[i].id === 'workout-week') {
          // iterate through the days of the week
          for (var j = 1; j < array[i].tabs.length; j++) {
            // prepare session object
            var week = array[i].tabs[0].title.slice(-1);
            var day = array[i].tabs[j].$children[0];
            var session = {
              metadata: {
                week: week,
                day: day.day
              },
              main: [],
              accessories: [],
              rest: false
            };

            // format exercise object and push to session object
            for (var k = 0; k < day.exercises.length; k++) {
              var exerciseObj = {
                exercise: '',
                variation: '',
                sets: 0,
                reps: 0,
                weight: 0,
                rpe: 0,
                percent: 0,
                percentOf: '',
                backoff: false,
                workupSets: false
              };

              // set exercise object values
              exerciseObj.exercise = day.exercises[k].exercise;
              exerciseObj.variation = day.exercises[k].variation;
              exerciseObj.sets = day.exercises[k].sets;
              exerciseObj.reps = day.exercises[k].reps;

              // set load values based on load type
              switch (day.exercises[k].loadType) {
                case 'rpe':
                  exerciseObj.rpe = day.exercises[k].load;
                  break;
                case '%/1rm':
                  exerciseObj.percent = day.exercises[k].load;
                  exerciseObj.percentOf = '1rm';
                  break;
                case '%/ts':
                  exerciseObj.percent = day.exercises[k].load;
                  exerciseObj.percentOf = 'ts';
                  break;
                case 'weight':
                  exerciseObj.weight = day.exercises[k].load;
                  break;
              }

              // push exercise object to appropriate array in session object, or set rest day to true
              switch (day.exercises[k].liftType) {
                case 'main':
                  session.main.push(exerciseObj);
                  break;
                case 'accessories':
                  session.accessories.push(exerciseObj);
                  break;
                case 'rest':
                  session.rest = true;
                  break;
              }
            }

            // populate microcycle state in store
            this.$store.dispatch('updateMicrocycle', session);
          }

          // push microcycle to program state before reset
          this.$store.dispatch('updateProgram', this.name);
        } // end of iterating through each week
      }
    }
  }
};
</script>

<style>
#week-label__BV_tab_button__ {
  font-weight: bold;
  cursor: default;
}
</style>

<style scoped>
.btn-week {
  cursor: pointer;
}
</style>
