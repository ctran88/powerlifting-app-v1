<template>
<div class="register">
  <b-card>
    <form @submit.prevent="handleRegister">
      <h2>Register</h2>
      <small class="text-muted">Email</small>
      <b-form-input v-model="email" id="input-email" type="email" required autofocus />
      <small class="text-muted">Password</small>
      <b-form-input v-model="password" id="input-password" type="password" required />
      <small class="text-muted">Confirm password</small>
      <b-form-input v-model="password2" id="input-password2" type="password" required />
      <b-form-radio v-model="accountType" :options="accountOptions" required>
      </b-form-radio>
      <b-button id="btn-register">Register</b-button>
    </form>
    <b-button id="already-member" variant="link" to="signin">Already a member?</b-button>
  </b-card>
</div>
</template>

<script>
import api from '@/../utils/api';

export default {
  name: 'register',
  data () {
    return {
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
      ]
    };
  },
  methods: {
    comparePasswords() {
      return this.password === this.password2 ? true : false;
    },
    handleRegister() {
      if (!this.comparePasswords()) {
        alert('Your passwords do not match.');
      } else {
        var payload = {
          email: this.email,
          password: this.password,
          accountType: this.accountType,
          memberStart: new Date().toISOString()
        };

        api.post('/users', payload)
          .then((response) => {
            if (response.status === 201) {
              alert('Your account was created successfully!');
            }
          })
          .catch((error) => {
            alert('Account already exists.');
          });
      }
    }
  }
};
</script>

<style scoped>
.register {
  max-width: 330px;
  padding: 60px 15px;
  margin: 0 auto;
}
.card {
  padding: 15px 0px;
  border-color: #cccccc;
  background-color: #f6f6f6;
  height: 420px;
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
  cursor: pointer;
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
