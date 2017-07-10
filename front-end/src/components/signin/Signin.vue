<template>
  <v-container fluid>
    <v-layout row wrap>
      <v-flex xs8 md4 offset-md4 offset-xs2>
        <v-card>
          <v-card-title primary-title>
            <h2 class="headline mb-0">Sign in</h2>
          </v-card-title>
          <v-card-text class="pb-0">
            <v-text-field
              label="Email"
              v-model="email"
              :rules="rules.email"
            ></v-text-field>
            <v-text-field
              label="Password"
              class="mb-0"
              v-model="password"
              :append-icon="e ? 'visibility' : 'visibility_off'"
              :append-icon-cb="handlePasswordVisibility"
              :type="e ? 'password' : 'text'"
              :rules="rules.password"
            ></v-text-field>
            <v-layout row>
              <v-checkbox
                class="mt-0"
                :label="'Remember me'"
                v-model="rememberMe"
              ></v-checkbox>
              <v-spacer></v-spacer>
              <v-btn
                large
                primary
                @click.native.stop="handleSignIn"
              >Sign in</v-btn>
            </v-layout>
            <v-divider></v-divider>
          </v-card-text>
          <v-card-actions>
            <router-link to="forgot-password">Forgot your password?</router-link>
            <v-spacer></v-spacer>
            <span>Not a member yet? </span>
            <router-link to="create-account">Create an account</router-link>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import { firebase } from '@/../utils/firebase';
  import Router from 'vue-router';
  import general from '@/mixins/general';

  export default {
    name: 'signin',
    mixins: [
      general
    ],
    data: function() {
      return {
        email: '',
        password: '',
        e: true,
        rememberMe: false,
        rules: {
          email: [],
          password: []
        }
      };
    },
    methods: {
      /**
       * Handles toggling eye icon for password visibility.
       */
      handlePasswordVisibility: function() {
        this.e = !this.e;
      },

      /**
       * Makes api call to post the account
       *
       * @return     {Promise}  Promise of post response
       */
      handleSignIn: function() {
        this.rules = {
          email: [],
          password: []
        };

        var payload = {
          firstName: this.firstName,
          lastName: this.lastName,
          memberStart: new Date().toISOString()
        };

        this.setErrors();

        firebase.auth().signInWithEmailAndPassword(this.email, this.password)
          .catch((error) => {
            if (error.code === 'auth/invalid-email') {
              this.rules.email.push('Must enter valid email.');
            } else if (error.code === 'auth/user-not-found') {
              this.rules.email.push('User does not exist.');
            } else {
              this.rules.email.push('Email and password do not match.');
            }
          });
      },

      /**
       * Checks/sets form errors.
       */
      setErrors: function() {
        var requiredMessage = 'Required.';

        if (this.email === '') {
          this.rules.email.push(requiredMessage);
        }

        if (this.password === '') {
          this.rules.password.push(requiredMessage);
        }
      }
    }
  };
</script>

<style scoped>

</style>
