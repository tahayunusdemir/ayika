import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

export default function SitemarkIcon() {
  return (
    <Typography
      component={Link}
      to="/"
      variant="h5"
      sx={{
        mr: 2,
        color: (theme) =>
          theme.palette.mode === 'light' ? 'primary.main' : 'primary.light',
        fontWeight: 'bold',
        textDecoration: 'none',
        '&:hover': {
          opacity: 0.8,
        },
      }}
    >
      Ayika
    </Typography>
  );
}
