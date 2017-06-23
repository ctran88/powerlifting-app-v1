<template>
<div class="signin">
  <b-card>
    <form @submit.prevent="handleSignin">
      <h2>Please sign in</h2>
      <b-form-input v-model="email" id="input-email" type="email" placeholder="Email" required autofocus></b-form-input>
      <b-form-input v-model="password" id="input-password" type="password" placeholder="Password" required></b-form-input>
      <b-form-checkbox v-model="remember" id="remember-me" value=true unchecked-value=false>Remember me</b-form-checkbox>
      <b-button id="btn-signin">Sign in</b-button>
    </form>
    <b-button id="forgot-password" variant="link" to="forgot-password">Forgot your password?</b-button>
  </b-card>
</div>
</template>

<script>
import { signin } from '@/../utils/auth';

export default {
  name: 'signin',
  data () {
    return {
      email: '',
      password: '',
      remember: false
    };
  },
  methods: {
    handleSignin() {
      signin(this.email, this.password);
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
  padding: 15px 0px;
  border-color: #cccccc;
  background-color: #f6f6f6;
  height: 300px;
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
}
.form-control:focus {
  z-index: 2;
  border-color: #C8D80D;
}
#input-email {
  margin-bottom: -1px;
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
}
#input-password {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.custom-checkbox {
  margin-bottom: 10px;
}
#btn-signin {
  color: #ffffff;
  background-color: #C8D80D;
  display: block;
  width: 100%;
  cursor: pointer;
}
#btn-signin:hover, #btn-signin:active {
  background-color: #B3C20B;
}
#forgot-password {
  color: #0A3E65;
  padding: 8px 0px;
  font-size: 0.9rem;
}
</style>
