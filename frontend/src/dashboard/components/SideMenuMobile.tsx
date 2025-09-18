import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import Drawer, { drawerClasses } from '@mui/material/Drawer';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import MenuButton from './MenuButton';
import MenuContent from './MenuContent';

interface SideMenuMobileProps {
  open: boolean | undefined;
  toggleDrawer: (newOpen: boolean) => () => void;
  selectedPage?: string;
  onPageSelect?: (page: string) => void;
}

export default function SideMenuMobile({ open, toggleDrawer, selectedPage, onPageSelect }: SideMenuMobileProps) {
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
              Örnek Kullanıcı
            </Typography>
          </Stack>
          <MenuButton showBadge>
            <NotificationsRoundedIcon />
          </MenuButton>
        </Stack>
        <Divider />
        <Stack sx={{ flexGrow: 1 }}>
          <MenuContent selectedPage={selectedPage} onPageSelect={onPageSelect} />
          <Divider />
        </Stack>
        <Stack sx={{ p: 2 }}>
          <Button component={Link} to="/sign-in" variant="outlined" fullWidth startIcon={<LogoutRoundedIcon />}>
            Çıkış
          </Button>
        </Stack>
      </Stack>
    </Drawer>
  );
}
