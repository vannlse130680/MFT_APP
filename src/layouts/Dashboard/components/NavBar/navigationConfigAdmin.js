/* eslint-disable react/no-multi-comp */
/* eslint-disable react/display-name */
import React from 'react';
import { colors } from '@material-ui/core';
import BarChartIcon from '@material-ui/icons/BarChart';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import ChatIcon from '@material-ui/icons/ChatOutlined';
import CodeIcon from '@material-ui/icons/Code';
import DashboardIcon from '@material-ui/icons/DashboardOutlined';
import ErrorIcon from '@material-ui/icons/ErrorOutline';
import FolderIcon from '@material-ui/icons/FolderOutlined';
import HomeIcon from '@material-ui/icons/HomeOutlined';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LockOpenIcon from '@material-ui/icons/LockOpenOutlined';
import MailIcon from '@material-ui/icons/MailOutlined';
import PresentToAllIcon from '@material-ui/icons/PresentToAll';
import PeopleIcon from '@material-ui/icons/PeopleOutlined';
import PersonIcon from '@material-ui/icons/PersonOutlined';
import ReceiptIcon from '@material-ui/icons/ReceiptOutlined';
import SettingsIcon from '@material-ui/icons/SettingsOutlined';
import ViewModuleIcon from '@material-ui/icons/ViewModule';
import GardenIcon from '@material-ui/icons/Streetview';
import TreeIcon from '@material-ui/icons/LocalFloristOutlined';
import PlantTypeIcon from '@material-ui/icons/NaturePeopleOutlined';

import { Label } from 'components';

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
