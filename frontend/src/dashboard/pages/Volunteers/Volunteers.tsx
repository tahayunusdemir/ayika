import * as React from 'react';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import DashboardPageLayout from '../../components/DashboardPageLayout';
import { Box, Typography } from '@mui/material';

const Volunteers = () => {
  return (
    <DashboardPageLayout
      title="Gönüllüler"
      description="Gönüllü bilgilerini ve etkinliklerini yönetebileceğiniz kapsamlı platform. Burada gönüllü kayıtları, görevlendirmeler ve performans takibi yapabilirsiniz."
      icon={PeopleRoundedIcon}
    >
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Gönüllü Yönetim Sistemi
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Gönüllü yönetim sistemi içeriği burada yer alacaktır. Yakında gönüllü listesi, kayıt formu ve detaylı raporlama özellikleri eklenecektir.
        </Typography>
      </Box>
    </DashboardPageLayout>
  );
};

export default Volunteers;
