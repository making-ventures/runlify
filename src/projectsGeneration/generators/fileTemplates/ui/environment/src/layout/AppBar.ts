import {
  BootstrapEntityOptions,
  defaultBootstrapEntityOptions,
} from '../../../../../../types'
import { generatedWarning } from '../../../../../../utils'

export const uiLayoutAppBarTmpl = (
  options: BootstrapEntityOptions = defaultBootstrapEntityOptions
) => `import * as React from 'react';
import {AppBar as RaAppBar${options.themesEnabled ? `, ToggleThemeButton` : ''}, LocalesMenuButton, useI18nProvider} from 'react-admin';
import {Box, Typography} from '@mui/material';
import {Link} from 'react-router-dom';${options.themesEnabled ? (`
import {darkTheme, lightTheme} from './themes';`) : ''}
import UserMenu from './UserMenu/UserMenu';
import useMediaQuery from '@mui/material/useMediaQuery';
import {Theme} from '@mui/system';
${
  options.skipWarningThisIsGenerated
    ? ''
    : `
// ${generatedWarning}
`
}
const AppBar = (props: any) => {
  const wide = useMediaQuery((theme: Theme) => theme.breakpoints.up('sm'));
  const {locales} = useI18nProvider();

  return (
    <RaAppBar
      sx={{
        '& .RaAppBar-title': {
          flex: 1,
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
        },
      }}
      {...props}
      elevation={1}
      color='secondary'
      userMenu={<UserMenu />}
    >
      <Typography
        variant='h6'
        color='inherit'
        id='react-admin-title'
      />
      <Box flex={1} />
      {wide && (
        <Typography
          sx={{color: ${options.mainColorOfAppTitile ? `'primary.main'` : `'text.main'`}}}
          color='inherit'
          id='react-admin-title'
          variant='h6'
        >
          <Link
            to='/'
            style={{textDecoration: 'none', color: 'inherit'}}
          >
            ${options.projectName}
          </Link>
        </Typography>
      )}
      <Box flex={1} />${options.themesEnabled ? (`
      <ToggleThemeButton
        lightTheme={lightTheme}
        darkTheme={darkTheme}
      />`) : ''}$
      {wide && locales.length > 1 && <LocalesMenuButton />}
    </RaAppBar>
  );
};

export default AppBar;
`
