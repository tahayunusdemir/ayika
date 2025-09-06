import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import LockResetIcon from '@mui/icons-material/LockReset';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import PasswordResetDialog from './components/PasswordResetDialog';
import AccountDeleteDialog from './components/AccountDeleteDialog';
import React from 'react';

export default function Profile() {
  // Dummy user data for demonstration
  const userData = {
    firstName: 'Örnek',
    lastName: 'Kullanıcı',
    email: 'ornek@mail.com',
    phoneNumber: '+90 555 123 45 67', // Yeni telefon numarası alanı
    location: 'Istanbul, Turkey',
    joinDate: '2023-01-15',
  };

  const [openPasswordReset, setOpenPasswordReset] = React.useState(false);
  const [openAccountDelete, setOpenAccountDelete] = React.useState(false);

  const handleOpenPasswordReset = () => {
    setOpenPasswordReset(true);
  };

  const handleClosePasswordReset = () => {
    setOpenPasswordReset(false);
  };

  const handleOpenAccountDelete = () => {
    setOpenAccountDelete(true);
  };

  const handleCloseAccountDelete = () => {
    setOpenAccountDelete(false);
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '900px' }, mx: 'auto' }}>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
            <AccountCircleRoundedIcon color="primary" sx={{ fontSize: 40 }} />
            <Typography variant="h4" component="h1">
              Profil
            </Typography>
          </Box>

          <Grid container spacing={4}>
            <Grid size={{ xs: 12, md: 12 }}>
              <Typography variant="h5" component="h2" gutterBottom>
                Kullanıcı Bilgileri
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <FormLabel htmlFor="firstName">Ad</FormLabel>
                    <TextField
                      id="firstName"
                      value={userData.firstName}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <FormLabel htmlFor="lastName">Soyad</FormLabel>
                    <TextField
                      id="lastName"
                      value={userData.lastName}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <FormLabel htmlFor="email">E-posta</FormLabel>
                    <TextField
                      id="email"
                      value={userData.email}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <FormLabel htmlFor="phoneNumber">Telefon</FormLabel>
                    <TextField
                      id="phoneNumber"
                      value={userData.phoneNumber}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <FormLabel htmlFor="location">Konum</FormLabel>
                    <TextField
                      id="location"
                      value={userData.location}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <FormControl fullWidth variant="outlined">
                    <FormLabel htmlFor="joinDate">Katılma Tarihi</FormLabel>
                    <TextField
                      id="joinDate"
                      value={userData.joinDate}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </FormControl>
                </Grid>
              </Grid>

              <Divider sx={{ my: 4 }} />

              <Typography variant="h5" component="h2" gutterBottom>
                Hesap Yönetimi
              </Typography>
              <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleOpenPasswordReset}
                  startIcon={<LockResetIcon />}
                >
                  Şifreyi Sıfırla
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleOpenAccountDelete}
                  startIcon={<DeleteForeverIcon />}
                >
                  Hesabı Sil
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
      <PasswordResetDialog open={openPasswordReset} handleClose={handleClosePasswordReset} />
      <AccountDeleteDialog open={openAccountDelete} handleClose={handleCloseAccountDelete} />
    </Box>
  );
}
