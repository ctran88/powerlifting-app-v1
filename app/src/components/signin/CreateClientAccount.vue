<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs8 md4 offset-md4 offset-xs2>
        <v-card>
          <v-card-title primary-title>
            <h2 class="headline mb-0">Create an account</h2>
          </v-card-title>
          <v-card-text class="pb-0">
            <v-text-field
              label="First name"
              v-model="firstName"
              :rules="rules.firstName"
            ></v-text-field>
            <v-text-field
              label="Last name"
              v-model="lastName"
              :rules="rules.lastName"
            ></v-text-field>
            <v-text-field
              label="Coach"
              v-model="coach"
            ></v-text-field>
            <v-text-field
              label="Team"
              v-model="team"
            ></v-text-field>
            <v-text-field
              label="Email"
              v-model="email"
              :rules="rules.email"
            ></v-text-field>
            <v-text-field
              label="Password"
              hint="Minimum 6 characters"
              class="mb-0"
              v-model="password"
              min="6"
              :append-icon="e ? 'visibility' : 'visibility_off'"
              :append-icon-cb="handlePasswordVisibility"
              :type="e ? 'password' : 'text'"
              :rules="rules.password"
            ></v-text-field>
            <v-layout row class="mb-3">
              <v-spacer></v-spacer>
              <v-btn
                large
                primary
                @click.native.stop="handleCreateAccount"
              >Create account</v-btn>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <span>Already a member? </span>
            <router-link to="signin">Sign in</router-link>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { firebasedb } from '@/../utils/firebase';
  import { createAccount } from '@/../utils/auth';
  import general from '@/mixins/general';

  export default {
    name: 'create-account',
    mixins: [
      general
    ],
    data: function() {
      return {
        firstName: '',
        lastName: '',
        coach: '',
        team: '',
        email: '',
        password: '',
        e: true,
        rules: {
          firstName: [],
          lastName: [],
          email: [],
          password: []
        }
      };
    },
    firebase: {
      users: {
        source: firebasedb.ref('users'),
        cancelCallback: function(error) {
          console.error('firebasedb error: ', error);
        }
      }
    },
    beforeRouteLeave: function(to, from, next) {
      if (to.name === 'Dashboard') {
        this.successful = true;
        setTimeout(next, 1000);
      }
    },
    methods: {
      /**
       * Handles toggling eye icon for password visibility.
       */
      handlePasswordVisibility: function() {
        this.e = !this.e;
      },

      /**
       * Handles sign in submission.
       */
      handleCreateAccount: function() {
        var router = new Router();
        var payload = {
          firstName: this.firstName,
          lastName: this.lastName,
          coach: this.coach,
          team: this.team,
          accountType: 'client',
          memberStart: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };

        this.rules = {
          firstName: [],
          lastName: [],
          email: [],
          password: []
        };

        var errorsSet = this.setErrors();

        if (errorsSet) {
          return;
        }

        createAccount(this.email, this.password)
          .then((user) => {
            var update = {
              displayName: this.firstName + ' ' + this.lastName,
              photoURL: "https://randomuser.me/api/portraits/lego/1.jpg"
            };

            user.updateProfile(update);
            this.$firebaseRefs.users.child(user.uid).set(payload);
            this.$router.push({ name: 'Dashboard' });
          })
          .catch((error) => {
            if (error.code === 'auth/email-already-in-use') {
              this.rules.email.push('User already exists.');
            } else if (error.code === 'auth/invalid-email') {
              this.rules.email.push('Must enter valid email.');
            }
          });
      },

      /**
       * Checks/sets form errors.
       *
       * @return     {boolean}  true if errors are set, else false
       */
      setErrors: function() {
        var requiredMessage = 'Required.';
        var errorsSet = false;

        if (this.firstName === '') {
          this.rules.firstName.push(requiredMessage);
          errorsSet = true;
        }

        if (this.lastName === '') {
          this.rules.lastName.push(requiredMessage);
          errorsSet = true;
        }

        if (this.email === '') {
          this.rules.email.push(requiredMessage);
          errorsSet = true;
        }

        if (this.password === '') {
          this.rules.password.push(requiredMessage);
          errorsSet = true;
        }

        return errorsSet;
      }
    }
  };
</script>

<style scoped>
  
</style>
