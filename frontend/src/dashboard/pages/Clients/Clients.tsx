import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';

export default function Clients() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PeopleRoundedIcon color="primary" />
            <Typography variant="h4" component="h1">
              Clients
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Client management placeholder. Here you would manage your clients and customer data.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
