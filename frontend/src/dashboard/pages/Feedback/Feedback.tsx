import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';

export default function Feedback() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <HelpRoundedIcon color="primary" />
            <Typography variant="h4" component="h1">
              Feedback
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Feedback page placeholder. Here you would collect user feedback and support requests.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
