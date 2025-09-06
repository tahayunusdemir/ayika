import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';

export default function Profile() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <AccountCircleRoundedIcon color="primary" />
            <Typography variant="h4" component="h1">
              Profil
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Bu, profil bölümü için bir yer tutucu içeriktir.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
