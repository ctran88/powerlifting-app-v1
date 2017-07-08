import api from '@/../utils/api';
import Router from 'vue-router';

export default {
    methods: {

        /**
         * Retrieves client list from state
         */
        getClients() {

            var clients = this.$store.state.user._clients;

            for (var i = 0; i < clients.length; i++) {
                var fullName = clients[i].lastName + ', ' + clients[i].firstName;

                this.clientList.push({
                    text: fullName,
                    value: clients[i].email
                });
            }

            this.clientList.sort();

        },

        /**
         * Uses the program id in state to make an api call to retrieve program, then calls formatting functions
         */
        getProgram() {

            var query = '?_id=' + this.$store.state.programs.program._id;

            api.get('training/programs' + query)
                .then((response) => {

                    this.$store.dispatch('setProgram', response.data.programs[0]);
                    this.formatMicrocycles();

                })
                .catch((error) => {

                    console.log('Program not found.');

                });

        },

        /**
         * Formats exercise name, variation, and scheme for display.
         *
         * @param      {Object}  value   The value
         * @return     {Object}  Object with formatted exercise information
         */
        formatExercise(value) {

            var scheme = value.sets + 'x' + value.reps;
            var load = '';

            if (value.weight !== 0) {
                load = value.weight;
            } else if (value.rpe !== 0) {
                load = value.rpe + 'rpe';
            } else if (value.percent !== 0) {
                load = value.percent + '%/' + value.percentOf;
            }

            if (value.variations === undefined) {
                value.variations = '';
            }

            return {
                variations: value.variations + ' ',
                name: value.exercise,
                scheme: scheme + ' @ ' + load
            };

        },

        /**
         * Pushes a week object to array to add a week element
         */
        handleAddWeek() {

            this.weeks.push(++this.week);

        },

        /**
         * Duplicates a week object in array
         *
         * @param      {number}  index   The index of the week element
         */
        handleDuplicateWeek(index) {

            this.handleAddWeek();

            // timeout so Vue has time to render new week
            setTimeout(() => {

                var array = this.$children;
                var weekLabel = (index + 1).toString();
                var newWeekIndex = array.length -1;

                for (var i = 0; i < array.length; i++) {
                    if (array[i].tabs && array[i].tabs[0].title.indexOf(weekLabel) !== -1) {
                        for (var j = 1; j < array[i].tabs.length; j++) {
                            var exerciseArray = array[i].tabs[j].$children[0].exercises;

                            array[newWeekIndex].tabs[j].$children[0].accessories = array[i].tabs[j].$children[0].accessories;
                            array[newWeekIndex].tabs[j].$children[0].mainLifts = array[i].tabs[j].$children[0].mainLifts;
                            array[newWeekIndex].tabs[j].$children[0].mainVariations = array[i].tabs[j].$children[0].mainVariations;
                            array[newWeekIndex].tabs[j].$children[0].exercises = JSON.parse(JSON.stringify(exerciseArray));
                        }
                    }
                    
                }

            }, 100);

        },

        /**
         * Deletes a week object from array to remove a week element
         *
         * @param      {number}  index   The index of the week element
         */
        handleDeleteWeek(index) {

            this.weeks.splice(index, 1);

        },

        /**
         * Handles save draft modal and returns to programs page
         */
        handleGoBack() {

            var router = new Router();

            this.handleClose('save-draft-modal');
            router.push('/programs');

        },

        /**
         * Handles publish modal and returns to programs page
         */
        handlePublishedOk() {

            var router = new Router();

            this.handleClose('published-modal');
            router.push('/programs');

        },

        /**
         * Saves program as draft then sets message details for modal
         */
        handleSaveDraft() {

            this.saveProgram('draft')
                .then((result) => {

                    this.message.title = 'Draft saved';
                    this.message.details = result;

                })
                .catch((error) => {

                    this.message.title = 'Error';
                    this.message.details = error;

                });

            this.handleOpen('save-draft-modal');

        },

        /**
         * Saves program as published then sets message details for modal
         */
        handlePublish() {

            var router = new Router();
          
            this.saveProgram('published')
                .then((result) => {

                    this.message.title = 'Program published';
                    this.message.details = 'Program published successfully!';

                })
                .catch((error) => {

                    this.message.title = 'Error';
                    this.message.details = error;

                });

            this.handleOpen('published-modal');

        },

    }
};
