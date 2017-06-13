import Vue from 'vue';
import Router from 'vue-router';
import Landing from '@/components/Landing';
import Hello from '@/components/Hello';
import Dash from '@/components/Dash';
import Cookie from '@/components/Cookie';
import Signin from '@/components/Signin';
import { requireAuth } from '@/../utils/auth';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Landing
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    },
    {
      path: '/dash',
      name: 'Dashboard',
      beforeEnter: requireAuth,
      component: Dash
    },
    {
      path: '/cookie',
      name: 'Cookie',
      component: Cookie
    },
    {
      path: '/signin',
      name: 'Sign in',
      component: Signin
    }
  ],
  linkActiveClass: 'active'
});
