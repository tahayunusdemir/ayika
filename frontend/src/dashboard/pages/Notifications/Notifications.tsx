import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';

export default function Notifications() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <NotificationsRoundedIcon color="primary" />
            <Typography variant="h4" component="h1">
              Bildirimler
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Bildirimler sayfası yer tutucusu. Burada bildirim ayarları, geçmiş bildirimler ve bildirim tercihlerinizi yönetebilirsiniz.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
