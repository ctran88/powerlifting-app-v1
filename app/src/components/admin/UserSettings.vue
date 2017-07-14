<template>
  <v-layout row wrap>
    <v-flex xs12 md6 offset-md3>
      <v-card>
        <v-card-media
          :src="image || $store.state.user.photoURL"
          contain
          height="250px"
        ></v-card-media>
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
        <v-spacer></v-spacer>
        <label
          class="upload-button btn btn--raised theme--dark dark--bg primary"
          style="cursor: pointer;"
          v-if="!image">
          <span class="btn__content">Change profile picture</span>
          <input style="display: none" type="file" @change="fileSelection($event)">
        </label>
        <v-btn
          primary
          @click.native="removeImage"
          v-else
        >
          Remove photo
        </v-btn>
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
            required
          ></v-text-field>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn primary @click.native="handleSave">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
  export default {
    name: 'user-settings',
    data: function() {
      return {
        dialog: false,
        image: '',
        firstName: '',
        lastName: '',
        team: ''
      };
    },
    methods: {
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
      createImage: function(file) {
        var reader = new FileReader();

        reader.onload = (event) => {
          this.image = event.target.result;
        };

        reader.readAsDataURL(file);
      },
      removeImage: function() {
        this.image = '';
      },
      handleSave: function() {
  
      }
    }
  };
</script>

<style scoped>

</style>
