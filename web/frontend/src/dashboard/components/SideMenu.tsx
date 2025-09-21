import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import SitemarkIcon from '../../shared-theme/components/SitemarkIcon';
import MenuContent from './MenuContent';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

interface SideMenuProps {
  selectedPage?: string;
  onPageSelect?: (page: string) => void;
}

export default function SideMenu({ selectedPage, onPageSelect }: SideMenuProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/sign-in', { replace: true });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails, redirect to sign-in
      navigate('/sign-in', { replace: true });
    }
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <SitemarkIcon to="/dashboard" onIconClick={() => onPageSelect && onPageSelect('home')} variant="h3" />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent selectedPage={selectedPage} onPageSelect={onPageSelect} />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ mr: 'auto', display: 'flex', alignItems: 'center' }}>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {user?.volunteer_profile?.full_name || user?.first_name || user?.email || 'Kullanıcı'}
          </Typography>
        </Box>
        <Button onClick={handleLogout} variant="outlined" startIcon={<LogoutRoundedIcon />} color="error">
          Çıkış
        </Button>
      </Stack>
    </Drawer>
  );
}
