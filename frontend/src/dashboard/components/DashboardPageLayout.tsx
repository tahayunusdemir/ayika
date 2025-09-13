import * as React from 'react';
import { Box, Card, CardContent, Typography, SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

interface DashboardPageLayoutProps {
  title: string;
  description: string;
  icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & { muiName: string };
  children: React.ReactNode;
}

const DashboardPageLayout: React.FC<DashboardPageLayoutProps> = ({
  title,
  description,
  icon: IconComponent,
  children,
}) => {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Card sx={{ mb: 3 }} role="banner">
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconComponent
              color="primary"
              sx={{ fontSize: { xs: 32, md: 40 } }}
              aria-hidden="true"
            />
            <Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{ fontSize: { xs: '1.5rem', md: '2.125rem' } }}
                id="page-title"
              >
                {title}
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ mt: 0.5 }}
                aria-describedby="page-title"
              >
                {description}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
      {children}
    </Box>
  );
};

export default DashboardPageLayout;
