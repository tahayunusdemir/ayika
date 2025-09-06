import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';

export default function Home() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <HomeRoundedIcon color="primary" />
            <Typography variant="h4" component="h1">
              Home
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Welcome to the dashboard home page. This is a placeholder content for the home section.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
