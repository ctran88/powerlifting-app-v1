<template>
<div id='programs'>
  <div class='row'>
    <b-btn id='btn-create-program' to='create-program' variant='success'>Create a program</b-btn>

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
    <template slot='client' scope='item'>
      {{ item.item.metadata.client }}
    </template>
    <template slot='active' scope='item'>
      {{ item.item.metadata.active }}
    </template>
    <template slot='status' scope='item'>
      {{ item.item.metadata.status }}
    </template>
    <template slot='created' scope='item'>
      {{ item.item.metadata.created }}
    </template>
    <template slot='lastUpdated' scope='item'>
      {{ item.item.metadata.lastUpdated }}
    </template>
    <template slot='actions' scope='item'>
      <b-btn size='sm' v-b-modal='"program-preview-modal"' @click='handleDetails(item.item)'>Details</b-btn>
      <b-btn size='sm' variant='danger' v-b-modal='"delete-confirmation-modal"' @click='handleDetails(item.item)'>Delete</b-btn>
    </template>
  </b-table>

  <b-modal id='program-preview-modal' title='Program preview'>
    {{ details }}
    <footer slot='modal-footer'>
      <b-btn variant='secondary' @click='handleCopy'>Copy</b-btn>
      <b-btn variant='success' @click='handlePreview'>Preview</b-btn>
      <b-btn variant='primary' @click='handleUpdate'>Update</b-btn>
    </footer>
  </b-modal>

  <b-modal id='delete-confirmation-modal' size='sm' title='Confirm delete'>
    Are you sure you want to delete {{ details.metadata.name }}?
    <footer slot='modal-footer'>
      <b-btn variant='secondary' @click='handleClose('delete-confirmation-modal')'>Cancel</b-btn>
      <b-btn variant='danger' @click='handleDelete'>Delete</b-btn>
    </footer>
  </b-modal>
</div>
</template>

<script>
import api from '@/../utils/api';
import Router from 'vue-router';
import general from '@/mixins/general';

export default {
  name: 'programs',
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
        client: {
          label: 'Client',
          sortable: true
        },
        active: {
          label: 'Active',
          sortable: true
        },
        status: {
          label: 'Status',
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
     * Retrieves programs based on coach email
     */
    updatePrograms() {

      var query = '?metadata.coach=' + this.$store.state.user.email;
      
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
     * Deletes a program
     */
    handleDelete() {

      var id = this.details._id

      api.delete('/training/programs/' + id)
        .then((response) => {

          if (response.status === 200) {
            this.updatePrograms();
          } else {
            alert(response.data);
          }

        })
        .catch((error) => {

          console.log('API error retrieving programs: ', error);

        });

      this.handleClose('delete-confirmation-modal');

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
     * Copies program
     */
    handleCopy() {

      var copy = {
        metadata: {},
        microcycles: []
      };

      copy.metadata = this.details.metadata;
      copy.metadata.name = this.details.metadata.name + '-copy';
      copy.metadata.status = 'draft';
      copy.metadata.created = new Date().toISOString();
      copy.metadata.lastUpdated = new Date().toISOString();
      copy.metadata.cycle = 1;
      copy.microcycles = this.details.microcycles;

      api.post('/training/programs', copy)
        .then((response) => {

          if (response.status === 201) {
            this.updatePrograms();
          } else {
            alert(response.data);
          }

        })
        .catch((error) => {

          console.log('API error retrieving programs: ', error);

        });

      this.handleClose('program-preview-modal');

    },

    /**
     * Handles update and routes to update-program
     */
    handleUpdate() {

      var router = new Router();

      this.$store.dispatch('setProgramId', this.details._id);
      this.handleClose('program-preview-modal');
      router.push('/update-program');

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
