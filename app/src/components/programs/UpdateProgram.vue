<template>
<div id='update-program'>
  <div class='row'>
    <span class='text-muted'>Program name</span>
    <b-form-input v-model='name' type='text' />

    <span class='text-muted'>Client</span>
    <b-form-select :options='clientList' v-model='client' />

    <b-form-checkbox v-model='active' id='program-active' value=true unchecked-value=false>Make this the active program?</b-form-checkbox>

    <b-button-group class='ml-auto'>
      <b-button class='btn-cancel-changes' variant='warning' v-b-modal='"cancellation-modal"'>Cancel changes</b-button>
      <b-button class='btn-save-draft' variant='success' @click='handleSaveDraft'>Save draft</b-button>
      <b-button class='btn-save-published' variant='primary' @click='handlePublish'>Publish</b-button>
    </b-button-group>
  </div>

  <b-modal id='cancellation-modal' size='sm' title='Cancellation confirmation'>
    Are you sure you want to cancel your changes and leave this page?
    <footer slot='modal-footer'>
      <b-btn variant='secondary' @click='handleClose("cancellation-modal")'>No</b-btn>
      <b-btn variant='warning' @click='handleCancelChanges'>Yes, cancel changes</b-btn>
    </footer>
  </b-modal>
  <b-modal id='save-draft-modal' :title='message.title'>
    {{ message.details }}
    <footer slot='modal-footer'>
      <b-btn variant='secondary' @click='handleGoBack'>Go back</b-btn>
      <b-btn variant='success' @click='handleClose("save-draft-modal")'>Continue editing</b-btn>
    </footer>
  </b-modal>
  <b-modal id='published-modal' :title='message.title'>
    {{ message.details }}
    <footer slot='modal-footer'>
      <b-btn variant='primary' @click='handlePublishedOk'>Ok</b-btn>
    </footer>
  </b-modal>

  <hr />

  <b-tabs pills card id='workout-week' v-for='(week, index) in weeks' :key='index'>
    <b-tab disabled id='week-label' :title='"Week " + (index + 1)' />
    <b-tab title='Day 1'>
      <create-session :day='1' :week='week' />
    </b-tab>
    <b-tab title='Day 2'>
      <create-session :day='2' :week='week' />
    </b-tab>
    <b-tab title='Day 3'>
      <create-session :day='3' :week='week' />
    </b-tab>
    <b-tab title='Day 4'>
      <create-session :day='4' :week='week' />
    </b-tab>
    <b-tab title='Day 5'>
      <create-session :day='5' :week='week' />
    </b-tab>
    <b-tab title='Day 6'>
      <create-session :day='6' :week='week' />
    </b-tab>
    <b-tab title='Day 7'>
      <create-session :day='7' :week='week' />
    </b-tab>
    <template slot='tabs'>
      <div class='btn-action'>
        <b-button class='btn-week' id='btn-duplicate-week' @click='handleDuplicateWeek(index)'>Duplicate</b-button>
        <b-button class='btn-week' id='btn-delete-week' variant='danger' @click='handleDeleteWeek(index)'>Delete</b-button>
      </div>
    </template>
  </b-tabs>

  <hr />

  <b-button class='btn-week' variant='primary' @click='handleAddWeek'>Add a week</b-button>
</div>
</template>

<script>
import CreateSession from './CreateSession';
import api from '@/../utils/api';
import Router from 'vue-router';
import general from '@/mixins/general';
import programs from '@/mixins/programs';

