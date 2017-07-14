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
        items: [
          {
            name: 'Program v1',
            coach: 'Coach One',
            active: 'Yes',
            status: 'Published',
            created: '2017-06-10T09:30:15.561Z',
            lastUpdated: '2017-07-08T12:40:55.969Z'
          },
          {
            name: 'Program v2',
            coach: 'Coach One',
            active: 'No',
            status: 'Published',
            created: '2016-06-10T09:30:15.561Z',
            lastUpdated: '2016-07-08T12:40:55.969Z'
          }
        ],
        details: {}
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
        // this.programs = [];
        // var query = '?metadata.client=' + this.$store.state.user.email;

        // api.get('/training/programs' + query)
        //   .then((response) => {
        //     if (response.status === 200) {
        //       response.data.programs.forEach((current) => {
        //         this.programs.push(current);
        //       });
        //     }
        //   })
        //   .catch((error) => {
        //     console.log('API error retrieving programs: ', error);
        //   });
      },

      /**
       * Handles program preview and routes to view-program page
       */
      handlePreview() {
        this.$store.dispatch('setProgramId', this.details._id);
        this.detailsDialog = false;
        this.$router.push({ name: 'View program' });
      },

      /**
       * Sets program id then routes to training-log page
       *
       * @param      {string}  programId  The program identifier
       */
      handleTrainingLog(programId) {
        this.$store.dispatch('setProgramId', programId);
        this.detailsDialog = false;
        this.$router.push({ name: 'Training log' });
      }

    }
  };
</script>

<style scoped>

</style>
