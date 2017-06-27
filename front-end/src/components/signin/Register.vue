<template>
<div class="register">
  <b-card>
    <form @submit.prevent="handleSubmit">
      <h2>Register</h2>

      <small class="text-muted">First Name</small>
      <b-form-input v-model="firstName" id="input-name" type="text" required autofocus />
      <small class="text-muted">Last Name</small>
      <b-form-input v-model="lastName" id="input-name" type="text" required />
      <small class="text-muted">Email</small>
      <b-form-input v-model="email" id="input-email" type="email" required />
      <small class="text-muted">Password</small>
      <b-form-input v-model="password" id="input-password" type="password" required />
      <small class="text-muted">Confirm password</small>
      <b-form-input v-model="password2" id="input-password2" type="password" required />

      <b-form-radio v-model="accountType" :options="accountOptions" required />

      <b-button id="btn-register">Register</b-button>
    </form>
    <b-button id="already-member" variant="link" to="signin">Already a member?</b-button>
  </b-card>

  <b-modal id="register-client-modal" title="Coach selection">
    Who is your coach?
    <b-form-select :options="coachList" v-model="coach" />
    <footer slot="modal-footer">
      <b-btn variant="secondary" @click="handleCancel">Cancel</b-btn>
      <b-btn variant="primary" @click="handleRegisterClient">Select</b-btn>
    </footer>
  </b-modal>

  <b-modal id="registration-results-modal" title="Registration confirmation">
    {{ message }}
    <footer slot="modal-footer">
      <b-btn variant="primary" @click="handleClose('registration-results-modal')">Ok</b-btn>
    </footer>
  </b-modal>
</div>
</template>

<script>
import api from '@/../utils/api';
import { signin } from '@/../utils/auth';
import Router from 'vue-router';

var router = new Router();

export default {
  name: 'register',
  data () {
    return {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      password2: '',
      accountType: '',
      accountOptions: [
        {
          text: 'Coach',
          value: 'coach'
        },
        {
          text: 'Client',
          value: 'client'
        }
      ],
      coachList: [],
      coach: undefined,
      message: ''
    };
  },
  methods: {
    handleClose(modalId) {
      this.$root.$emit('hide::modal', modalId);
    },
    handleOpen(modalId) {
      this.$root.$emit('show::modal', modalId);
    },
    getCoachList() {
      var query = '?accountType=coach';

      api.get('/users/' + query)
        .then((response) => {
          if (response.status === 200) {
            for (var i = 0; i < response.data.users.length; i++) {
              var fullName = response.data.users[i].lastName + ', ' + response.data.users[i].firstName;

              this.coachList.push({
                text: fullName,
                value: response.data.users[i].email
              });
            }

            this.coachList.sort();
          }
        })
        .catch((error) => {
          console.log('No coaches found.');
        });
    },
    handleSubmit() {
      if (this.password !== this.password2) {
        this.message = 'Your passwords do not match.';
        this.handleOpen('registration-results-modal');
      } else if (this.accountType === '') {
        this.message = 'Account type is required.';
        this.handleOpen('registration-results-modal');
      } else if (this.accountType === 'client') {
        this.handleRegister()
          .then((result) => {
            if (result) {
              signin(this.email, this.password)
                .then((result) => {
                  if (result) {
                    this.getCoachList();
                    this.handleOpen('register-client-modal');
                  }
                });
            } else {
              this.handleOpen('registration-results-modal');
            }
          });
      } else {
        this.handleRegister()
          .then((result) => {
            this.handleOpen('registration-results-modal');
          });
      }
    },
    handleRegister() {
      var payload = {
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        accountType: this.accountType,
        memberStart: new Date().toISOString()
      };

      return api.post('/users', payload)
        .then((response) => {
          if (response.status === 201) {
            this.message = 'Your account was created successfully!';
            return true;
          }
        })
        .catch((error) => {
          this.message = 'There was an error creating your account.';
          return false;
        });
    },
    handleOk() {
      if (this.message === 'Your account was created successfully!') {
        signin(this.email, this.password)
          .then((result) => {
            if (result) {
              router.push('/dash');
            }
          });
      } else {
        this.handleClose('registration-results-modal');
      }
    },
    handleRegisterClient() {
      var query = this.email;
      var payload = {
        coach: this.coach
      };

      api.patch('/users/' + query, payload)
        .then((response) => {
          if (response.status === 200) {
            router.push('/dash');
          } else {
            this.handleClose('register-client-modal');
          }
        })
        .catch((error) => {
          console.log('There was an error assigning your coach: ', error);
          this.handleClose('register-client-modal');
        });
    },
    handleCancel() {
      var query = this.email;

      api.delete('/users/' + query)
        .then((response) => {

        })
        .catch((error) => {

        });

      this.coach = undefined;
      this.coachList = [];
      this.handleClose('register-client-modal');
    }
  }
};
</script>

<style scoped>
button {
  cursor: pointer;
}
.register {
  max-width: 330px;
  padding: 60px 15px;
  margin: 0 auto;
}
.card {
  padding: 15px 0px;
  border-color: #cccccc;
  background-color: #f6f6f6;
  height: 575px;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
              0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -moz-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
                   0 6px 20px 0 rgba(0, 0, 0, 0.19);
  -webkit-box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
                      0 6px 20px 0 rgba(0, 0, 0, 0.19);
}
h2 {
  margin-bottom: 10px;
}
.form-control {
  position: relative;
  height: auto;
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
  padding: 10px;
  font-size: 16px;
  margin-bottom: 10px;
}
.form-control:focus {
  z-index: 2;
  border-color: #0A3E65;
}
#btn-register {
  color: #ffffff;
  background-color: #0A3E65;
  display: block;
  width: 100%;
}
#btn-register:hover, #btn-register:active {
  background-color: #225174;
}
#already-member {
  color: #C8D80D;
  padding: 8px 0px;
  font-size: 0.9rem;
}
</style>
