<template>
<div id="create-session">

  <div class="row" v-for="(exercise, mainIndex) in exercises" :key="mainIndex">
    <!-- List of exercise type selectors -->
    <div class="list-container col-2">
      <b-list-group>
        <a class="list-group-item" :class="{ active: isSelected('liftType', 'main', mainIndex) }" @click="handleSelect('liftType', 'main', mainIndex)">Main lift</a>
        <a class="list-group-item" :class="{ active: isSelected('liftType', 'accessories', mainIndex) }" @click="handleSelect('liftType', 'accessories', mainIndex)">Accessory lift</a>
        <a class="list-group-item" :class="{ active: isSelected('liftType', 'rest', mainIndex) }" @click="handleSelect('liftType', 'rest', mainIndex)">Rest</a>
      </b-list-group>
    </div>

    <!-- List of main lift selectors -->
    <div class="triangle" v-show="exercises[mainIndex].liftType === 'main'"></div>
    <div class="list-container col-2" v-show="exercises[mainIndex].liftType === 'main'">
      <b-list-group v-for="(lift, index) in mainLifts" :key="index">
        <a class="list-group-item" :class="{ active: isSelected('exercise', lift, mainIndex) }" @click="handleSelect('exercise', $event, mainIndex)">{{ lift }}</a>
      </b-list-group>
    </div>

    <!-- List of main variation selectors -->
    <div class="triangle" v-show="exercises[mainIndex].liftType === 'main' && exercises[mainIndex].exercise !== ''"></div>
    <div class="list-container col-2" v-show="exercises[mainIndex].liftType === 'main' && exercises[mainIndex].exercise !== ''">
      <b-list-group v-for="(variation, index) in mainVariations" :key="index">
        <a class="list-group-item" :class="{ active: isSelected('variations', variation, mainIndex) }" @click="handleSelect('variations', $event, mainIndex)">{{ variation }}</a>
      </b-list-group>
    </div>

    <!-- List of accessory selectors -->
    <div class="triangle" v-show="exercises[mainIndex].liftType === 'accessories'"></div>
    <div class="list-container col-2" v-show="exercises[mainIndex].liftType === 'accessories'">
      <b-list-group v-for="(accessory, index) in accessories" :key="index">
        <a class="list-group-item" :class="{ active: isSelected('exercise', accessory, mainIndex) }" @click="handleSelect('exercise', $event, mainIndex)">{{ accessory }}</a>
      </b-list-group>
    </div>

    <!-- List of set selectors -->
    <div class="triangle" v-show="(exercises[mainIndex].liftType === 'accessories' && exercises[mainIndex].exercise !== '') || (exercises[mainIndex].liftType === 'main' && exercises[mainIndex].exercise !== '' && exercises[mainIndex].variation !== '')"></div>
    <div class="list-container col-1" v-show="(exercises[mainIndex].liftType === 'accessories' && exercises[mainIndex].exercise !== '') || (exercises[mainIndex].liftType === 'main' && exercises[mainIndex].exercise !== '' && exercises[mainIndex].variation !== '')">
      <b-list-group v-for="(n, index) in setReps" :key="index">
        <a class="list-group-item" :class="{ active: isSelected('sets', index + 1, mainIndex) }" @click="handleSelect('sets', $event, mainIndex)">{{ index + 1 }}</a>
      </b-list-group>
    </div>

    <!-- List of rep selectors -->
    <div class="triangle" v-show="(exercises[mainIndex].liftType === 'accessories' && exercises[mainIndex].exercise !== '' && exercises[mainIndex].sets !== -1) || (exercises[mainIndex].liftType === 'main' && exercises[mainIndex].exercise !== '' && exercises[mainIndex].variation !== '' && exercises[mainIndex].sets !== -1)"></div>
    <div class="list-container col-1" v-show="(exercises[mainIndex].liftType === 'accessories' && exercises[mainIndex].exercise !== '' && exercises[mainIndex].sets !== -1) || (exercises[mainIndex].liftType === 'main' && exercises[mainIndex].exercise !== '' && exercises[mainIndex].variation !== '' && exercises[mainIndex].sets !== -1)">
      <b-list-group v-for="(n, index) in setReps" :key="index">
        <a class="list-group-item" :class="{ active: isSelected('reps', index + 1, mainIndex) }" @click="handleSelect('reps', $event, mainIndex)">{{ index + 1 }}</a>
      </b-list-group>
    </div>

    <!-- List of load type selectors -->
    <div class="triangle" v-show="(exercises[mainIndex].liftType === 'accessories' && exercises[mainIndex].exercise !== '' && exercises[mainIndex].sets !== -1 && exercises[mainIndex].reps !== -1) || (exercises[mainIndex].liftType === 'main' && exercises[mainIndex].exercise !== '' && exercises[mainIndex].variation !== '' && exercises[mainIndex].sets !== -1 && exercises[mainIndex].reps !== -1)"></div>
    <div class="list-container col-1" v-show="(exercises[mainIndex].liftType === 'accessories' && exercises[mainIndex].exercise !== '' && exercises[mainIndex].sets !== -1 && exercises[mainIndex].reps !== -1) || (exercises[mainIndex].liftType === 'main' && exercises[mainIndex].exercise !== '' && exercises[mainIndex].variation !== '' && exercises[mainIndex].sets !== -1 && exercises[mainIndex].reps !== -1)">
      <b-list-group v-for="(load, index) in ['rpe', '%/1rm', '%/ts', 'weight']" :key="index">
        <a class="list-group-item" :class="{ active: isSelected('loadType', load, mainIndex) }" @click="handleSelect('loadType', $event, mainIndex)">{{ load }}</a>
      </b-list-group>
    </div>

    <!-- Load input -->
    <div class="triangle" v-show="(exercises[mainIndex].liftType === 'accessories' && exercises[mainIndex].exercise !== '' && exercises[mainIndex].sets !== -1 && exercises[mainIndex].reps !== -1 && exercises[mainIndex].loadType !== '') || (exercises[mainIndex].liftType === 'main' && exercises[mainIndex].exercise !== '' && exercises[mainIndex].variation !== '' && exercises[mainIndex].sets !== -1 && exercises[mainIndex].reps !== -1 && exercises[mainIndex].loadType !== '')"></div>
    <div class="list-container col-1" v-show="(exercises[mainIndex].liftType === 'accessories' && exercises[mainIndex].exercise !== '' && exercises[mainIndex].sets !== -1 && exercises[mainIndex].reps !== -1 && exercises[mainIndex].loadType !== '') || (exercises[mainIndex].liftType === 'main' && exercises[mainIndex].exercise !== '' && exercises[mainIndex].variation !== '' && exercises[mainIndex].sets !== -1 && exercises[mainIndex].reps !== -1 && exercises[mainIndex].loadType !== '')">
      <input type="text" class="list-group-item" v-model.number="exercises[mainIndex].load">
    </div>

    <b-button class="ml-auto btn-exercise" variant="danger" @click="deleteExercise(mainIndex)">Delete</b-button>
  </div>

  <div class="row">
    <b-button class="btn-exercise" variant="primary" @click="addExercise">Add exercise</b-button>
  </div>
  <div class="row">
    <b-button class="btn-save" variant="warning" @click="test">Test</b-button>
  </div>
