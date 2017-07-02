<template>
<div class="create-account">
  <b-card>
    <form @submit.prevent="handleSubmit">
      <h2>Create an account</h2>

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

      <b-button id="btn-create-account">Create an account</b-button>
    </form>
    <hr class='hr-text' data-content='or' />
    <div id="already-member">
      <span>Already a member? </span>
      <b-button id="sign-in" variant="link" to="signin">Sign in</b-button>
    </div>
  </b-card>

  <b-modal id="create-client-modal" title="Coach selection">
    Who is your coach?
    <b-form-select :options="coachList" v-model="coach" />
    <footer slot="modal-footer">
      <b-btn variant="secondary" @click="handleCancel">Cancel</b-btn>
      <b-btn variant="primary" @click="handleCreateClient">Select</b-btn>
    </footer>
  </b-modal>

  <b-modal id="create-account-results-modal" title="Create account confirmation">
    {{ message }}
    <footer slot="modal-footer">
      <b-btn variant="primary" @click="handleClose('create-account-results-modal')">Ok</b-btn>
    </footer>
  </b-modal>
</div>
</template>

<script>
import api from '@/../utils/api';
import { signin } from '@/../utils/auth';
import Router from 'vue-router';

export default {
  name: 'create-account',
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
        this.handleOpen('create-account-results-modal');
      } else if (this.accountType === '') {
        this.message = 'Account type is required.';
        this.handleOpen('create-account-results-modal');
      } else if (this.accountType === 'client') {
        this.handleCreateAccount()
          .then((result) => {
            if (result) {
              signin(this.email, this.password)
                .then((result) => {
                  if (result) {
                    this.getCoachList();
                    this.handleOpen('create-client-modal');
                  }
                });
            } else {
              this.handleOpen('create-account-results-modal');
            }
          });
      } else {
        this.handleCreateAccount()
          .then((result) => {
            this.handleOpen('create-account-results-modal');
          });
      }
    },
    handleCreateAccount() {
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
      var router = new Router();

      if (this.message === 'Your account was created successfully!') {
        signin(this.email, this.password)
          .then((result) => {
            if (result) {
              this.handleClose('create-account-results-modal');
              router.push('/dash');
            }
          });
      } else {
        this.handleClose('create-account-results-modal');
      }
    },
    handleCreateClient() {
      var router = new Router();
      var query = this.email;
      var payload = {
        coach: this.coach
      };

      api.patch('/users/' + query, payload)
        .then((response) => {
          if (response.status === 200) {
            this.handleClose('create-client-modal');
            router.push('/dash');
          } else {
            this.handleClose('create-client-modal');
          }
        })
        .catch((error) => {
          console.log('There was an error assigning your coach: ', error);
          this.handleClose('create-client-modal');
        });
    },
    handleCancel() {
      var query = this.email;

      api.delete('/users/' + query)
        .then((response) => {
          this.coach = undefined;
          this.coachList = [];
        })
        .catch((error) => {
          console.log('There was an error deleting the user.');
        });

      this.handleClose('create-client-modal');
    }
  }
};
</script>

<style scoped>
button {
  cursor: pointer;
}
.create-account {
  max-width: 330px;
  padding: 60px 15px;
  margin: 0 auto;
}
.card {
  border-color: #cccccc;
  background-color: #f6f6f6;
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
#btn-create-account {
  color: #ffffff;
  background-color: #0A3E65;
  display: block;
  width: 100%;
}
#btn-create-account:hover, #btn-create-account:active {
  background-color: #225174;
}
#already-member {
  text-align: center;
}
#already-member span {
  font-size: 0.9rem;
}
#sign-in {
  color: #C8D80D;
  padding: 8px 0px;
}
.hr-text {
  line-height: 1em;
  position: relative;
  outline: 0;
  border: 0;
  color: black;
  text-align: center;
  height: 1.5em;
  opacity: .5;
}
.hr-text::before {
  content: '';
  background: linear-gradient(to right, transparent, #818078, transparent);
  position: absolute;
  left: 0;
  top: 50%;
  width: 100%;
  height: 1px;
}
.hr-text::after {
  content: attr(data-content);
  position: relative;
  display: inline-block;
  color: black;
  padding: 0 .5em;
  line-height: 1.5em;
  color: #818078;
  background-color: #f6f6f6;
}
</style>
