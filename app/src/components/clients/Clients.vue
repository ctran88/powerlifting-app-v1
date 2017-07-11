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
            <v-text-field label="Email" required></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              class="blue--text darken-1"
              flat
              @click.native="dialog = false"
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
  </v-card>
</template>

<script>
  import { firebasedb } from '@/../utils/firebase';
  import { hashBcrypt } from '@/../utils/hash';
  import { sendMail } from '@/../utils/mailer';
  import general from '@/mixins/general';

  export default {
    name: 'clients',
    mixins: [
      general
    ],
    data: function() {
      return {
        dialog: false,
        inviteEmail: '',
        search: '',
        pagination: {},
        headers: [
          {
            text: 'Client',
            align: 'left',
            value: 'client'
          },
          { text: 'Team', value: 'team' },
          { text: 'Active program', value: 'active program' },
          { text: 'Member start date', value: 'member start date' },
          { text: 'Last login', value: 'last login' },
          { text: 'Email', value: 'email' }
        ],
        items: []
      };
    },
    firebase: {
      invites: {
        source: firebasedb.ref('invites'),
        cancelCallback: function(error) {
          console.error('firebasedb error: ', error);
        }
      }
    },
    mounted: function() {
      // this.getProgramNames();
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
       * Handles client invitation hashing and emailing.
       */
      handleInvite: function() {
        this.hashInvite()
          .then((payload) => {
            var link = 'https://192.168.54.54:8080/#/invitation/' + payload.hash;
            var params = this.setMailerParams(this.inviteEmail, this.$store.state.user.displayName, link);

            this.$firebaseRefs.invites.once('value')
              .then((dataSnapshot) => sendMail(params));
            this.$firebaseRefs.invites.set(payload);
          });
      },

      /**
       * Hashes invitation link using coach uid and client email
       *
       * @return     {Promise}  Promise of payload
       */
      hashInvite: function() {
        var coachUid = this.$store.state.user.uid;
        var clientEmail = this.inviteEmail;
        var date = new Date().toISOString();

        // hash invitation parameters
        var inviteHash = hashBcrypt(coachUid, clientEmail, date);

        var payload = {
          hash: inviteHash
        };

        return new Promise((resolve) => resolve(payload));
      },

      /**
       * Sets the mailer parameters.
       *
       * @param      {string}  email   The email
       * @param      {string}  coach   The coach
       * @param      {string}  link    The link
       * @return     {Object}  Mailer parameters
       */
      setMailerParams: function(email, coach, link) {
        var subject = 'Invitation to join The Powerlifting Notebook';
        var text = 'Hello,' +
                   '\n\n' +
                   'Coach ' + coach +
                   ' has invited you to join The Powerlifting Notebook.  Follow this link to create an account with us.' +
                   '\n\n' +
                   link +
                   '\n\n' +
                   'If you don\'t want to create an account, you can ignore this email.' +
                   '\n\n' +
                   'Thanks,' +
                   '\n\n' +
                   'The Powerlifting Notebook Team';
        var html = 'Hello,' +
                   '<br /><br />' +
                   'Coach ' + coach +
                   ' has invited you to join The Powerlifting Notebook.  Follow this link to create an account with us.' +
                   '<br /><br />' +
                   '<a href="' + link + '">Invitation</a>' +
                   '<br /><br />' +
                   'If you don\'t want to create an account, you can ignore this email.' +
                   '<br /><br />' +
                   'Thanks,' +
                   '<br /><br />' +
                   'The Powerlifting Notebook Team';

        var params = {
          to: email,
          subject: subject,
          text: text,
          html: html
        };

        return params;
      },

      /**
       * Sets program id as active program from client then routes to training-log page
       */
      handleTrainingLog: function() {
        this.$store.dispatch('setProgramId', this.details._activeProgram);
        this.handleClose('client-preview-modal');
        this.$router.push({ name: 'Training log' });
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
