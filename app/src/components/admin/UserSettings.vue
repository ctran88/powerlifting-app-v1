<template>
  <v-layout row wrap>
    <v-flex xs12 md6 offset-md3>
      <v-card class="pt-3">
        <v-card-media
          :src="image"
          contain
          height="250px"
        ></v-card-media>
        <v-flex class="text-xs-center">
          <label
            class="upload-button btn btn--raised theme--dark dark--bg primary"
            style="cursor: pointer;"
          >
            <span class="btn__content">Change profile picture</span>
            <input style="display: none" type="file" @change="fileSelection($event)">
          </label>
          <v-btn
            primary
            @click.native="removeImage"
            v-if="image"
          >
            Remove photo
          </v-btn>
        </v-flex>
        <v-card-title>
          <div class="headline">User settings</div>
        </v-card-title>
        <v-card-text>
          <v-text-field
            label="First name"
            v-model="firstName"
            required
          ></v-text-field>
          <v-text-field
            label="Last name"
            hint="example of helper text only on focus"
            v-model="lastName"
            required
          ></v-text-field>
          <v-text-field
            label="Team name"
            hint="ex. Team USA"
            persistent-hint
            v-model="team"
          ></v-text-field>
          <v-text-field
            label="Password"
            type="password"
            v-model="password"
          ></v-text-field>
          <v-text-field
            label="Confirm password"
            type="password"
            v-model="passwordConfirmation"
          ></v-text-field>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn primary @click.native.stop="handleSave">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>

    <v-dialog v-model="dialog">
      <v-card>
        <v-card-title>
          <span class="headline">Invalid image</span>
        </v-card-title>
        <v-card-text>
          Invalid file type. Must be an image.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            @click.native="dialog = false"
          >Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="passwordDialog">
      <v-card>
        <v-card-title>
          <span class="headline">Invalid password</span>
        </v-card-title>
        <v-card-text>
          Passwords do not match.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            flat
            @click.native="passwordDialog = false"
          >Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
  </v-layout>
</template>

<script>
  import { firebaseApp, firebasedb } from '@/../utils/firebase';

  export default {
    name: 'user-settings',
    data: function() {
      return {
        snackbar: false,
        snackbarText: '',
        snackbarStatus: '',
        dialog: false,
        passwordDialog: false,
        image: '',
        firstName: '',
        lastName: '',
        team: '',
        password: '',
        passwordConfirmation: ''
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
      this.setDefaultSettings();
    },
    methods: {
      /**
       * Sets the default settings.
       */
      setDefaultSettings: function() {
        var user = firebaseApp.auth().currentUser;

        this.$firebaseRefs.users.child(user.uid).once('value', (snapshot) => {
          var userInfo = snapshot.val();

          this.firstName = userInfo.firstName;
          this.lastName = userInfo.lastName;
          this.team = userInfo.team;
          this.image = user.photoURL;
        });
      },
  
      /**
       * If file is .jpeg/.jpg or .png then calls createImage(), else opens invalid file dialog.
       *
       * @param      {Object}  event   The event
       */
      fileSelection: function(event) {
        var file = event.target.files[0];

        if (file) {
          if (file.type === 'image/jpeg' || file.type === 'image/png') {
            this.createImage(file);
          } else {
            this.dialog = true;
          }
        }
      },

      /**
       * Creates an image.
       *
       * @param      {Object}  file    The file
       */
      createImage: function(file) {
        var reader = new FileReader();

        reader.onload = (event) => {
          this.image = event.target.result;
        };

        reader.readAsDataURL(file);
      },

      /**
       * Removes an image.
       */
      removeImage: function() {
        this.image = '';
      },

      /**
       * Handles user settings save.
       */
      handleSave: function() {
        var user = firebaseApp.auth().currentUser;
        var authUpdate = {
          displayName: this.firstName + ' ' + this.lastName,
          photoURL: this.image || this.$store.state.user.photoURL
        };
        var dbUpdate = {
          firstName: this.firstName,
          lastName: this.lastName,
          team: this.team
        };

        if (this.password !== '' &&
            this.password === this.passwordConfirmation) {
          user.updatePassword(this.password);
        } else if (this.password !== this.passwordConfirmation) {
          this.passwordDialog = true;
          return;
        }
  
        user.updateProfile(authUpdate)
          .then(() => {
            this.$firebaseRefs.users.child(user.uid).update(dbUpdate)
              .then(() => {
                this.snackbarText = 'Settings saved successfully.';
                this.snackbar = true;
              })
              .catch((error) => {
                console.log('Error saving user settings to database: ', error);
                this.snackbarText = 'An error occurred trying to saving settings.';
                this.snackbarStatus = 'error';
                this.snackbar = true;
              });
          })
          .catch((error) => {
            console.log('Error saving user profile: ', error);
            this.snackbarText = 'An error occurred trying to saving settings.';
            this.snackbarStatus = 'error';
            this.snackbar = true;
          }); ;
      }
    }
  };
</script>

<style scoped>

</style>
