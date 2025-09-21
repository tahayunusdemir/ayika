import * as React from 'react';
import {
  Box,
  Grid,
  Alert,
  Snackbar,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Fade
} from '@mui/material';
import { AccountCircleRounded as AccountIcon } from '@mui/icons-material';
import DashboardPageLayout from '../../components/DashboardPageLayout';

// Profile components
import PersonalInfo from './components/PersonalInfo';
import AccountSettings from './components/AccountSettings';
import PasswordResetDialog from './components/PasswordResetDialog';
import AccountDeleteDialog from './components/AccountDeleteDialog';

// Hooks
import { useProfile } from './hooks/useProfile';
import { useAccountActions } from './hooks/useAccountActions';

const Profile: React.FC = () => {
  // State for dialogs
  const [openPasswordReset, setOpenPasswordReset] = React.useState(false);
  const [openAccountDelete, setOpenAccountDelete] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string | null>(null);

  // Hooks
  const {
    profile,
    loading: profileLoading,
    error: profileError
  } = useProfile();

  const {
    loading: actionLoading,
    error: actionError,
    formErrors: actionFormErrors,
    changePassword,
    deactivateAccount,
    clearError
  } = useAccountActions();

  // Success handlers
  const handlePasswordChangeSuccess = React.useCallback(() => {
    setSuccessMessage('Şifreniz başarıyla değiştirildi!');
    setOpenPasswordReset(false);
    clearError();
  }, [clearError]);

  const handleAccountDeactivateSuccess = React.useCallback(() => {
    setSuccessMessage('Hesabınız başarıyla deaktif edildi. Yönlendiriliyorsunuz...');
    setOpenAccountDelete(false);
    clearError();
    // Redirect to sign-in after 2 seconds
    setTimeout(() => {
      window.location.href = '/sign-in';
    }, 2000);
  }, [clearError]);

  // Error handling
  if (profileError) {
    return (
      <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {profileError}
        </Alert>
      </Box>
    );
  }

  return (
    <DashboardPageLayout
      title="Profil"
      description="Gönüllü hesap bilgilerinizi görüntüleyin, güvenlik ayarlarınızı yönetin ve afet yardım koordinasyonu için profil bilgilerinizi güncelleyin."
      icon={AccountIcon}
    >
      <Fade in timeout={200}>
        <Grid container spacing={3} columns={12}>
          {/* Personal Information */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardHeader
                title={
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                    Kişisel Bilgiler
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 1 }}>
                {profile && (
                  <PersonalInfo
                    profile={profile}
                    loading={profileLoading}
                  />
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Account Settings */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardHeader
                title={
                  <Typography variant="h6" component="h2" sx={{ fontWeight: 600 }}>
                    Hesap Yönetimi
                  </Typography>
                }
                sx={{ pb: 1 }}
              />
              <CardContent sx={{ pt: 1 }}>
                <AccountSettings
                  loading={actionLoading}
                  onOpenPasswordReset={React.useCallback(() => setOpenPasswordReset(true), [])}
                  onOpenAccountDelete={React.useCallback(() => setOpenAccountDelete(true), [])}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Fade>

      {/* Success Snackbar */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          variant="filled"
          aria-live="polite"
        >
          {successMessage}
        </Alert>
      </Snackbar>

      {/* Password Reset Dialog */}
      <PasswordResetDialog
        open={openPasswordReset}
        loading={actionLoading}
        error={actionError}
        formErrors={actionFormErrors}
        handleClose={() => {
          setOpenPasswordReset(false);
          clearError();
        }}
        onPasswordChange={async (data) => {
          await changePassword(data);
          handlePasswordChangeSuccess();
        }}
        onClearError={clearError}
      />

      {/* Account Delete Dialog */}
      <AccountDeleteDialog
        open={openAccountDelete}
        loading={actionLoading}
        error={actionError}
        handleClose={() => {
          setOpenAccountDelete(false);
          clearError();
        }}
        onAccountDeactivate={async () => {
          await deactivateAccount();
          handleAccountDeactivateSuccess();
        }}
        onClearError={clearError}
      />
    </DashboardPageLayout>
  );
};

export default Profile;