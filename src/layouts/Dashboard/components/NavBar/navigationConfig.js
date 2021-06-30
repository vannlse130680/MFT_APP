/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import HomeIcon from '@material-ui/icons/Home';

import SettingsIcon from '@material-ui/icons/Settings';
import GardenIcon from '@material-ui/icons/Streetview';

import PolicyIcon from '@material-ui/icons/Policy';
import ScheduleIcon from '@material-ui/icons/Event';

import PlantTypeIcon from '@material-ui/icons/Eco';
import ContractIcon from '@material-ui/icons/Assignment';
import VistitIcon from '@material-ui/icons/NaturePeople';
import EqualizerIcon from '@material-ui/icons/Equalizer';
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
        ]
      },
      {
        title: 'Thu hoạch',
        href: '/calendar',
        icon: ScheduleIcon,
        children: [
          {
            title: 'Lịch thu hoạch',
            href: '/calendar/harvest'
          }
        ]
      },
      {
        title: 'Tham quan vuờn',
        href: '/management',
        icon: VistitIcon,
        children: [
          {
            title: 'Yêu cầu',
            href: '/management/visiting'
          },
          {
            title: 'Lịch tham quan vườn',
            href: '/calendar/visit'
          }
        ]
      },
      {
        title: 'Thống kê',
        href: '/report',
        icon: EqualizerIcon,
        
        children: [
          {
            title: 'Sản lượng thu hoạch',
            href: '/report/yield'
          },
          {
            title: 'Hủy hợp đồng',
            href: '/report/cancelContract'
          },
          {
            title: 'Ký kết hợp đồng',
            href: '/report/signContract'
          },
         
        ]
      },
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
          }
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
