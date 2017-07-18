<template>
  <div id="update-program">
    <v-layout row>
      <v-flex xs3>
        <v-text-field
          label="Program name"
          v-model="name"
        ></v-text-field>
      </v-flex>
      <v-flex xs3>
        <v-select
          label="Client"
          :items="items"
          v-model="client"
        ></v-select>
      </v-flex>
      <v-flex>
        <v-checkbox
          :label="'Make this the active program?'"
          v-model="programActive"
        ></v-checkbox>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex>
        <v-tabs
          dark
          id="workout-week"
          v-for="(week, index) in weeks"
          :key="index"
          v-model="activeTab[index]"
        >
          <v-tabs-bar class="white--text" slot="activators">
            <v-subheader>Week {{ index + 1 }}</v-subheader>
            <v-tabs-item
              v-for="day in days"
              :key="day"
              :href="'#' + day"
              ripple
            >Day {{ day.slice(-1) }}</v-tabs-item>
            <v-spacer></v-spacer>
            <v-btn
              @click.native="handleDuplicateWeek(index)"
            >Duplicate</v-btn>
            <v-btn
              error
              dark
              @click.native="handleDeleteWeek(index)"
            >Delete</v-btn>
            <v-tabs-slider class="yellow"></v-tabs-slider>
          </v-tabs-bar>
          <v-tabs-content
            v-for="day in days"
            :key="day"
            :id="day"
          >
            <v-card flat>
              <v-card-text>
                <create-session></create-session>
              </v-card-text>
            </v-card>
          </v-tabs-content>
        </v-tabs>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex xs8>
        <v-btn
          primary
          flat
          @click.native="handleAddWeek"
        >Add week</v-btn>
      </v-flex>
      <v-spacer></v-spacer>
      <v-flex>
        <v-dialog v-model="cancelDialog">
          <v-btn
            warning
            dark
            slot="activator"
          >Cancel</v-btn>
          <v-card>
            <v-card-title>
              <span class="headline">Confirm cancellation</span>
            </v-card-title>
            <v-card-text>
              Are you sure you want to cancel and leave this page? All unsaved progress will be lost.
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                flat
                @click.native="cancelDialog = false"
              >No</v-btn>
              <v-btn
                warning
                flat
                to="programs"
              >Yes, cancel</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-flex>
      <v-flex>
        <v-btn
          success
          dark
          @click.native="handleSaveDraft"
        >Save draft</v-btn>
      </v-flex>
      <v-flex>
        <v-btn
          primary
          dark
          @click.native.stop="handlePublish"
        >Publish</v-btn>
      </v-flex>
    </v-layout>

    <v-snackbar
      :timeout="3000"
      top
      multi-line
      vertical
      :error="snackbarStatus === 'error'"
      v-model="snackbar"
    >
      {{ snackbarText }}
      <v-btn
        flat
        dark
        @click.native="snackbar = false"
      >Close</v-btn>
    </v-snackbar>

    <v-dialog v-model="publishDialog">
      <v-card>
        <v-card-title>
          <span class="headline">Publish program</span>
        </v-card-title>
        <v-card-text>
          {{ publishMessage }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            to="programs"
          >Ok</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
  import { firebaseApp, firebasedb } from '@/../utils/firebase';
  import CreateSession from './CreateSession';

  export default {
    name: 'update-program',
    components: {
      CreateSession
    },
    data: function() {
      return {
        id: this.$store.state.programs.id,
        name: '',
        items: [],
        client: '',
        programActive: false,
        cancelDialog: false,
        publishDialog: false,
        publishMessage: '',
        weeks: [],
        week: 0,
        activeTab: {},
        days: [
          'day-1',
          'day-2',
          'day-3',
          'day-4',
          'day-5',
          'day-6',
          'day-7'
        ],
        created: '',
        snackbar: false,
        snackbarStatus: '',
        snackbarText: ''
      };
    },
    firebase: {
      users: {
        source: firebasedb.ref('/users'),
        cancelCallback(error) {
          console.error('firebasedb error: ', error);
        }
      },
      programs: {
        source: firebasedb.ref('/programs'),
        cancelCallback(error) {
          console.error('firebasedb error: ', error);
        }
      }
    },
    mounted: function() {
      this.getClients();
      this.getProgram();
    },
    methods: {
      /**
       * Retrieves the coach's clients
       */
      getClients: function() {
        var user = firebaseApp.auth().currentUser;

        this.$firebaseRefs.users
          .orderByChild('coach')
          .equalTo(user.email)
          .once('value')
            .then((snapshot) => {
              var data = snapshot.val();
              var keys = Object.keys(data);

              for (var i = 0; i < keys.length; i++) {
                var client = data[keys[i]].firstName + ' ' + data[keys[i]].lastName;

                this.items.push(client);
              }
            });
      },

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

                this.setProgram(program);
              } else {
                console.log('No data found.');
              }
            });
      },

      /**
       * Populates the program data.
       *
       * @param      {Object}  program  The program
       */
      setProgram: function(program) {
        this.name = program.name;
        this.client = program.client;
        this.programActive = program.active;
        this.created = program.created;

        var keys = Object.keys(program);
        var weeksArray = [];

        // push new weeks for each week in program
        for (var i = 0; i < keys.length; i++) {
          if (keys[i].search('week') !== -1) {
            this.week++;
            this.weeks.push(this.week);
            weeksArray.push(program[keys[i]]);
          }
        }

        // timeout so vue can render the new workout week components in the tree
        setTimeout(() => {
          // iterate through vue components
          for (i = 0; i < this.$children.length; i++) {
            // check if vue element is a workout week
            if (this.$children[i].$el.id === 'workout-week') {
              var weekLabel = this.$children[i].$children[0].$slots.default[0].children[0].text;
              var week = this.$children[i].$children[1].$children;

              // iterate through each program week
              for (var j = 0; j < weeksArray.length; j++) {
                // make sure weeks match
                if (weekLabel.slice(-1) === (j + 1).toString()) {
                  var programWeek = weeksArray[j];
                  var weekKeys = Object.keys(programWeek);

                  // iterate through days of the week
                  for (var k = 0; k < week.length; k++) {
                    // iterate through the program days
                    for (var l = 0; l < weekKeys.length; l++) {
                      // match vue week day to program week day
                      if (week[k].id.slice(-1) === weekKeys[l].slice(-1)) {
                        week[k].$children[0].exercises = programWeek[weekKeys[l]];
                      }
                    }
                  }
                }
              }
            }
          }
        }, 100);
      },

      /**
       * Pushes a week object to array to add a week element
       */
      handleAddWeek: function() {
        this.weeks.push(++this.week);
      },

      /**
       * Deletes a week object from array to remove a week element
       *
       * @param      {number}  index   The index of the week element
       */
      handleDeleteWeek: function(index) {
        this.weeks.splice(index, 1);
      },

      /**
       * Duplicates a week object in array
       *
       * @param      {number}  index   The index of the week element
       */
      handleDuplicateWeek: function(index) {
        this.handleAddWeek();

        setTimeout(() => {
          var newWeekIndex = this.$children.length - 1;

          // iterate through vue components
          for (var i = 0; i < this.$children.length; i++) {
            // check if element is a workout week
            if (this.$children[i].$el.id === 'workout-week') {
              var weekLabel = this.$children[i].$children[0].$slots.default[0].children[0].text;

              // check if week is the week to be copied
              if (weekLabel.slice(-1) === (index + 1).toString()) {
                var week = this.$children[i].$children[1].$children;
                var newWeek = this.$children[newWeekIndex].$children[1].$children;

                // iterate through original week and copy exercises object from each day to new week
                for (var j = 0; j < week.length; j++) {
                  newWeek[j].$children[0].exercises = JSON.parse(JSON.stringify(week[j].$children[0].exercises));
                }
              }
            }
          }
        }, 100);
      },

      /**
       * Handles saving program as a draft.
       */
      handleSaveDraft: function() {
        this.saveProgram('draft')
          .then((status) => {
            this.snackbarStatus = '';
            this.snackbarText = status;
          })
          .catch((error) => {
            this.snackbarStatus = 'error';
            this.snackbarText = error;
          });

        this.snackbar = true;
      },

      /**
       * Handles saving and publishing program.
       */
      handlePublish: function() {
        this.saveProgram('published')
          .then((status) => {
            this.publishMessage = status;
          })
          .catch((error) => {
            this.publishMessage = error;
          });

        this.publishDialog = true;
      },

      /**
       * Saves a program.
       *
       * @param      {string}   status  The status
       * @return     {Promise}  Resolves success message, rejects error message
       */
      saveProgram: function(status) {
        if (this.name === '') {
          return Promise.reject('Program name required.');
        }

        var program = {
          name: this.name,
          coach: this.$store.state.user.email,
          client: this.client,
          status: status,
          active: this.programActive,
          created: this.created,
          lastUpdated: new Date().toISOString()
        };
        var weekCounter = 1;

        // find the children that have the workout-week id
        for (var i = 0; i < this.$children.length; i++) {
          if (this.$children[i].$el.id === 'workout-week') {
            var week = this.$children[i].$children[1].$children;
            // initialize week object
            program['week' + weekCounter] = {};
  
            // iterate through the days of the week
            for (var j = 0; j < week.length; j++) {
              var dayExercises = JSON.parse(JSON.stringify(week[j].$children[0].exercises));

              // iterate through exercises in a day
              for (var k = 0; k < dayExercises.length; k++) {
                var keys = Object.keys(dayExercises[k]);

                // iterate throug properties of each exercise
                for (var l = 0; l < keys.length; l++) {
                  // change undefined values to empty strings (firebase necessity)
                  if (dayExercises[k][keys[l]] === undefined) {
                    dayExercises[k][keys[l]] = '';
                  }
                }
              }

              program['week' + weekCounter]['day' + (j + 1)] = dayExercises;
            }

            weekCounter++;
          }
        }

        // updates existing program by fully replacing it
        return this.$firebaseRefs.programs.child(this.id).set(program)
          .then(() => {
            var message = '';

            if (status === 'draft') {
              message = 'Program saved succesfully.';
            } else if (status === 'published') {
              message = 'Program published succesfully.';
            }

            return Promise.resolve(message);
          })
          .catch((error) => {
            return Promise.reject(error);
          });
      }
    }
  };
</script>

<style scoped>

</style>
