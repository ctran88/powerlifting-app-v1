<template>
  <div id="invitation">
    <div class="loading" v-if="status === 'loading'">
      <v-progress-circular
        indeterminate
        :size="70"
        :width="7"
        class="primary--text"
      ></v-progress-circular>
    </div>

    <div class="error-message" v-if="status === 'error'">
      <h1>Oops!</h1>
      <h5>
        <span>There was an error retrieving your invitation. Have your coach try to send you another invitation or </span>
        <a href="">contact the administrator.</a>
      </h5>
    </div>

    <create-client-account
      :defaultClientEmail="details.clientEmail"
      :defaultClientFirst="details.clientFirst"
      :defaultClientLast="details.clientLast"
      :defaultCoachEmail="details.coachEmail"
      :defaultCoach="details.coach"
      :defaultTeam="details.team"
      :defaultKey="details.key"
      v-if="status === 'done'"
    ></create-client-account>
  </div>
</template>

<script>
  import CreateClientAccount from './CreateClientAccount';
  import { firebasedb } from '@/../utils/firebase';

  export default {
    name: 'invitation',
    components: {
      CreateClientAccount
    },
    data: function() {
      return {
        status: '',
        details: {}
      };
    },
    firebase: {
      invites: {
        source: firebasedb.ref('/invites'),
        cancelCallback: function(error) {
          console.error('firebasedb error: ', error);
        }
      }
    },
    created: function() {
      this.fetchData();
    },
    methods: {
      /**
       * Fetches the hash from the invites table.
       */
      fetchData: function() {
        this.status = 'loading';

        this.$firebaseRefs.invites
          .orderByChild('link')
          .equalTo(this.$route.params.invite)
          .once('value', (snapshot) => {
            if (snapshot.val() === null) {
              this.status = 'error';
            } else {
              var key = Object.keys(snapshot.val());
              var data = snapshot.val()[key[0]];
  
              var name = data.client.split(' ');
              var first = '';
              var last = '';

              if (name.length < 2) {
                first = name[0];
              } else {
                first = name[0];
                last = name[1];
              }

              this.details.clientFirst = first;
              this.details.clientLast = last;
              this.details.clientEmail = data.clientEmail;
              this.details.coach = data.coach;
              this.details.coachEmail = data.coachEmail;
              this.details.team = data.team;
              this.details.key = key[0];
              this.status = 'done';
            }
          });
      }
    }
  };
</script>

<style scoped>
  .loading,
  .error-message {
    margin-top: 15%;
    text-align: center;
  }
</style>
