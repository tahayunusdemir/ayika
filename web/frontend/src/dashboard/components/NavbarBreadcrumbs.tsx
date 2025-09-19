import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

interface BreadcrumbItem {
  label: string;
  active?: boolean;
}

interface NavbarBreadcrumbsProps {
  breadcrumbs?: BreadcrumbItem[];
}

export default function NavbarBreadcrumbs({ breadcrumbs = [{ label: 'Home', active: true }] }: NavbarBreadcrumbsProps) {
  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      <Typography variant="body1">Dashboard</Typography>
      {breadcrumbs.map((item, index) => (
        <Typography 
          key={index}
          variant="body1" 
          sx={{ 
            color: item.active ? 'text.primary' : 'text.secondary', 
            fontWeight: item.active ? 600 : 400 
          }}
        >
          {item.label}
        </Typography>
      ))}
    </StyledBreadcrumbs>
  );
}
