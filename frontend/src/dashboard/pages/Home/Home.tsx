import * as React from 'react';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DashboardPageLayout from '../../components/DashboardPageLayout';
import { Box, Typography } from '@mui/material';

export default function Home() {
  return (
    <DashboardPageLayout
      title="Ana Sayfa"
      description="Kontrol paneli ana sayfasına hoş geldiniz. Bu, ana bölüm için bir yer tutucu içeriktir."
      icon={HomeRoundedIcon}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Kontrol Paneli
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Ana sayfa içerikleri burada yer alacaktır. Yakında özet kartlar, hızlı erişim menüleri ve sistem durumu bilgileri eklenecektir.
        </Typography>
      </Box>
    </DashboardPageLayout>
  );
}
