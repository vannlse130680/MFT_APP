/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React, { lazy } from 'react';
import { Redirect } from 'react-router-dom';

import AuthLayout from './layouts/Auth';
import ErrorLayout from './layouts/Error';
import DashboardLayout from './layouts/Dashboard';
import DashboardAnalyticsView from './views/DashboardAnalytics';
import DashboardDefaultView from './views/DashboardDefault';
import OverviewView from './views/Overview';
import PresentationView from './views/Presentation';
import GardenPage from 'views/GardenManagement/GardenPage';

import PlantTypePage from 'views/PlantTypeManagement/PlantTypePage';
import GardenDetailPage from 'views/GardenDetailManagement/GardenDetail';
import ContractPage from 'views/ContractManagement/ContractPage';
import ContractInformation from 'views/ContractManagement/components/ContractInfomation/ContractInformation';
import GardenByPlantType from 'views/GardenByPlantType/GardenByPlantType';
import BuyTreePolicy from 'views/BuyTreePolicy/BuyTreePolicy';
import CustomerAccountsPage from 'views/CustomerAccountManagement/CustomerAccountsPage';
import FarmerAccountsPage from 'views/FarmerAccountManagement/FarmerAccountsPage';
import ShippAccountPage from 'views/ShipperAccountsManagement/ShippAccountPage';
import VisitCalendarPage from 'views/VisitCalendar/VisitCalendarPage';
import DeliveryPackage from 'views/DeliveryPackage/DeliveryPackage';
import HarvestCalendarPage from 'views/HarvestCalendar/HarvestCalendarPage';
import CityPage from 'views/CityManagement/CityPage';
import DistrictPage from 'views/DistrictMangement/DistrictPage';
import WardPage from 'views/WardManagement/WardPage';
import CollectSchedulePage from 'views/CollectSchedule/CollectSchedulePage';
import DeliverySchedulePage from 'views/DeliverySchedule/DeliverySchedulePage';
import UpdateSchedule from 'views/UpdateSchedule/UpdateSchedule';
import ScheduleDetail from 'views/ScheduleDetails/ScheduleDetail';

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
        path: '/calendar',
        exact: true,
        component: lazy(() => import('views/Calendar'))
      },
      {
        path: '/changelog',
        exact: true,
        component: lazy(() => import('views/Changelog'))
      },
      {
        path: '/chat',
        exact: true,
        component: lazy(() => import('views/Chat'))
      },
      {
        path: '/chat/:id',
        exact: true,
        component: lazy(() => import('views/Chat'))
      },
      {
        path: '/dashboards/analytics',
        exact: true,
        component: DashboardAnalyticsView
      },
      {
        path: '/dashboards/default',
        exact: true,
        component: DashboardDefaultView
      },
      {
        path: '/invoices/:id',
        exact: true,
        component: lazy(() => import('views/InvoiceDetails'))
      },
      {
        path: '/kanban-board',
        exact: true,
        component: lazy(() => import('views/KanbanBoard'))
      },
      {
        path: '/mail',
        exact: true,
        component: lazy(() => import('views/Mail'))
      },
      {
        path: '/management/customers',
        exact: true,
        component: lazy(() => import('views/CustomerManagementList'))
      },
      {
        path: '/management/customers/:id',
        exact: true,
        component: lazy(() => import('views/CustomerManagementDetails'))
      },
      {
        path: '/management/customers/:id/:tab',
        exact: true,
        component: lazy(() => import('views/CustomerManagementDetails'))
      },
      {
        path: '/management/projects',
        exact: true,
        component: lazy(() => import('views/ProjectManagementList'))
      },
      {
        path: '/management/orders',
        exact: true,
        component: lazy(() => import('views/OrderManagementList'))
      },
      {
        path: '/management/orders/:id',
        exact: true,
        component: lazy(() => import('views/OrderManagementDetails'))
      },
      {
        path: '/overview',
        exact: true,
        component: OverviewView
      },
      {
        path: '/presentation',
        exact: true,
        component: PresentationView
      },
      {
        path: '/profile/:id',
        exact: true,
        component: lazy(() => import('views/Profile'))
      },
      {
        path: '/profile/:id/:tab',
        exact: true,
        component: lazy(() => import('views/Profile'))
      },
      {
        path: '/projects/create',
        exact: true,
        component: lazy(() => import('views/ProjectCreate'))
      },
      {
        path: '/projects/:id',
        exact: true,
        component: lazy(() => import('views/ProjectDetails'))
      },
      {
        path: '/projects/:id/:tab',
        exact: true,
        component: lazy(() => import('views/ProjectDetails'))
      },
      {
        path: '/projects',
        exact: true,
        component: lazy(() => import('views/ProjectList'))
      },
      {
        path: '/settings',
        exact: true,
        component: lazy(() => import('views/Settings'))
      },
      {
        path: '/settings/:tab',
        exact: true,
        component: lazy(() => import('views/Settings'))
      },
      {
        path: '/social-feed',
        exact: true,
        component: lazy(() => import('views/SocialFeed'))
      },
      {
        path: '/getting-started',
        exact: true,
        component: lazy(() => import('views/GettingStarted'))
      },
      {
        path: '/gardenManagement/garden',
        exact: true,
        component: GardenPage
      },
      {
        path: '/gardenManagement/garden/:id',
        exact: true,
        component: GardenDetailPage
      },
      {
        path: '/gardenManagement/garden/:id/:tab',
        exact: true,
        component: lazy(() =>
          import('views/GardenDetailManagement/GardenDetail')
        )
      },
      {
        path: '/tree/:treeId',
        exact: true,
        component: lazy(() =>
          import(
            'views/GardenDetailManagement/TreeManagement/TreePageDetail/TreePageDetail'
          )
        )
      },
      {
        path: '/plantType',
        exact: true,
        component: PlantTypePage
      },
      {
        path: '/plantType/:id',
        exact: true,
        component: GardenByPlantType
      },
      {
        path: '/contract',
        exact: true,
        component: ContractPage
      },
      {
        path: '/contract/:id',
        exact: true,
        component: ContractInformation
      },
      {
        path: '/contract/:id/:tab',
        exact: true,
        component: lazy(() =>
          import(
            'views/ContractManagement/components/ContractInfomation/ContractInformation'
          )
        )
      },

      {
        path: '/contractDetail/:contractId/:id',
        exact: true,
        component: DeliveryPackage
      },
      {
        path: '/policy/tree',
        exact: true,
        component: BuyTreePolicy
      },
      {
        path: '/managementAccount/customers',
        exact: true,
        component: CustomerAccountsPage
      },
      {
        path: '/managementAccount/farmers',
        exact: true,
        component: FarmerAccountsPage
      },
      {
        path: '/managementAccount/shippers',
        exact: true,
        component: ShippAccountPage
      },
      {
        path: '/calendar/visit',
        exact: true,
        component: VisitCalendarPage
      },
      {
        path: '/calendar/harvest',
        exact: true,
        component: HarvestCalendarPage
      },
      {
        path: '/managementAddress/cities',
        exact: true,
        component: CityPage
      },
      {
        path: '/managementAddress/cities/:cityId',
        exact: true,
        component: DistrictPage
      },
      {
        path: '/managementAddress/districts/:districtId',
        exact: true,
        component: WardPage
      },
      {
        path: '/transport/collect',
        exact: true,
        component: CollectSchedulePage
      },

      {
        path: '/transport/delivery',
        exact: true,
        component: DeliverySchedulePage
      },
      {
        path: '/transport/update',
        exact: true,
        component: UpdateSchedule
      },
      {
        path: '/transport/update/:id',
        exact: true,
        component: ScheduleDetail
      },
      {
        component: () => <Redirect to="/errors/error-404" />
      }
    ]
  }
];

export default routes;
