import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Register from '@/components/signin/Register';
import Signin from '@/components/signin/Signin';
import Dash from '@/components/Dash';
import Clients from '@/components/clients/Clients';
import Programs from '@/components/programs/Programs';
import CreateProgram from '@/components/programs/CreateProgram';
import UpdateProgram from '@/components/programs/UpdateProgram';
import PageNotFound from '@/components/navigation/PageNotFound';
import { requireAuth } from '@/../utils/auth';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/signin',
      name: 'Sign in',
      component: Signin
    },
    {
      path: '/dash',
      name: 'Dashboard',
      beforeEnter: requireAuth,
      component: Dash
    },
    {
      path: '/clients',
      name: 'Clients',
      beforeEnter: requireAuth,
      component: Clients
    },
    {
      path: '/programs',
      name: 'Programs',
      beforeEnter: requireAuth,
      component: Programs
    },
    {
      path: '/create-program',
      name: 'Create program',
      beforeEnter: requireAuth,
      component: CreateProgram
    },
    {
      path: '/update-program',
      name: 'Update program',
      beforeEnter: requireAuth,
      component: UpdateProgram
    },
    {
      path: '*',
      name: 'Page not found',
      component: PageNotFound
    }
  ],
  linkActiveClass: 'active'
});
