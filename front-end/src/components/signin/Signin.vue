<template>
<div class='signin'>
  <b-card>
    <form @submit.prevent='handleSignin'>
      <h2>Please sign in</h2>
      <small class='text-muted'>Email</small>
      <b-form-input v-model='email' id='input-email' type='email' required autofocus />
      <small class='text-muted'>Password</small>
      <b-form-input v-model='password' id='input-password' type='password' required />
      <b-form-checkbox v-model='remember' id='remember-me' value=true unchecked-value=false>Remember me</b-form-checkbox>
      <b-button id='btn-signin'>Sign in</b-button>
    </form>
    <b-button id='forgot-password' variant='link' to='forgot-password'>Forgot password?</b-button>
    <hr class='hr-text' data-content='or' />
    <b-button id='create-account' variant='link' to='create-account'>Create an account</b-button>
  </b-card>

  <b-modal id='unauthorized-modal' size='sm' title='Unauthorized'>
    Invalid email/password.
    <footer slot='modal-footer'>
      <b-btn variant='secondary' @click='handleClose("unauthorized-modal")'>OK</b-btn>
    </footer>
  </b-modal>
</div>
</template>

<script>
import { signin } from '@/../utils/auth';
import Router from 'vue-router';
import general from '@/mixins/general';

export default {
  name: 'signin',
  mixins: [
    general
  ],
  data () {

    return {
      email: '',
      password: '',
      remember: false
    };

  },
  methods: {

    /**
     * Handles sign in and routes to dashboard if successful.
     */
    handleSignin() {

      var router = new Router();
      
      signin(this.email, this.password)
        .then((result) => {

          if (result) {
            router.push('/dash');
          } else {
            this.handleOpen('unauthorized-modal');
          }
          
        })
        .catch((error) => {

          console.log('Error signing in: ', error);

        });

    }

  }
};
</script>

<style scoped>
.signin {
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
button {
  cursor: pointer;
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
  border-color: #C8D80D;
}
.custom-checkbox {
  margin-bottom: 10px;
}
#btn-signin {
  color: #ffffff;
  background-color: #C8D80D;
  display: block;
  width: 100%;
}
#btn-signin:hover, #btn-signin:active {
  background-color: #B3C20B;
}
#forgot-password {
  color: #0A3E65;
  padding: 8px 0px;
  font-size: 0.9rem;
}
#create-account {
  color: #0A3E65;
  padding: 8px 0px;
  width: 100%;
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
