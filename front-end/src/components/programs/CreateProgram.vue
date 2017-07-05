<template>
<div id='create-program'>
  <div class='row'>
    <span class='text-muted'>Program name</span>
    <b-form-input id='program-name' v-model='name' type='text' />

    <span class='text-muted'>Client</span>
    <b-form-select id='client-selection' :options='clientList' v-model='client' />

    <b-form-checkbox id='program-active' v-model='active' value=true unchecked-value=false>Make this the active program?</b-form-checkbox>

    <b-button-group class='ml-auto'>
      <b-button class='btn-cancel' variant='warning' v-b-modal='"cancellation-modal"'>Cancel</b-button>
      <b-button class='btn-save-draft' variant='success' @click='handleSaveDraft'>Save draft</b-button>
      <b-button class='btn-save-published' variant='primary' @click='handlePublish'>Publish</b-button>
    </b-button-group>
  </div>

  <b-modal id='cancellation-modal' size='sm' title='Cancellation confirmation'>
    Are you sure you want to cancel and leave this page?
    <footer slot='modal-footer'>
      <b-btn variant='secondary' @click='handleClose('cancellation-modal')'>No</b-btn>
      <b-btn variant='warning' @click='handleCancel'>Yes, cancel</b-btn>
    </footer>
  </b-modal>
  <b-modal id='save-draft-modal' :title='message.title'>
    {{ message.details }}
    <footer slot='modal-footer'>
      <b-btn variant='secondary' @click='handleGoBack'>Go back</b-btn>
      <b-btn variant='success' @click='handleClose('save-draft-modal')'>Continue editing</b-btn>
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
      <b-button class='ml-auto btn-week' variant='danger' @click='handleDeleteWeek(index)'>Delete</b-button>
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
  name: 'create-program',
  mixins: [
    general,
    programs
  ],
  components: {
    CreateSession
  },
  data() {

    return {
      name: '',
      client: ' ',
      new: true,
      id: '',
      created: '',
      clientList: [' '],
      active: 'false',
      weeks: [1],
      week: 1,
      message: {
        title: '',
        details: ''
      }
    };

  },
  mounted() {

    // this function is called before the setUserInfo acton can be completed (from App.vue), so user object is not set yet.  Set timetout as a workaround.
    setTimeout(this.getClients(), 100);

  },
  methods: {

    /**
     * Handles cancellation modal and returns to programs page
     */
    handleCancel() {

      var router = new Router();

      this.handleClose('cancellation-modal');
      router.push('/programs');

    },

    /**
     * Saves a program.
     *
     * @param      {string}  saveStatus  The save status
     * @return     {Promise}  Promise of save response
     */
    saveProgram(saveStatus) {

      if (this.name === '') {
        return Promise.reject('Program name required.');
      }

      // overwrite entire program with every save
      this.$store.dispatch('resetProgram');

      // sets the created time only once
      if (this.new) {
        this.created = new Date().toISOString();
      }

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

      // if first save, use POST API, else use PATCH API
      if (this.new) {
        return api.post('/training/programs', this.$store.state.programs.program)
          .then((response) => {

            if (response.status === 201) {
              this.new = false;
              this.id = response.data.id;
              return response.data.message;
            }

          })
          .catch((error) => {

            console.log('API error saving program: ', error);

          });
      } else {
        return api.patch('/training/programs/' + this.id, this.$store.state.programs.program)
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
</style>
