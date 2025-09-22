import * as React from 'react';
import type {} from '@mui/x-date-pickers/themeAugmentation';
import type {} from '@mui/x-charts/themeAugmentation';
import type {} from '@mui/x-data-grid/themeAugmentation';
import type {} from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import AppNavbar from './components/AppNavbar';
import Header from './components/Header';
import SideMenu from './components/SideMenu';
import AppTheme from '../shared-theme/AppTheme';
import Home from './pages/Home/Home';
import Analytics from './pages/Analytics/Analytics';
import { default as Volunteers } from './pages/Volunteers/Volunteers';
import Profile from './pages/Profile/Profile';
import Shipments from './pages/Shipments/Shipments';
import { useAuth } from '../contexts/AuthContext';
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
  shipments: { component: Shipments, breadcrumb: [{ label: 'Kargo Yönetimi', active: true }] },
  profile: { component: Profile, breadcrumb: [{ label: 'Profil', active: true }] },
};

export default function Dashboard(props: { disableCustomTheme?: boolean }) {
  const [selectedPage, setSelectedPage] = React.useState<string>('home');
  const { user } = useAuth();
  const isAdmin = user?.is_admin || false;
  
  const handlePageSelect = (page: string) => {
    // Check if user is trying to access admin pages
    const adminPages = ['volunteers', 'shipments', 'analytics'];
    if (adminPages.includes(page) && !isAdmin) {
      // Redirect to home if not admin
      setSelectedPage('home');
      return;
    }
    setSelectedPage(page);
  };

  const currentPageConfig = pageConfig[selectedPage as keyof typeof pageConfig] || pageConfig.home;
  const PageComponent = currentPageConfig.component;

  // If user is trying to access admin page but is not admin, show access denied
  const adminPages = ['volunteers', 'shipments', 'analytics'];
  if (adminPages.includes(selectedPage) && !isAdmin) {
    return (
      <AppTheme {...props} themeComponents={xThemeComponents}>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex' }}>
          <SideMenu selectedPage="home" onPageSelect={handlePageSelect} />
          <AppNavbar selectedPage="home" onPageSelect={handlePageSelect} />
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: theme.vars
                ? `rgba(${theme.vars.palette.background.defaultChannel} / 1)`
                : alpha(theme.palette.background.default, 1),
              overflow: 'auto',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '100vh',
            })}
          >
            <Box sx={{ textAlign: 'center', p: 4 }}>
              <Typography variant="h4" color="error" gutterBottom>
                Erişim Reddedildi
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Bu sayfaya erişim için yönetici yetkilerine sahip olmanız gerekiyor.
              </Typography>
            </Box>
          </Box>
        </Box>
      </AppTheme>
    );
  }

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
            />
            <PageComponent />
          </Stack>
        </Box>
      </Box>
    </AppTheme>
  );
}
