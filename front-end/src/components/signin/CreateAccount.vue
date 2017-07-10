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
  import { firebase } from '@/../utils/firebase';
  import Router from 'vue-router';
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
        this.rules = {
          firstName: [],
          lastName: [],
          email: [],
          password: []
        };

        var payload = {
          firstName: this.firstName,
          lastName: this.lastName,
          memberStart: new Date().toISOString()
        };

        this.setErrors();

        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
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
       */
      setErrors: function() {
        var requiredMessage = 'Required.';

        if (this.firstName === '') {
          this.rules.firstName.push(requiredMessage);
        }

        if (this.lastName === '') {
          this.rules.lastName.push(requiredMessage);
        }

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
