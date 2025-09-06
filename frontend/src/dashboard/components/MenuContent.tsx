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
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

const mainListItems = [
  { text: 'Ana Sayfa', icon: <HomeRoundedIcon />, key: 'home' },
  { text: 'Geri Bildirim', icon: <HelpRoundedIcon />, key: 'feedback', isExternal: true, url: 'https://forms.gle/SqSKAGdtF6CoU1Jd8' },
];

const adminListItems = [
  { text: 'Gönüllüler', icon: <PeopleRoundedIcon />, key: 'volunteers' },
  { text: 'Analizler', icon: <AnalyticsRoundedIcon />, key: 'analytics' },
];

const secondaryListItems = [
  { text: 'Profil', icon: <AccountCircleRoundedIcon />, key: 'profile' },
  { text: 'Bildirimler', icon: <NotificationsIcon />, key: 'notifications' },
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
              onClick={() => handleItemClick(item.key)}
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
