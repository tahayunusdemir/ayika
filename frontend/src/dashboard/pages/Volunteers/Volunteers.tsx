import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import VolunteerActivismRoundedIcon from '@mui/icons-material/VolunteerActivismRounded';

export default function Volunteers() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <VolunteerActivismRoundedIcon color="primary" />
            <Typography variant="h4" component="h1">
              Volunteers
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Volunteers page placeholder. Here you would manage volunteer information and activities.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
