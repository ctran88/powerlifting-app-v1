<template>
  <v-card>
    <v-card-title>
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
      no-data-text="No programs yet. Tell your coach to get moving!"
      no-results-text="No results."
      :headers="headers"
      :items="items"
      :search="search"
    >
      <template slot="items" scope="props">
        <td>{{ props.item.name }}</td>
        <td>{{ props.item.coach }}</td>
        <td>{{ props.item.active }}</td>
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
                  @click.native="handlePreview"
                >Preview</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-btn
            primary
            flat
            @click.native="handleTrainingLog(props.item)"
          >Training Log</v-btn>
        </td>
      </template>
      <template slot="pageText" scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>
  </v-card>
</template>

<script>
  import { firebaseApp, firebasedb } from '@/../utils/firebase';

  export default {
    name: 'client-programs',
    data: function() {
      return {
        detailsDialog: false,
        search: '',
        pagination: {},
        headers: [
          {
            text: 'Program name',
            align: 'left',
            value: 'name'
          },
          {
            text: 'Coach',
            align: 'left',
            value: 'coach'
          },
          {
            text: 'Active',
            align: 'left',
            value: 'active'
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
          .orderByChild('client')
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
       * Handles program preview and routes to view-program page
       */
      handlePreview: function() {
        this.$store.dispatch('setProgramId', this.details._id);
        this.detailsDialog = false;
        this.$router.push({ name: 'View program' });
      },

      /**
       * Sets program id then routes to training-log page
       *
       * @param      {string}  programId  The program identifier
       */
      handleTrainingLog: function(programId) {
        this.$store.dispatch('setProgramId', programId);
        this.detailsDialog = false;
        this.$router.push({ name: 'Training log' });
      }

    }
  };
</script>

<style scoped>

</style>
