import * as React from 'react';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import DashboardPageLayout from '../../components/DashboardPageLayout';
import { Box, Typography } from '@mui/material';

export default function Analytics() {
  return (
    <DashboardPageLayout
      title="Analizler"
      description="Analiz panosu yer tutucusu. Burada çizelgeleri, metrikleri ve veri analizlerini görebilirsiniz."
      icon={AnalyticsRoundedIcon}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Analiz Panosu
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Analiz içerikleri burada yer alacaktır. Yakında detaylı raporlar, grafikler ve performans metrikleri eklenecektir.
        </Typography>
      </Box>
    </DashboardPageLayout>
  );
}
