import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';

export default function Tasks() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <AssignmentRoundedIcon color="primary" />
            <Typography variant="h4" component="h1">
              Tasks
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Task management placeholder. Here you would manage your tasks and assignments.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
