import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';

export default function About() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <InfoRoundedIcon color="primary" />
            <Typography variant="h4" component="h1">
              Hakkımızda
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Hakkımızda sayfası yer tutucusu. Burada uygulamanız veya şirketiniz hakkında bilgi görüntüleyebilirsiniz.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