</div>
</template>

<script>
import api from '@/../utils/api';
import Vue from 'vue';

export default {
  name: 'create-session',
  props: ['day', 'week'],
  data() {
    return {
      liftTypeSelected: '',
      mainSelected: '',
      variationSelected: '',
      accessorySelected: '',
      setsSelected: -1,
      repsSelected: -1,
      loadTypeSelected: '',
      loadSelected: '',
      mainLifts: [],
      mainVariations: [],
      accessories: [],
      setReps: new Array(20),
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
    isSelected(itemSelected, name, index) {
      switch (itemSelected) {
        case 'liftType':
          return this.exercises[index].liftType === name;
          break;
        case 'exercise':
          return this.exercises[index].exercise === name;
          break;
        case 'variations':
          return this.exercises[index].variation === name;
          break;
        case 'sets':
          return this.exercises[index].sets === name;
          break;
        case 'reps':
          return this.exercises[index].reps === name;
          break;
        case 'loadType':
          return this.exercises[index].loadType === name;
          break;
      }
    },
    handleSelect(itemSelected, event, index) {
      switch (itemSelected) {
        case 'liftType':
          this.exercises[index].liftType = event;
          this.exercises[index].exercise = '';
          this.exercises[index].variation = '';
          this.exercises[index].sets = -1;
          this.exercises[index].reps = -1;
          this.exercises[index].loadType = '';
          this.exercises[index].load = '';

          if (event !== 'rest') {
            this.getLibrary(event);
          }
          break;
        case 'exercise':
          this.exercises[index].exercise = event.target.text;

          if (this.exercises[index].liftType === 'main') {
            this.getLibrary('variations');
          }
          break;
        case 'variations':
          this.exercises[index].variation = event.target.text;
          break;
        case 'sets':
          this.exercises[index].sets = Number(event.target.text);
          break;
        case 'reps':
          this.exercises[index].reps = Number(event.target.text);
          break;
        case 'loadType':
          this.exercises[index].loadType = event.target.text;
          break;
      }
    },
    addExercise() {    
      this.exercises.push({
        liftType: '',
        exercise: '',
        variation: '',
        sets: -1,
        reps: -1,
        loadType: '',
        load: ''
      });
    },
    deleteExercise(index) {
      this.exercises.splice(index, 1);
    },
    test() {
      console.log('sessions: ', this.$store.getters.microcycle)
      this.$store.dispatch('updateProgram');
      console.log('program: ', this.$store.getters.program)
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
.list-container {
  overflow-y: scroll;
  height: 120px;
}
.triangle {
  width: 0;
  height: 0;
  margin: 5px -20px 0px -10px;
  border: solid 12px;
  border-color: transparent transparent transparent black;
}
.btn-exercise {
  cursor: pointer;
}
.btn-exercise.btn-danger {
  height: 40px;
}
.list-group-item {
  cursor: pointer;
  white-space: nowrap;
  height: 40px;
}
.list-group-item.active {
  color: #ffffff;
}
.list-group-item.active:hover {
  color: #ffffff;
  background-color: #0275d8;
}
.list-group-item:hover {
  background-color: #f5f5f5;
}
input.list-group-item {
  width: 100%;
}
</style>
