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
            lazy
            v-model="detailsDialog"
          >
            <v-btn
              flat
              slot="activator"
              @click.native="details = props.item"
            >Details</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">Program details</span>
              </v-card-title>
              <v-card-text>
                Details for {{ details.name }}
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
            lazy
            v-model="deleteDialog"
          >
            <v-btn
              error
              flat
              slot="activator"
              @click.native="details = props.item"
            >Delete</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">Confirm delete</span>
              </v-card-title>
              <v-card-text>
                Are you sure you want to delete {{ details.name }}?
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
  import { firebaseApp, firebasedb } from '@/../utils/firebase';

  export default {
    name: 'coach-programs',
    data: function() {
      return {
        snackbar: false,
        snackbarText: '',
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
        items: [],
        details: {}
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
      this.getPrograms();
    },
    methods: {
      /**
       * Retrieves programs based on coach email
       */
      getPrograms: function() {
        var user = firebaseApp.auth().currentUser;

        this.items = [];

        this.$firebaseRefs.programs
          .orderByChild('coach')
          .equalTo(user.email)
          .once('value')
            .then((snapshot) => {
              var data = snapshot.val();

              if (data !== null) {
                var keys = Object.keys(data);

                for (var i = 0; i < keys.length; i++) {
                  this.items.push(data[keys[i]]);
                }
              } else {
                console.log('No data found.');
              }
            });
      },

      /**
       * Deletes a program
       */
      handleDelete: function() {
        // var id = this.details._id;

        // api.delete('/training/programs/' + id)
        //   .then((response) => {
        //     if (response.status === 200) {
        //       this.updatePrograms();
        //     }
        //   })
        //   .catch((error) => {
        //     console.log('API error retrieving programs: ', error);
        //   });

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

        // api.post('/training/programs', copy)
        //   .then((response) => {
        //     if (response.status === 201) {
        //       this.updatePrograms();
        //     } else {
        //       alert(response.data);
        //     }
        //   })
        //   .catch((error) => {
        //     console.log('API error retrieving programs: ', error);
        //   });

        // this.handleClose('program-preview-modal');
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

</style>
