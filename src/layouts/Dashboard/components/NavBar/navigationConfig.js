/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import HomeIcon from '@material-ui/icons/HomeOutlined';
import PlantTypeIcon from '@material-ui/icons/NaturePeopleOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import GardenIcon from '@material-ui/icons/Streetview';
import ContractIcon from '@material-ui/icons/SupervisedUserCircle';
import PolicyIcon from '@material-ui/icons/Policy';

export default [
  {
    title: 'Trang',
    pages: [
      {
        title: 'Trang chủ',
        href: '/overview',
        icon: HomeIcon
      },
      {
        title: 'Loại cây trồng',
        href: '/plantType',
        icon: PlantTypeIcon,
        children: [
          {
            title: 'Loại cây',
            href: '/plantType'
          }
        ]
      },

      {
        title: 'Quản lý vườn',
        href: '/gardenManagement',
        icon: GardenIcon,
        children: [
          {
            title: 'Vườn',
            href: '/gardenManagement/garden'
          }
          // {
          //   title: 'Cây',
          //   href: '/dashboards/analytics',

          // }
        ]
      },
      {
        title: 'Quản lý hợp đồng',
        href: '/contract',
        icon: ContractIcon,
        children: [
          {
            title: 'Hợp đồng',
            href: '/contract'
          }
          // {
          //   title: 'Cây',
          //   href: '/dashboards/analytics',

          // }
        ]
      },

      // {
      //   title: 'Vườn',
      //   href: '/garden',
      //   icon: GardenIcon
      // },
      // {
      //   title: 'Cây',
      //   href: '/tree',
      //   icon: TreeIcon
      // },
      // {
      //   title: 'Profile',
      //   href: '/profile',
      //   icon: PersonIcon,
      //   children: [
      //     {
      //       title: 'Timeline',
      //       href: '/profile/1/timeline'
      //     },
      //     {
      //       title: 'Connections',
      //       href: '/profile/1/connections'
      //     },
      //     {
      //       title: 'Projects',
      //       href: '/profile/1/projects'
      //     },
      //     {
      //       title: 'Reviews',
      //       href: '/profile/1/reviews'
      //     }
      //   ]
      // },
      // {
      //   title: 'Management',
      //   href: '/management',
      //   icon: BarChartIcon,
      //   children: [
      //     {
      //       title: 'Customers',
      //       href: '/management/customers'
      //     },
      //     {
      //       title: 'Customer Details',
      //       href: '/management/customers/1/summary'
      //     },
      //     {
      //       title: 'Projects',
      //       href: '/management/projects'
      //     },
      //     {
      //       title: 'Orders',
      //       href: '/management/orders'
      //     },
      //     {
      //       title: 'Order Details',
      //       href: '/management/orders/1'
      //     }
      //   ]
      // },
      // {
      //   title: 'Social Feed',
      //   href: '/social-feed',
      //   icon: PeopleIcon
      // },

      // {
      //   title: 'Project',
      //   href: '/projects',
      //   icon: FolderIcon,
      //   children: [
      //     {
      //       title: 'Browse',
      //       href: '/projects'
      //     },
      //     {
      //       title: 'Create',
      //       href: '/projects/create'
      //     },
      //     {
      //       title: 'Overview',
      //       href: '/projects/1/overview'
      //     },
      //     {
      //       title: 'Files',
      //       href: '/projects/1/files'
      //     },
      //     {
      //       title: 'Activity',
      //       href: '/projects/1/activity'
      //     },
      //     {
      //       title: 'Subscribers',
      //       href: '/projects/1/subscribers'
      //     }
      //   ]
      // },
      // {
      //   title: 'Invoice',
      //   href: '/invoices/1',
      //   icon: ReceiptIcon
      // },
      // {
      //   title: 'Kanban Board',
      //   href: '/kanban-board',
      //   icon: ListAltIcon
      // },
      // {
      //   title: 'Mail',
      //   href: '/mail',
      //   icon: MailIcon,
      //   label: () => (
      //     <Label color={colors.red[500]} shape="rounded">
      //       2
      //     </Label>
      //   )
      // },
      // {
      //   title: 'Chat',
      //   href: '/chat',
      //   icon: ChatIcon,
      //   label: () => (
      //     <Label color={colors.red[500]} shape="rounded">
      //       4
      //     </Label>
      //   )
      // },
      // {
      //   title: 'Calendar',
      //   href: '/calendar',
      //   icon: CalendarTodayIcon,
      //   label: () => <Label color={colors.green[500]}>New</Label>
      // },
      {
        title: 'Cài đặt',
        href: '/settings',
        icon: SettingsIcon,
        children: [
          {
            title: 'Thông tin cá nhân',
            href: '/settings/general'
          },
          // {
          //   title: 'Subscription',
          //   href: '/settings/subscription'
          // },
          // {
          //   title: 'Notifications',
          //   href: '/settings/notifications'
          // },
          {
            title: 'Bảo mật',
            href: '/settings/security'
          }
        ]
      },
      {
        title: 'Chính sách',
        href: '/policy',
        icon: PolicyIcon,
        children: [
          {
            title: 'Mua bán cây',
            href: '/policy/tree'
          },
          // {
          //   title: 'Subscription',
          //   href: '/settings/subscription'
          // },
          // {
          //   title: 'Notifications',
          //   href: '/settings/notifications'
          // },
          // {
          //   title: 'Bảo mật',
          //   href: '/settings/security'
          // }
        ]
      }
      // {
      //   title: 'Authentication',
      //   href: '/auth',
      //   icon: LockOpenIcon,
      //   children: [
      //     {
      //       title: 'Login',
      //       href: '/auth/login'
      //     },
      //     {
      //       title: 'Register',
      //       href: '/auth/register'
      //     }
      //   ]
      // },
      // {
      //   title: 'Errors',
      //   href: '/errors',
      //   icon: ErrorIcon,
      //   children: [
      //     {
      //       title: 'Error 401',
      //       href: '/errors/error-401'
      //     },
      //     {
      //       title: 'Error 404',
      //       href: '/errors/error-404'
      //     },
      //     {
      //       title: 'Error 500',
      //       href: '/errors/error-500'
      //     }
      //   ]
      // }
    ]
  }
  // {
  //   title: 'Support',
  //   pages: [
  //     {
  //       title: 'Presentation',
  //       href: '/presentation',
  //       icon: PresentToAllIcon
  //     },
  //     {
  //       title: 'Getting started',
  //       href: '/getting-started',
  //       icon: CodeIcon
  //     },
  //     {
  //       title: 'Changelog',
  //       href: '/changelog',
  //       icon: ViewModuleIcon,
  //       label: () => <Label color={colors.blue['500']}>v1.2.0</Label>
  //     }
  //   ]
  // }
];
