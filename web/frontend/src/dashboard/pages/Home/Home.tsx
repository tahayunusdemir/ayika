import * as React from 'react';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import DashboardPageLayout from '../../components/DashboardPageLayout';
import { Box, Typography } from '@mui/material';

export default function Home() {
  return (
    <DashboardPageLayout
      title="Ana Sayfa"
      description="Acil Yardım ve İhtiyaç Koordinasyon Ağı kontrol paneline hoş geldiniz."
      icon={HomeRoundedIcon}
    >
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 3 }}>
          Hoş Geldiniz
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Acil Yardım ve İhtiyaç Koordinasyon Ağı
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
          Bu sistem, afet yardımlarının daha hızlı, verimli ve etkili bir şekilde dağıtılmasını sağlamak amacıyla geliştirilmiştir. 
          Gönüllü koordinasyonu, stok yönetimi ve lojistik süreçleri için kapsamlı bir çözüm sunar.
        </Typography>
      </Box>
    </DashboardPageLayout>
  );
}
