<template>
  <v-card>
    <v-card-title>
      <v-btn
        primary
        dark
        to="create-program"
      >Create a program</v-btn>
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        label="Search"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
    <v-data-table
      no-data-text="No programs yet. Create one to get started!"
      no-results-text="No results."
      :headers="headers"
      :items="items"
      :search="search"
    >
      <template slot="items" scope="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.client }}</td>
        <td>{{ props.item.active }}</td>
        <td>{{ props.item.status }}</td>
        <td>{{ props.item.created }}</td>
        <td>{{ props.item.lastUpdated }}</td>
        <td>
          <v-dialog
            v-model="detailsDialog"
          >
            <v-btn
              flat
              slot="activator"
            >Details</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">Program details</span>
              </v-card-title>
              <v-card-text>
                Details for {{ props.item.name }}
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  flat
                  @click.native="handleCopy"
                >Copy</v-btn>
                <v-btn
                  flat
                  @click.native="handlePreview"
                >Preview</v-btn>
                <v-btn
                  primary
                  flat
                  @click.native="handleUpdate"
                >Update</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog
            v-model="deleteDialog"
          >
            <v-btn
              error
              flat
              slot="activator"
            >Delete</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">Confirm delete</span>
              </v-card-title>
              <v-card-text>
                Are you sure you want to delete {{ props.item.name }}?
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  flat
                  @click.native="deleteDialog = false"
                >Cancel</v-btn>
                <v-btn
                  error
                  flat
                  @click.native="handleDelete"
                >Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </td>
      </template>
      <template slot="pageText" scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>

    <v-snackbar
      :timeout="3000"
      top
      multi-line
      vertical
      v-model="snackbar"
    >
      {{ snackbarText }}
      <v-btn
        flat
        @click.native="snackbar = false"
      >Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
  import { firebasedb } from '@/../utils/firebase';
  import api from '@/../utils/api';

  export default {
    name: 'coach-programs',
    data: function() {
      return {
        snackbar: false,
        detailsDialog: false,
        deleteDialog: false,
        search: '',
        pagination: {},
        headers: [
          {
            text: 'Program name',
            align: 'left',
            value: 'name'
          },
          {
            text: 'Client',
            align: 'left',
            value: 'client'
          },
          {
            text: 'Active',
            align: 'left',
            value: 'active'
          },
          {
            text: 'Status',
            align: 'left',
            value: 'status'
          },
          {
            text: 'Created',
            align: 'left',
            value: 'created'
          },
          {
            text: 'Last updated',
            align: 'left',
            value: 'lastUpdated'
          },
          {
            text: 'Actions',
            align: 'left',
            value: 'actions'
          }
        ],
        items: [
          {
            name: 'Program v1',
            client: 'Client One',
            active: 'Yes',
            status: 'Published',
            created: '2017-06-10T09:30:15.561Z',
            lastUpdated: '2017-07-08T12:40:55.969Z'
          },
          {
            name: 'Program v2',
            client: 'Client One',
            active: 'No',
            status: 'Published',
            created: '2016-06-10T09:30:15.561Z',
            lastUpdated: '2016-07-08T12:40:55.969Z'
          }
        ],
        details: {
          metadata: {}
        }
      };
    },
    firebase: {
      programs: {
        source: firebasedb.ref('/programs'),
        cancelCallback: function(error) {
          console.error('firebasedb error: ', error);
        }
      }
    },
    mounted: function() {
      // this function is called before the setUserInfo acton can be completed (from App.vue), so user object is not set yet.  Set timetout as a workaround.
      setTimeout(this.updatePrograms, 100);
    },
    methods: {
      /**
       * Retrieves programs based on coach email
       */
      updatePrograms: function() {
        this.programs = [];
        var query = '?metadata.coach=' + this.$store.state.user.email;

        api.get('/training/programs' + query)
          .then((response) => {
            if (response.status === 200) {
              response.data.programs.forEach((current) => {
                this.programs.push(current);
              });
            }
          })
          .catch((error) => {
            console.log('API error retrieving programs: ', error);
          });
      },

      /**
       * Deletes a program
       */
      handleDelete: function() {
        var id = this.details._id;

        api.delete('/training/programs/' + id)
          .then((response) => {
            if (response.status === 200) {
              this.updatePrograms();
            }
          })
          .catch((error) => {
            console.log('API error retrieving programs: ', error);
          });

        this.deleteDialog = false;
      },

      /**
       * Handles program preview and routes to view-program page
       */
      handlePreview: function() {
        this.$store.dispatch('setProgramId', this.details._id);
        this.detailsDialog = false;
        this.$router.push({ name: 'View program' });
      },

      /**
       * Copies program
       */
      handleCopy: function() {
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
      handleUpdate: function() {
        this.$store.dispatch('setProgramId', this.details._id);
        this.detailsDialog = false;
        this.$router.push({ name: 'Update program' });
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
