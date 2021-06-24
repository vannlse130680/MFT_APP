/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import BarChartIcon from '@material-ui/icons/BarChart';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import MapIcon from '@material-ui/icons/Map';

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
        title: 'Quản lý tài khoản',
        href: '/managementAccount',
        icon: BarChartIcon,
        children: [
          {
            title: 'Nông dân',
            href: '/managementAccount/farmers'
          },
          {
            title: 'Khách hàng',
            href: '/managementAccount/customers'
          },
          {
            title: 'Giao hàng',
            href: '/managementAccount/shippers'
          }
        ]
      },
      {
        title: 'Quản lý địa chỉ',
        href: '/managementAddress',
        icon: MapIcon,
        children: [
          {
            title: 'Địa chỉ',
            href: '/managementAccount/farmers'
          },
          {
            title: 'Khách hàng',
            href: '/managementAccount/customers'
          },
          {
            title: 'Giao hàng',
            href: '/managementAccount/shippers'
          }
        ]
      },

      {
        title: 'Cài đặt',
        href: '/settings',
        icon: SettingsIcon,
        children: [
          {
            title: 'Tổng quát',
            href: '/settings/general'
          },

          {
            title: 'Bảo mật',
            href: '/settings/security'
          }
        ]
      }
    ]
  }
];
