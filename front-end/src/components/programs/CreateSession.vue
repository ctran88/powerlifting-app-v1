<template>
<div id='create-session'>
  <div id='exercise-row' class='row' v-for='(exercise, mainIndex) in exercises' :key='mainIndex'>
    <!-- lift type -->
    <div class='list-selector' >
      <small class='text-muted'>Lift type</small>
      <br />
      <b-form-select id='list-lift-type' :options='liftType' v-model='exercises[mainIndex].liftType' @input='handleSelect("liftType", $event, mainIndex)' />
    </div>
    <!-- accessories -->
    <div class='list-selector' v-show='exercises[mainIndex].liftType === "accessories"'>
      <small class='text-muted'>Accessories</small>
      <br />
      <b-form-select id='list-accessories' :options='accessories' v-model='exercises[mainIndex].accessories' />
    </div>
    <!-- exercise -->
    <div class='list-selector' v-show='exercises[mainIndex].liftType === "main"'>
      <small class='text-muted'>Exercise</small>
      <br />
      <b-form-select id='list-main' :options='mainLifts' v-model='exercises[mainIndex].exercise' @input='handleSelect("exercise", $event, mainIndex)' />
    </div>
    <!-- variations -->
    <div class='list-selector' v-show='exercises[mainIndex].liftType === "main"'>
      <small class='text-muted'>Variations</small>
      <br />
      <b-form-select id='list-variations' :options='mainVariations' v-model='exercises[mainIndex].variations' />
    </div>
    <!-- sets -->
    <div class='list-selector' v-show='exercises[mainIndex].liftType === "main" || exercises[mainIndex].liftType === "accessories"'>
      <small class='text-muted'>Sets</small>
      <br />
      <b-form-select id='list-sets' :options='setReps' v-model='exercises[mainIndex].sets' />
    </div>
    <!-- reps -->
    <div class='list-selector' v-show='exercises[mainIndex].liftType === "main" || exercises[mainIndex].liftType === "accessories"'>
      <small class='text-muted'>Reps</small>
      <br />
      <b-form-select id='list-reps' :options='setReps' v-model='exercises[mainIndex].reps' />
    </div>
    <!-- load type -->
    <div class='list-selector' v-show='exercises[mainIndex].liftType === "main" || exercises[mainIndex].liftType === "accessories"'>
      <small class='text-muted'>Load type</small>
      <br />
      <b-form-select id='list-load-type' :options='loadType' v-model='exercises[mainIndex].loadType' />
    </div>
    <!-- load -->
    <div class='list-selector' v-show='exercises[mainIndex].liftType === "main" || exercises[mainIndex].liftType === "accessories"'>
      <small class='text-muted'>Load</small>
      <br />
      <b-form-input id='input-load' type='text' v-model='exercises[mainIndex].load' />
    </div>
    <!-- action buttons -->
    <div class='btn-action'>
      <b-button id='btn-duplicate-exercise' class='btn-exercise' @click='duplicateExercise(mainIndex)'>Duplicate</b-button>
      <b-button id='btn-delete-exercise' class='btn-exercise' variant='danger' @click='deleteExercise(mainIndex)'>Delete</b-button>
    </div>
  </div>
  
  <!-- add exercise button -->
  <div class='row'>
    <b-button class='btn-exercise' variant='primary' @click='addExercise'>Add exercise</b-button>
  </div>
</div>
</template>

<script>
import api from '@/../utils/api';

export default {
  name: 'create-session',
  props: [  // used as session properties for parent component to save
    'day',
    'week'
  ],
  data() {

    return {
      liftType: [
        'main',
        'accessories',
        'rest'
      ],
      mainLifts: [],
      mainVariations: [],
      accessories: [],
      setReps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      loadType: [
        'rpe',
        '%/1rm',
        '%/ts',
        'weight'
      ],
      exercises: []
    };

  },
  mounted() {

    // Retrieves libraries first if parent component is update-program
    if (this.$root.$children[0].$children[1].$children[0].$el.id === 'update-program') {
      this.getLibrary('main');
      this.getLibrary('accessories');
      this.getLibrary('variations');
    }

  },
  methods: {

    /**
     * Makes api call to retrieve specified library
     *
     * @param      {string}  library  The library
     */
    getLibrary(library) {

      api.get('/training/library/' + library)
        .then((response) => {

          if (response.status === 200) {
            switch (library) {
              case 'main':
                this.mainLifts = [];
                this.mainLifts = response.data.library.list;
                break;
              case 'variations':
                this.mainVariations = [];
                this.mainVariations = response.data.library.list;
                break;
              case 'accessories':
                this.accessories = [];
                this.accessories = response.data.library.list;
                break;
            }
          } else {
            alert(response.data);
          }

        })
        .catch((error) => {

          console.log('API error retrieving library: ', error);

        });

    },

    /**
     * Sets/resets list selections
     *
     * @param      {string}  list    The list
     * @param      {string}  item    The item
     * @param      {number}  index   The index
     */
    handleSelect(list, item, index) {

      switch (list) {
        case 'liftType':
          this.exercises[index].accessories = undefined;
          this.exercises[index].exercise = undefined;
          this.exercises[index].variations = undefined;
          this.exercises[index].sets = undefined;
          this.exercises[index].reps = undefined;
          this.exercises[index].loadType = undefined;
          this.exercises[index].load = '';

          // there are 10 elements in each 'exercise' row, first element [0] is the 'Add Exercise' button, last two elements [8] and [9] are an input field (no selection) and the 'Delete' button
          // indexStart: add 1 to account for index[0]
          // childrenLength: add 7 to indexStart to account for indices[8] and [9]
          var indexStart = (index * 9) + 1;
          var childrenLength = indexStart + 7;

          // set dropdown default selection to undefined
          for (var i = indexStart; i < childrenLength; i++) {
            if (this.$children[i].id !== 'list-lift-type') {
              this.$children[i].selectedValue = undefined;
              this.$children[i].localValue = undefined;
            }
          }
          
          if (item !== 'rest') {
            this.getLibrary(item);
          }
          break;
        case 'exercise':
          this.getLibrary('variations');
          break;
      }

    },

    /**
     * Adds exercise object to array
     */
    addExercise() {

      this.exercises.push({
        liftType: undefined,
        accessories: undefined,
        exercise: undefined,
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
    duplicateExercise(index) {

      var duplicate = JSON.parse(JSON.stringify(this.exercises[index]));

      this.exercises.push(duplicate);

    },

    /**
     * Deletes exercise object from array
     *
     * @param      {number}  index   The index of the exercise object
     */
    deleteExercise(index) {

      this.exercises.splice(index, 1);

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
#exercise-row {
  margin-bottom: 15px;
}
.list-selector {
  margin: 0px 5px;
}
#input-load {
  width: 70px;
  display: inline;
}
.btn-action {
  margin-left: auto;
  margin-top: auto;
}
</style>
