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
              @keyup.native.enter="handleSignIn"
            ></v-text-field>
            <v-text-field
              label="Password"
              class="mb-0"
              v-model="password"
              :append-icon="e ? 'visibility' : 'visibility_off'"
              :append-icon-cb="handlePasswordVisibility"
              :type="e ? 'password' : 'text'"
              :rules="rules.password"
              @keyup.native.enter="handleSignIn"
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
                @click.native="handleSignIn"
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
  import { firebasedb } from '@/../utils/firebase';
  import { signin } from '@/../utils/auth';

  export default {
    name: 'signin',
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
    firebase: {
      users: {
        source: firebasedb.ref('/users'),
        cancelCallback(error) {
          console.error('firebasedb error: ', error);
        }
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
       * Handles sign in procedure.
       */
      handleSignIn: function() {
        var payload = {
          lastLogin: new Date().toISOString()
        };

        this.rules = {
          email: [],
          password: []
        };

        var errorsSet = this.setErrors();

        if (errorsSet) {
          return;
        }

        signin(this.email, this.password)
          .then((user) => {
            this.$firebaseRefs.users.child(user.uid).update(payload);
            this.$router.push({ name: 'Dashboard' });
          })
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
       *
       * @return     {boolean}  true if errors are set, else false
       */
      setErrors: function() {
        var requiredMessage = 'Required.';
        var errorsSet = false;

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
