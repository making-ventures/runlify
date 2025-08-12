import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../../types'

export const uiLayoutMenuTmpl = (
  _options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import * as React from 'react';
import Box from '@mui/material/Box';
import {hasPermission} from '../utils/permissions';
import {
  DashboardMenuItem,
  useSidebarState,
  usePermissions,
} from 'react-admin';
import getAdditionalMenu from '../adm/getAdditionalMenu';
import defaultMenu from '../adm/getDefaultMenu';
import MenuItem from '../uiLib/menu/MenuItem';

const Menu = () => {
  const [open] = useSidebarState();
  const {permissions} = usePermissions<string[]>();

  const menuData = [
    ...getAdditionalMenu(),
    ...defaultMenu(),
  ];

  return (
    <Box
      sx={{
        width: open ? undefined : 50,
        marginTop: 1,
        marginBottom: 1,
        transition: theme =>
          theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
      }}
    >
      {hasPermission(permissions, 'dashboards.main') && <DashboardMenuItem />}
      {menuData.map((d, i) => (<MenuItem
        key={i}
        {...d}
      />))}
    </Box>
  );
};

export default Menu;
`
