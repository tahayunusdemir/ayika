import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';

const Volunteers = () => {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <PeopleRoundedIcon color="primary" />
            <Typography variant="h4" component="h1">
              Gönüllüler
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Gönüllüler sayfası yer tutucusu. Burada gönüllü bilgilerini ve etkinliklerini yönetebilirsiniz.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Volunteers;
