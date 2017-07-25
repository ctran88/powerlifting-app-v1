<template>
  <v-card>
    <v-card-title>
      <v-dialog v-model="inviteDialog">
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
      no-data-text="No clients yet. Invite someone to get started!"
      no-results-text="No results."
      :headers="headers"
      :items="items"
      :search="search"
    >
      <template slot="items" scope="props">
        <td class="text-xs-right">{{ props.item.firstName }} {{ props.item.lastName }}</td>
        <td class="text-xs-right">{{ props.item.team }}</td>
        <td class="text-xs-right">{{ props.item.activeProgram.name }}</td>
        <td class="text-xs-right">{{ props.item.memberStart }}</td>
        <td class="text-xs-right">{{ props.item.lastLogin }}</td>
        <td class="text-xs-right">{{ props.item.email }}</td>
        <td>
          <v-btn
            flat
            @click.native="handleTrainingLog(props.item)"
          >Training log</v-btn>
          <v-dialog
            lazy
            v-model="dropDialog"
          >
            <v-btn
              error
              flat
              slot="activator"
            >Drop</v-btn>
            <v-card>
              <v-card-title>
                <span class="headline">Confirm drop</span>
              </v-card-title>
              <v-card-text>
                Are you sure you want to drop {{ props.item.firstName }} {{ props.item.lastName }}?
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  flat
                  @click.native="dropDialog = false"
                >Cancel</v-btn>
                <v-btn
                  error
                  flat
                  @click.native="handleDrop(props.item)"
                >Drop</v-btn>
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
      :timeout="4000"
      top
      multi-line
      vertical
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
  import { firebaseApp, firebasedb } from '@/../utils/firebase';
  import api from '@/../utils/api';

  export default {
    name: 'clients',
    data: function() {
      return {
        snackbar: false,
        snackbarStatus: '',
        snackbarText: '',
        inviteDialog: false,
        dropDialog: false,
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
            value: 'activeProgram'
          },
          {
            text: 'Member start date',
            value: 'memberStart'
          },
          {
            text: 'Last login',
            value: 'lastLogin'
          },
          {
            text: 'Email',
            value: 'email'
          }
        ],
        items: []
      };
    },
    firebase: {
      users: {
        source: firebasedb.ref('/users'),
        cancelCallback: function(error) {
          console.error('firebasedb error: ', error);
        }
      }
    },
    mounted: function() {
      this.getClients();
    },
    methods: {
      /**
       * Gets the clients.
       */
      getClients: function() {
        var user = firebaseApp.auth().currentUser;

        this.items = [];

        this.$firebaseRefs.users
          .orderByChild('coach')
          .equalTo(user.email)
          .once('value')
            .then((snapshot) => {
              var data = snapshot.val();

              if (data !== null) {
                var keys = Object.keys(data);

                for (var i = 0; i < keys.length; i++) {
                  var client = JSON.parse(JSON.stringify(data[keys[i]]));

                  client.id = keys[i];
                  this.items.push(client);
                }
              } else {
                console.log('No data found.');
              }
            });
      },

      /**
       * Handle cancel client invite
       */
      handleInviteCancel: function() {
        this.inviteEmail = '';
        this.inviteName = '';
        this.rules.email = [];
        this.inviteDialog = false;
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
        this.inviteDialog = false;
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
      handleTrainingLog: function(client) {
        this.$store.dispatch('setProgramId', client.activeProgram.id);
        this.$router.push({ name: 'Training log' });
      },

      /**
       * Handles removing the coach from the client's user information
       */
      handleDrop: function(client) {
        var payload = {
          coach: null
        };

        this.$firebaseRefs.users.child(client.id).update(payload)
          .then(() => {
            this.snackbarStatus = '';
            this.snackbarText = 'Client dropped succesfully.';
            this.snackbar = true;
          })
          .catch((error) => {
            this.snackbarStatus = 'error';
            this.snackbarText = 'There was an error dropping your client.';
            this.snackbar = true;
            console.log('Error dropping client: ', error);
          });

        this.getClients();
      }
    }
  };
</script>

<style scoped>

</style>
