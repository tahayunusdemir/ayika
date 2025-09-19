import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

interface MenuItem {
  text: string;
  icon: React.ReactElement;
  key: string;
  isExternal?: boolean;
  url?: string;
}

const mainListItems: MenuItem[] = [
  { text: 'Ana Sayfa', icon: <HomeRoundedIcon />, key: 'home' },
];

const adminListItems: MenuItem[] = [
  { text: 'Gönüllüler', icon: <PeopleRoundedIcon />, key: 'volunteers' },
  { text: 'Analizler', icon: <AnalyticsRoundedIcon />, key: 'analytics' },
];

const secondaryListItems: MenuItem[] = [
  { text: 'Profil', icon: <AccountCircleRoundedIcon />, key: 'profile' },
  { text: 'Bildirimler', icon: <NotificationsIcon />, key: 'notifications' },
  { text: 'İletişim', icon: <ContactSupportIcon />, key: 'contact', isExternal: true, url: 'https://forms.gle/SqSKAGdtF6CoU1Jd8' },
];

interface MenuContentProps {
  selectedPage?: string;
  onPageSelect?: (page: string) => void;
}

export default function MenuContent({ selectedPage = 'home', onPageSelect }: MenuContentProps) {
  const handleItemClick = (key: string) => {
    if (onPageSelect) {
      onPageSelect(key);
    }
  };

  const handleExternalLinkClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <Stack sx={{ flexGrow: 1 }}>
        <List dense>
          {mainListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton 
                selected={selectedPage === item.key}
                onClick={() => {
                  if (item.isExternal && item.url) {
                    handleExternalLinkClick(item.url);
                  } else {
                    handleItemClick(item.key);
                  }
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List dense subheader={<ListSubheader>Yönetici</ListSubheader>}>
          {adminListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                selected={selectedPage === item.key}
                onClick={() => handleItemClick(item.key)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Stack>
      <List dense>
        {secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton
              selected={selectedPage === item.key}
              onClick={() => {
                if (item.isExternal && item.url) {
                  handleExternalLinkClick(item.url);
                } else {
                  handleItemClick(item.key);
                }
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
