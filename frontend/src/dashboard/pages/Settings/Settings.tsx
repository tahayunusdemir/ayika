import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';

export default function Settings() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <SettingsRoundedIcon color="primary" />
            <Typography variant="h4" component="h1">
              Settings
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Settings page placeholder. Here you would configure application settings.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
