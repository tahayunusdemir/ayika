import * as React from 'react';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import Home from './pages/Home/Home';
import Analytics from './pages/Analytics/Analytics';
import { default as Volunteers } from './pages/Volunteers/Volunteers';
import Profile from './pages/Profile/Profile';
import Notifications from './pages/Notifications/Notifications';
import {
  chartsCustomizations,
  dataGridCustomizations,
  datePickersCustomizations,
  treeViewCustomizations,
} from './theme/customizations';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

const pageConfig = {
  home: { component: Home, breadcrumb: [{ label: 'Ana Sayfa', active: true }] },
  analytics: { component: Analytics, breadcrumb: [{ label: 'Analizler', active: true }] },
  volunteers: { component: Volunteers, breadcrumb: [{ label: 'Gönüllüler', active: true }] },
  profile: { component: Profile, breadcrumb: [{ label: 'Profil', active: true }] },
  notifications: { component: Notifications, breadcrumb: [{ label: 'Bildirimler', active: true }] },
};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  const [selectedPage, setSelectedPage] = React.useState<string>('home');
  
  const handlePageSelect = (page: string) => {
    setSelectedPage(page);
  };

  const currentPageConfig = pageConfig[selectedPage as keyof typeof pageConfig] || pageConfig.home;
  const PageComponent = currentPageConfig.component;

  return (
    <AppTheme {...props} themeComponents={xThemeComponents}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: 'flex' }}>
        <SideMenu selectedPage={selectedPage} onPageSelect={handlePageSelect} />
        <AppNavbar selectedPage={selectedPage} onPageSelect={handlePageSelect} />
        {/* Main content */}
        <Box
          component="main"
          sx={(theme) => ({
            flexGrow: 1,
            backgroundColor: theme.vars
              ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
              : alpha(theme.palette.background.default, 1),
            overflow: 'auto',
          })}
        >
          <Stack
            spacing={2}
            sx={{
              alignItems: 'center',
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >
            <Header 
              breadcrumbs={currentPageConfig.breadcrumb} 
              onPageSelect={handlePageSelect}
            />
            <PageComponent />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
