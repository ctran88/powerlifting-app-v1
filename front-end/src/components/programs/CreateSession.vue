<template>
<div id="create-session">
  <div id="exercise-row" class="row" v-for="(exercise, mainIndex) in exercises" :key="mainIndex">
    <small class="text-muted">Lift type</small>
    <b-form-select id="list-lift-type" :options="liftType" @input="handleSelect('liftType', $event, mainIndex)" />
    <div v-show="exercises[mainIndex].liftType === 'accessories'">
      <small class="text-muted">Accessories</small>
      <b-form-select :options="accessories" @input="handleSelect('exercise', $event, mainIndex)" />
    </div>
    <div v-show="exercises[mainIndex].liftType === 'main'">
      <small class="text-muted">Exercise</small>
      <b-form-select :options="mainLifts" @input="handleSelect('exercise', $event, mainIndex)" />
      <small class="text-muted">Variations</small>
      <b-form-select :options="mainVariations" @input="handleSelect('variations', $event, mainIndex)" />
    </div>
    <div v-show="exercises[mainIndex].liftType === 'main' || exercises[mainIndex].liftType === 'accessories'">
      <small class="text-muted">Sets</small>
      <b-form-select :options="setReps" @input="handleSelect('sets', $event, mainIndex)" />
      <small class="text-muted">Reps</small>
      <b-form-select :options="setReps" @input="handleSelect('reps', $event, mainIndex)" />
      <small class="text-muted">Load type</small>
      <b-form-select :options="loadType" @input="handleSelect('loadType', $event, mainIndex)" />
      <small class="text-muted">Load</small>
      <input type="text" class="form-control" @input="handleSelect('load', $event, mainIndex)" />
    </div>

    <b-button class="ml-auto btn-exercise" variant="danger" @click="deleteExercise(mainIndex)">Delete</b-button>
  </div>

  <div class="row">
    <b-button class="btn-exercise" variant="primary" @click="addExercise">Add exercise</b-button>
  </div>
</div>
</template>

<script>
import api from '@/../utils/api';

export default {
  name: 'create-session',
  props: ['day', 'week'],
  data() {
    return {
      liftType: ['main', 'accessories', 'rest'],
      mainLifts: [],
      mainVariations: [],
      accessories: [],
      setReps: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
      loadType: ['rpe', '%/1rm', '%/ts', 'weight'],
      exercises: []
    };
  },
  methods: {
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
    handleSelect(list, item, index) {
      switch (list) {
        case 'liftType':
          this.exercises[index].liftType = item;
          this.exercises[index].exercise = undefined;
          this.exercises[index].variations = undefined;
          this.exercises[index].sets = undefined;
          this.exercises[index].reps = undefined;
          this.exercises[index].loadType = undefined;
          this.exercises[index].load = '';

          // index 0 is the 'Add Exercise' button, indices 1-8 make up each exercise row
          // there are 8 elements in each 'exercise' row, last element is the 'Delete' button
          // setting these values loops through only the specific exercise row, add 1 to each to account for single 'Add exercise' button at index 0
          var indexStart = (index * 8) + 1;
          var childrenLength = ((index + 1) * 8) + 1;

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
          this.exercises[index].exercise = item;

          if (this.exercises[index].liftType === 'main') {
            this.getLibrary('variations');
          }
          break;
        case 'variations':
          this.exercises[index].variations = item;
          break;
        case 'sets':
          this.exercises[index].sets = Number(item);
          break;
        case 'reps':
          this.exercises[index].reps = Number(item);
          break;
        case 'loadType':
          this.exercises[index].loadType = item;
          break;
        case 'load':
          this.exercises[index].load = Number(item);
          break;
      }
    },
    addExercise() {    
      this.exercises.push({
        liftType: undefined,
        exercise: undefined,
        variations: undefined,
        sets: undefined,
        reps: undefined,
        loadType: undefined,
        load: undefined
      });
    },
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
#exercise-row {
  margin-bottom: 15px;
}
.btn-exercise {
  cursor: pointer;
}
.btn-exercise.btn-danger {
  height: 40px;
}
.form-control {
  width: inherit;
  display: inline;
}
</style>
