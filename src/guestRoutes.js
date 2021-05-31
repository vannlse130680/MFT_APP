/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';
import OverviewView from './views/Overview';
import DashboardLayout from './layouts/Dashboard';
import AuthLayout from './layouts/Auth';
import ErrorLayout from './layouts/Error';


const routes = [
  {
    path: '/',
    exact: true,
    component: () => <Redirect to="/overview" />
    
  },
  
  
  {
    path: '/auth',
    component: AuthLayout,
    routes: [
      {
        path: '/auth/login',
        exact: true,
        component: lazy(() => import('views/Login'))
      },
      {
        path: '/auth/register',
        exact: true,
        component: lazy(() => import('views/Register'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  },
  {
    path: '/errors',
    component: ErrorLayout,
    routes: [
      {
        path: '/errors/error-401',
        exact: true,
        component: lazy(() => import('views/Error401'))
      },
      {
        path: '/errors/error-404',
        exact: true,
        component: lazy(() => import('views/Error404'))
      },
      {
        path: '/errors/error-500',
        exact: true,
        component: lazy(() => import('views/Error500'))
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]

  },
  {
    route: '*',
    component: DashboardLayout,
    routes: [
      
      {
        path: '/overview',
        exact: true,
        component: OverviewView
      },
      
    ]
  }
  
];

export default routes;
