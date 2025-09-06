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
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

const mainListItems = [
  { text: 'Home', icon: <HomeRoundedIcon />, key: 'home' },
  { text: 'Analytics', icon: <AnalyticsRoundedIcon />, key: 'analytics' },
  { text: 'Clients', icon: <PeopleRoundedIcon />, key: 'clients' },
  { text: 'Tasks', icon: <AssignmentRoundedIcon />, key: 'tasks' },
];

const adminListItems = [
  { text: 'Volunteers', icon: <VolunteerActivismRoundedIcon />, key: 'volunteers' },
];

const secondaryListItems = [
  { text: 'Profile', icon: <AccountCircleRoundedIcon />, key: 'profile' },
  { text: 'Notifications', icon: <NotificationsRoundedIcon />, key: 'notifications' },
  { text: 'Settings', icon: <SettingsRoundedIcon />, key: 'settings' },
  { text: 'About', icon: <InfoRoundedIcon />, key: 'about' },
  { text: 'Feedback', icon: <HelpRoundedIcon />, key: 'feedback' },
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

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <Stack sx={{ flexGrow: 1 }}>
        <List dense>
          {mainListItems.map((item, index) => (
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
        <List dense subheader={<ListSubheader>Admin</ListSubheader>}>
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
