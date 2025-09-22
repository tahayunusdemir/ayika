import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import MenuButton from './MenuButton';
import MenuContent from './MenuContent';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
  selectedPage?: string;
  onPageSelect?: (page: string) => void;
}

export default function SideMenuMobile({ open, toggleDrawer, selectedPage, onPageSelect }: SideMenuMobileProps) {
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
      anchor="right"
      open={open}
      onClose={toggleDrawer(false)}
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        [`& .${drawerClasses.paper}`]: {
          backgroundImage: 'none',
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Stack
        sx={{
          maxWidth: '70dvw',
          height: '100%',
        }}
      >
        <Stack direction="row" sx={{ p: 2, pb: 0, gap: 1 }}>
          <Stack
            direction="row"
            sx={{ gap: 1, alignItems: 'center', flexGrow: 1, p: 1 }}
          >
            <Typography variant="body1" sx={{ fontWeight: 500 }}>
              {user?.volunteer_profile?.full_name || user?.first_name || user?.email || 'Kullanıcı'}
            </Typography>
          </Stack>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent selectedPage={selectedPage} onPageSelect={onPageSelect} />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <Button onClick={handleLogout} variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />}>
            Çıkış
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
