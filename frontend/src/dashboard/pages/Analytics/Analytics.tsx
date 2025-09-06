import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';

export default function Analytics() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <AnalyticsRoundedIcon color="primary" />
            <Typography variant="h4" component="h1">
              Analytics
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Analytics dashboard placeholder. Here you would see charts, metrics, and data insights.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
