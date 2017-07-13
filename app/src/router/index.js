import Vue from 'vue';
import Router from 'vue-router';
import { requireAuth, requireCoach } from '@/../utils/auth';

import Home from '@/components/navigation/Home';
import About from '@/components/navigation/About';
import PageNotFound from '@/components/navigation/PageNotFound';

import Dashboard from '@/components/dashboard/Dashboard';

import CreateAccount from '@/components/signin/CreateAccount';
import Signin from '@/components/signin/Signin';
import Invitation from '@/components/signin/Invitation';

import Clients from '@/components/clients/Clients';

import Programs from '@/components/programs/Programs';
import CreateProgram from '@/components/programs/CreateProgram';
import UpdateProgram from '@/components/programs/UpdateProgram';
import ViewProgram from '@/components/programs/ViewProgram';

import TrainingLog from '@/components/logs/TrainingLog';

import UserSettings from '@/components/admin/UserSettings';

Vue.use(Router);

export default new Router({
  mode: 'history',
  linkActiveClass: 'active',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/about',
      name: 'About',
      component: About
    },
    {
      path: '/invitation/:invite/',
      name: 'Invitation',
      component: Invitation
    },
    {
      path: '/create-account',
      name: 'Create an account',
      component: CreateAccount
    },
    {
      path: '/signin',
      name: 'Sign in',
      component: Signin
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      beforeEnter: requireAuth,
      component: Dashboard
    },
    {
      path: '/clients',
      name: 'Clients',
      beforeEnter: requireCoach,
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
      beforeEnter: requireCoach,
      component: CreateProgram
    },
    {
      path: '/update-program',
      name: 'Update program',
      beforeEnter: requireCoach,
      component: UpdateProgram
    },
    {
      path: '/view-program',
      name: 'View program',
      beforeEnter: requireAuth,
      component: ViewProgram
    },
    {
      path: '/training-log',
      name: 'Training log',
      beforeEnter: requireAuth,
      component: TrainingLog
    },
    {
      path: '/settings',
      name: 'User settings',
      beforeEnter: requireAuth,
      component: UserSettings
    },
    {
      path: '*',
      name: 'Page not found',
      component: PageNotFound
    }
  ]
});
