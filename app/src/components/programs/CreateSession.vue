<template>
  <v-layout row wrap>
    <v-layout
      row
      wrap
      v-for="(exercise, mainIndex) in exercises" :key="mainIndex"
    >
      <v-select
        autocomplete
        class="mr-3 mb-0"
        label="Lift type"
        :items="liftType"
        v-model="exercises[mainIndex].liftType"
        @change="handleSelect(mainIndex)"
      ></v-select>
      <v-select
        autocomplete
        class="mr-3 mb-0"
        label="Accessories"
        :items="accessories"
        v-model="exercises[mainIndex].accessories"
        v-show="exercises[mainIndex].liftType === 'accessories'"
      ></v-select>
      <v-select
        autocomplete
        class="mr-3 mb-0"
        label="Exercise"
        :items="main"
        v-model="exercises[mainIndex].main"
        v-show="exercises[mainIndex].liftType === 'main'"
      ></v-select>
      <v-select
        autocomplete
        multiple
        class="mr-3 mb-0"
        label="Variations"
        :items="variations"
        v-model="exercises[mainIndex].variations"
        v-show="exercises[mainIndex].liftType === 'main'"
      ></v-select>
      <v-select
        autocomplete
        class="mr-3 mb-0"
        label="Sets"
        :items="setsReps"
        v-model="exercises[mainIndex].sets"
        v-show="exercises[mainIndex].liftType === 'main' ||
                exercises[mainIndex].liftType === 'accessories'"
      ></v-select>
      <v-select
        autocomplete
        class="mr-3 mb-0"
        label="Reps"
        :items="setsReps"
        v-model="exercises[mainIndex].reps"
        v-show="exercises[mainIndex].liftType === 'main' ||
                exercises[mainIndex].liftType === 'accessories'"
      ></v-select>
      <v-select
        autocomplete
        class="mr-3 mb-0"
        label="Load type"
        :items="loadType"
        v-model="exercises[mainIndex].loadType"
        v-show="exercises[mainIndex].liftType === 'main' ||
                exercises[mainIndex].liftType === 'accessories'"
      ></v-select>
      <v-text-field
        class="mb-0"
        label="Load"
        v-model="exercises[mainIndex].load"
        v-show="exercises[mainIndex].liftType === 'main' ||
                exercises[mainIndex].liftType === 'accessories'"
      ></v-text-field>
      <v-spacer></v-spacer>
      <v-btn
        flat
        @click.native="duplicateExercise(mainIndex)"
      >Duplicate</v-btn>
      <v-btn
        flat
        error
        @click.native="deleteExercise(mainIndex)"
      >Delete</v-btn>
    </v-layout>
    <v-layout row>
      <v-flex>
        <v-btn
          flat
          primary
          @click.native="addExercise"
        >Add exercise</v-btn>
      </v-flex>
    </v-layout>
  </v-layout>
</template>

<script>
  import { firebasedb } from '@/../utils/firebase';

  export default {
    name: 'create-session',
    data: function() {
      return {
        liftType: [],
        main: [],
        variations: [],
        accessories: [],
        setsReps: [],
        loadType: [],
        exercises: []
      };
    },
    firebase: {
      library: {
        source: firebasedb.ref('/library'),
        cancelCallback(error) {
          console.error('firebasedb error: ', error);
        }
      }
    },
    mounted: function() {
      // populate default libraries
      this.getLibraries();
    },
    methods: {
      /**
       * Retrieves default libraries from firebase.
       */
      getLibraries: function() {
        this.$firebaseRefs.library.once('value')
          .then((snapshot) => {
            var data = JSON.parse(JSON.stringify(snapshot.val()));

            this.liftType = data.liftType;
            this.main = data.main;
            this.variations = data.variations;
            this.accessories = data.accessories;
            this.setsReps = data.setsReps;
            this.loadType = data.loadType;
          });
      },

      /**
       * Resets selection fields and data values when lift type is changed.
       *
       * @param      {number}  index   The index
       */
      handleSelect: function(index) {
        this.exercises[index].accessories = undefined;
        this.exercises[index].main = undefined;
        this.exercises[index].variations = undefined;
        this.exercises[index].sets = undefined;
        this.exercises[index].reps = undefined;
        this.exercises[index].loadType = undefined;
        this.exercises[index].load = undefined;
      },

      /**
       * Adds exercise object to array
       */
      addExercise: function() {
        this.exercises.push({
          liftType: undefined,
          accessories: undefined,
          main: undefined,
          variations: undefined,
          sets: undefined,
          reps: undefined,
          loadType: undefined,
          load: undefined
        });
      },

      /**
       * Duplicate exercise object in array
       *
       * @param      {number}  index   The index of the exercise object
       */
      duplicateExercise: function(index) {
        var duplicate = JSON.parse(JSON.stringify(this.exercises[index]));

        this.exercises.push(duplicate);
      },

      /**
       * Deletes exercise object from array
       *
       * @param      {number}  index   The index of the exercise object
       */
      deleteExercise: function(index) {
        this.exercises.splice(index, 1);
      }
    }
  };
</script>

<style scoped>

</style>