export default {
  name: 'update-program',
  mixins: [
    general,
    programs
  ],
  components: {
    CreateSession
  },
  data() {
    return {
      _id: '',
      name: '',
      client: ' ',
      created: '',
      active: 'false',
      weeks: [],
      week: '',
      clientList: [' '],
      message: {
        title: '',
        details: ''
      }
    };
  },
  mounted() {
    // this function is called before the setUserInfo acton can be completed (from App.vue), so user object is not set yet.  Set timetout as a workaround.
    setTimeout(() => {
      this.getClients();
      this.getProgram();
    }, 100);
  },
  methods: {

    /**
     * Makes api call to get program using program id from state
     */
    getProgram() {
      var query = '?_id=' + this.$store.state.programs.program._id;

      api.get('training/programs' + query)
        .then((response) => {
          this.$store.dispatch('setProgram', response.data.programs[0]);
          this.setMetadataDefaults();
        })
        .catch((error) => {
          console.log('Program not found. ', error);
        });
    },

    /**
     * Sets the metadata defaults for the program
     */
    setMetadataDefaults() {
      var program = JSON.parse(JSON.stringify(this.$store.state.programs.program));

      this._id = program._id;
      this.name = program.metadata.name;
      this.client = program.metadata.client;
      this.created = program.metadata.created;
      this.active = program.metadata.active.toString();
      this.weeks = Array.from(new Array(program.microcycles.length), (val, index) => index + 1);
      this.week = program.microcycles.length;

      // delay needed to let dom render the updates above
      setTimeout(() => {
        var updateProgram = this.$children;

        for (var i = 0; i < updateProgram.length; i++) {
          if (updateProgram[i].id === 'workout-week') {
            this.setExerciseDefaults(i);
          }
        }
      }, 100);
    },

    /**
     * Sets the exercise defaults.
     *
     * @param      {number}  weekIndex  The week index
     */
    setExerciseDefaults(weekIndex) {
      var microcycle = JSON.parse(JSON.stringify(this.$store.state.programs.program.microcycles));
      var workoutWeek = this.$children[weekIndex].$children;

      // day 1 starts at index[2]
      for (var i = 2; i < workoutWeek.length; i++) {
        var createSession = workoutWeek[i].$children[0];

        for (var j = 0; j < microcycle.length; j++) {
          if (createSession.week === microcycle[j].metadata.week) {
            var sessions = microcycle[j].sessions;

            for (var k = 0; k < sessions.length; k++) {
              if (createSession.day === sessions[k].metadata.day) {
                var exerciseObj = {
                  liftType: undefined,
                  accessories: undefined,
                  exercise: undefined,
                  variations: undefined,
                  sets: undefined,
                  reps: undefined,
                  loadType: undefined,
                  load: ''
                };

                if (sessions[k].rest === true) {
                  exerciseObj = {
                    liftType: 'rest',
                    accessories: undefined,
                    exercise: undefined,
                    variations: undefined,
                    sets: undefined,
                    reps: undefined,
                    loadType: undefined,
                    load: ''
                  };

                  createSession.exercises.push(exerciseObj);
                } else {
                  // load any main exercises first
                  for (var l = 0; l < sessions[k].main.length; l++) {
                    exerciseObj = {
                      liftType: undefined,
                      accessories: undefined,
                      exercise: undefined,
                      variations: undefined,
                      sets: undefined,
                      reps: undefined,
                      loadType: undefined,
                      load: ''
                    };

                    exerciseObj.liftType = 'main';
                    exerciseObj.exercise = sessions[k].main[l].exercise;
                    exerciseObj.variations = sessions[k].main[l].variations;
                    exerciseObj.sets = sessions[k].main[l].sets;
                    exerciseObj.reps = sessions[k].main[l].reps;

                    if (sessions[k].main[l].rpe !== 0) {
                      exerciseObj.loadType = 'rpe';
                      exerciseObj.load = sessions[k].main[l].rpe;
                    } else if (sessions[k].main[l].percentOf !== '') {
                      exerciseObj.loadType = '%/' + sessions[k].main[l].percentOf;
                      exerciseObj.load = sessions[k].main[l].percent;
                    } else if (sessions[k].main[l].weight !== 0) {
                      exerciseObj.loadType = 'weight';
                      exerciseObj.load = sessions[k].main[l].weight;
                    }

                    createSession.exercises.push(exerciseObj);
                  }
                  // then load any accessories
                  for (l = 0; l < sessions[k].accessories.length; l++) {
                    exerciseObj = {
                      liftType: undefined,
                      accessories: undefined,
                      exercise: undefined,
                      variations: undefined,
                      sets: undefined,
                      reps: undefined,
                      loadType: undefined,
                      load: ''
                    };

                    exerciseObj.liftType = 'accessories';
                    exerciseObj.accessories = sessions[k].accessories[l].exercise;
                    exerciseObj.variations = sessions[k].accessories[l].variations;
                    exerciseObj.sets = sessions[k].accessories[l].sets;
                    exerciseObj.reps = sessions[k].accessories[l].reps;

                    if (sessions[k].accessories[l].rpe !== 0) {
                      exerciseObj.loadType = 'rpe';
                      exerciseObj.load = sessions[k].accessories[l].rpe;
                    } else if (sessions[k].accessories[l].percentOf !== '') {
                      exerciseObj.loadType = '%/' + sessions[k].accessories[l].percentOf;
                      exerciseObj.load = sessions[k].accessories[l].percent;
                    } else if (sessions[k].accessories[l].weight !== 0) {
                      exerciseObj.loadType = 'weight';
                      exerciseObj.load = sessions[k].accessories[l].weight;
                    }

                    createSession.exercises.push(exerciseObj);
                  }
                }
              }
            }
          }
        }
      }
    },

    /**
     * Handles cancellation modal and reoutes back to programs
     */
    handleCancelChanges() {
      var router = new Router();

      this.handleClose('cancellation-modal');
      router.push('/programs');
    },

    /**
     * Saves a program.
     *
     * @param      {string}  saveStatus  The save status
     * @return     {Promise}  The promise of save response
     */
    saveProgram(saveStatus) {
      if (this.name === '') {
        return Promise.reject('Program name required.');
      }

      // overwrite entire program with every save
      this.$store.dispatch('resetProgram');

      var metadata = {
        name: this.name,
        coach: this.$store.state.user.email,
        status: saveStatus,
        active: this.active,
        created: this.created,
        lastUpdated: new Date().toISOString()
      };

      if (this.client !== ' ') {
        metadata.client = this.client;
      }

      var array = this.$children;

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
              rest: true
            };

            // format exercise object and push to session object
            for (var k = 0; k < day.exercises.length; k++) {
              var exerciseObj = {
                exercise: '',
                variations: '',
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
              if (day.exercises[k].accessories !== undefined) {
                exerciseObj.exercise = day.exercises[k].accessories;
              } else if (day.exercises[k].exercise !== undefined) {
                exerciseObj.exercise = day.exercises[k].exercise;
              }

              exerciseObj.variations = day.exercises[k].variations;
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

              // push exercise object to appropriate array in session object, or set rest day to true.  if no lift type provided (nothing at all selected) default to rest = true.
              switch (day.exercises[k].liftType) {
                case 'main':
                  session.main.push(exerciseObj);
                  session.rest = false;
                  break;
                case 'accessories':
                  session.accessories.push(exerciseObj);
                  session.rest = false;
                  break;
                case 'rest':
                  session.rest = true;
                  break;
              }
            }

            // populate microcycle state with one session (day)
            this.$store.dispatch('updateMicrocycle', session);
          }

          // push one microcycle (week) to program state before reset
          this.$store.dispatch('updateProgram', metadata);
        } // end of iterating through each week
      }

      return api.patch('/training/programs/' + this._id, this.$store.state.programs.program)
        .then((response) => {
          if (response.status === 200) {
            return response.data;
          }
        })
        .catch((error) => {
          console.log('API error updating program: ', error);
        });
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
button {
  cursor: pointer;
}
span {
  margin: 0px 10px;
}
.form-control {
  width: inherit;
  margin-right: 30px;
}
.custom-control {
  margin: 0px 40px;
}
.btn-action {
  margin-left: auto;
}
</style>
