<template>
<div id='client-programs'>
  <div class='row'>

    <b-form-fieldset horizontal label='Filter' class='col-3 ml-auto' :label-size='2'>
      <b-form-input v-model='filter' placeholder='Type to search' />
    </b-form-fieldset>
  </div>

  <!-- Main table element -->
  <b-table striped hover :items='programs' :fields='fields' :filter='filter'>
    <template slot='name' scope='item'>
      {{ item.item.metadata.name }}
    </template>
    <template slot='coach' scope='item'>
      {{ item.item.metadata.coach }}
    </template>
    <template slot='active' scope='item'>
      {{ item.item.metadata.active }}
    </template>
    <template slot='created' scope='item'>
      {{ item.item.metadata.created }}
    </template>
    <template slot='lastUpdated' scope='item'>
      {{ item.item.metadata.lastUpdated }}
    </template>
    <template slot='actions' scope='item'>
      <b-btn size='sm' v-b-modal='"program-preview-modal"' @click='handleDetails(item.item)'>Details</b-btn>
      <b-btn size='sm' variant='primary' @click='handleTrainingLog(item.item._id)'>Training Log</b-btn>
    </template>
  </b-table>

  <b-modal id='program-preview-modal' title='Program preview'>
    {{ details }}
    <footer slot='modal-footer'>
      <b-btn variant='success' @click='handlePreview'>Preview</b-btn>
    </footer>
  </b-modal>
</div>
</template>

<script>
import api from '@/../utils/api';
import Router from 'vue-router';
import general from '@/mixins/general';

export default {
  name: 'client-programs',
  mixins: [
    general
  ],
  data() {

    return {
      programs: [],
      details: {
        metadata: {}
      },
      filter: null,
      fields: {
        name: {
          label: 'Program Name',
          sortable: true
        },
        coach: {
          label: 'Coach',
          sortable: true
        },
        active: {
          label: 'Active',
          sortable: true
        },
        created: {
          label: 'Created',
          sortable: true
        },
        lastUpdated: {
          label: 'Last Updated',
          sortable: true
        },
        actions: {
          label: 'Actions'
        }
      }
    };

  },
  mounted() {

    // this function is called before the setUserInfo acton can be completed (from App.vue), so user object is not set yet.  Set timetout as a workaround.
    setTimeout(this.updatePrograms, 100);

  },
  methods: {

    /**
     * Retrieves programs based on client email
     */
    updatePrograms() {

      var query = '?metadata.client=' + this.$store.state.user.email;
      
      api.get('/training/programs' + query)
        .then((response) => {

          if (response.status === 200) {
            this.programs = [];

            response.data.programs.forEach((current) => {

              this.programs.push(current);

            });
          } else {
            alert(response.data);
          }

        })
        .catch((error) => {

          console.log('API error retrieving programs: ', error);

        });

    },

    /**
     * Handles program preview and routes to view-program page
     */
    handlePreview() {

      var router = new Router();

      this.$store.dispatch('setProgramId', this.details._id);
      this.handleClose('program-preview-modal');
      router.push('/view-program');

    },

    /**
     * Sets program id then routes to training-log page
     *
     * @param      {string}  programId  The program identifier
     */
    handleTrainingLog(programId) {

      var router = new Router();

      this.$store.dispatch('setProgramId', programId);
      router.push('/training-log');

    }

  }
};
</script>

<style scoped>
button {
  cursor: pointer;
}
#btn-create-program {
  margin-bottom: 1rem;
}
</style>
