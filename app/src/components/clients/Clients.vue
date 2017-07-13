<template>
  <v-card>
    <v-card-title>
      <v-dialog v-model="dialog">
        <v-btn
          primary
          dark
          slot="activator"
        >Invite a client</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">Invite a client</span>
          </v-card-title>
          <v-card-text>
            <v-text-field
              label="Name"
              v-model="inviteName"
              @keyup.native.enter="handleInvite"
            ></v-text-field>
            <v-text-field
              label="Email"
              required
              v-model="inviteEmail"
              :rules="rules.email"
              @keyup.native.enter="handleInvite"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="blue--text darken-1"
              flat
              @click.native="handleInviteCancel"
            >Cancel</v-btn>
            <v-btn
              class="blue--text darken-1"
              flat
              @click.native="handleInvite"
            >Send invite</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
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
      no-data-text="No clients yet. Invite a client to get started!"
      no-results-text="No results."
      :headers="headers"
      :items="items"
      :search="search"
    >
      <template slot="items" scope="props">
        <td class="text-xs-right">{{ props.item.name }}</td>
        <td class="text-xs-right">{{ props.item.team }}</td>
        <td class="text-xs-right">{{ props.item._activeProgramName }}</td>
        <td class="text-xs-right">{{ props.item.memberStart }}</td>
        <td class="text-xs-right">{{ props.item.lastLogin }}</td>
        <td class="text-xs-right">{{ props.item.email }}</td>
      </template>
      <template slot="pageText" scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>

    <v-snackbar
      :timeout="4000"
      top
      multi-line
      vertical
      :success="snackbarStatus === 'success'"
      :error="snackbarStatus === 'error'"
      v-model="snackbar"
    >
      {{ snackbarText }}
      <v-btn
        flat
        dark
        @click.native="snackbar = false"
      >Close</v-btn>
    </v-snackbar>
  </v-card>
</template>

<script>
  import api from '@/../utils/api';

  export default {
    name: 'clients',
    data: function() {
      return {
        snackbar: false,
        snackbarStatus: '',
        snackbarText: '',
        dialog: false,
        inviteName: '',
        inviteEmail: '',
        rules: {
          email: []
        },
        search: '',
        pagination: {},
        headers: [
          {
            text: 'Client',
            align: 'left',
            value: 'client'
          },
          {
            text: 'Team',
            value: 'team'
          },
          {
            text: 'Active program',
            value: 'active program'
          },
          {
            text: 'Member start date',
            value: 'member start date'
          },
          {
            text: 'Last login',
            value: 'last login'
          },
          {
            text: 'Email',
            value: 'email'
          }
        ],
        items: []
      };
    },
    methods: {
      /**
       * Uses the client array from state to create a query for an api call to retrieve those clients' active programs
       */
      getProgramNames: function() {
      //   this.items = JSON.parse(JSON.stringify(this.$store.state.user._clients));

      //   var programNames = [];
      //   var query = '?';

      // // build query string
      //   for (var i = 0; i < this.clientList.length; i++) {
      //     if (this.clientList[i]._activeProgram) {
      //       query += '_id=' + this.clientList[i]._activeProgram + '&';
      //     }
      //   }

      //   // remove '&' if there is one at the end of the query string
      //   query = query.replace(/&$/, '');

      // // get list of program names
      //   api.get('/training/programs' + query)
      //     .then((response) => {
      //       programNames = response.data.programs.map((el) => {
      //         return {
      //           _id: el._id,
      //           name: el.metadata.name
      //         };
      //       });

      //     // match program ids and assign program name
      //       for (var i = 0; i < this.clientList.length; i++) {
      //         for (var k = 0; k < programNames.length; k++) {
      //           if (this.clientList[i]._activeProgram === programNames[k]._id) {
      //             this.$set(this.clientList[i], '_activeProgramName', programNames[k].name);
      //           }
      //         }
      //       }
      //     });
      },

      /**
       * Handle cancel client invite
       */
      handleInviteCancel: function() {
        this.inviteEmail = '';
        this.inviteName = '';
        this.rules.email = [];
        this.dialog = false;
      },

      /**
       * Calls firebase cloud function to hash invite.
       */
      handleInvite: function() {
        var payload = {
          coach: this.$store.state.user.displayName,
          coachEmail: this.$store.state.user.email,
          team: this.$store.state.user.team,
          client: this.inviteName,
          clientEmail: this.inviteEmail,
          created: Date.now() // using unix format to make calculating cleanup easier
        };

        var errorsSet = this.setErrors();

        if (errorsSet) {
          this.inviteName = '';
          this.inviteEmail = '';
          return;
        }

        api.post('/hash', payload)
          .then((response) => {
            this.snackbarText = response.data;
            this.snackbarStatus = 'success';
            this.snackbar = true;
          })
          .catch((error) => {
            this.snackbarText = 'An error occurred trying to send the invitation';
            this.snackbarStatus = 'error';
            this.snackbar = true;
            console.log('Error hashing invite: ', error);
          });

        this.inviteName = '';
        this.inviteEmail = '';
        this.dialog = false;
      },

      /**
       * Checks/sets form errors.
       *
       * @return     {boolean}  true if errors are set, else false
       */
      setErrors: function() {
        var requiredMessage = 'Required.';
        var invalidEmailMessage = 'Invalid email.';
        var errorsSet = false;
        var pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (this.inviteEmail === '') {
          this.rules.email.push(requiredMessage);
          errorsSet = true;
        }

        if (!pattern.test(this.inviteEmail)) {
          this.rules.email.push(invalidEmailMessage);
          errorsSet = true;
        }

        return errorsSet;
      },

      /**
       * Sets program id as active program from client then routes to training-log page
       */
      handleTrainingLog: function() {
        // this.$store.dispatch('setProgramId', this.details._activeProgram);
        // this.handleClose('client-preview-modal');
        // this.$router.push({ name: 'Training log' });
      },

      handleRemove: function() {
        // TODO: need to finish in next iteration
        //
        //
        //
      }
    }
  };
</script>

<style scoped>
  button {
    cursor: pointer;
  }
  #btn-invite-client {
    margin-bottom: 1rem;
  }
</style>
