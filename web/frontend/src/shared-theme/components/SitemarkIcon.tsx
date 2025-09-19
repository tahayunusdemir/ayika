import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

interface SitemarkIconProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  to?: string;
  onIconClick?: () => void;
}

export default function SitemarkIcon({ variant = 'h5', to = '/', onIconClick }: SitemarkIconProps) {
  return (
    <Typography
      component={Link}
      to={to}
      onClick={onIconClick}
      variant={variant}
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
