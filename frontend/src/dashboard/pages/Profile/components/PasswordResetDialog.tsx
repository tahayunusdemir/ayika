import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  FormLabel,
  Alert,
  Box,
  LinearProgress,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  InputAdornment,
  Card,
  CardContent,
  Fade
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Check as CheckIcon,
  Close as CloseIcon,
  Security as SecurityIcon
} from '@mui/icons-material';
import { PasswordChangeData, ProfileFormErrors } from '../types/profile.types.ts';

interface PasswordResetDialogProps {
  open: boolean;
  loading: boolean;
  error: string | null;
  formErrors: ProfileFormErrors;
  handleClose: () => void;
  onPasswordChange: (data: PasswordChangeData) => Promise<void>;
  onClearError: () => void;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: 'error' | 'warning' | 'info' | 'success';
}

export default function PasswordResetDialog({ 
  open, 
  loading,
  error,
  formErrors,
  handleClose,
  onPasswordChange,
  onClearError
}: PasswordResetDialogProps) {
  const [formData, setFormData] = React.useState<PasswordChangeData>({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [showPasswords, setShowPasswords] = React.useState({
    current: false,
    new: false,
    confirm: false
  });

  // Password strength calculation
  const calculatePasswordStrength = React.useCallback((password: string): PasswordStrength => {
    let score = 0;
    const feedback: string[] = [];

    if (password.length >= 8) score += 1;
    else feedback.push('En az 8 karakter');

    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('Küçük harf');

    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('Büyük harf');

    if (/\d/.test(password)) score += 1;
    else feedback.push('Rakam');

    if (/[@$!%*?&]/.test(password)) score += 1;
    else feedback.push('Özel karakter (@$!%*?&)');

    let color: 'error' | 'warning' | 'info' | 'success' = 'error';
    if (score >= 4) color = 'success';
    else if (score >= 3) color = 'info';
    else if (score >= 2) color = 'warning';

    return { score, feedback, color };
  }, []);

  const passwordStrength = React.useMemo(
    () => calculatePasswordStrength(formData.newPassword),
    [calculatePasswordStrength, formData.newPassword]
  );

  const handleInputChange = React.useCallback((field: keyof PasswordChangeData) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData((prev: PasswordChangeData) => ({
      ...prev,
      [field]: event.target.value
    }));
    
    if (error) {
      onClearError();
    }
  }, [error, onClearError]);

  const togglePasswordVisibility = React.useCallback((field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    try {
      await onPasswordChange(formData);
      // Reset form and close dialog on success
      setFormData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
      handleClose();
    } catch (error) {
      // Error is handled by the hook
    }
  };

  const handleClose_ = () => {
    setFormData({
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    onClearError();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose_}
      maxWidth="sm"
      fullWidth
      aria-labelledby="password-dialog-title"
      aria-describedby="password-dialog-description"
      TransitionComponent={Fade}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit,
        },
      }}
    >
      <DialogTitle id="password-dialog-title">
        <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SecurityIcon color="primary" />
          Şifre Değiştir
        </Typography>
      </DialogTitle>
      
      {loading && <LinearProgress />}
      
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <DialogContentText id="password-dialog-description">
          Hesabınızın güvenliği için güçlü bir şifre seçin. Şifreniz en az 8 karakter olmalı ve 
          büyük harf, küçük harf, rakam ve özel karakter içermelidir.
        </DialogContentText>

        {error && (
          <Alert severity="error" onClose={onClearError}>
            {error}
          </Alert>
        )}

        {/* Current Password */}
        <FormControl fullWidth>
          <FormLabel htmlFor="current-password">Mevcut Şifre *</FormLabel>
          <TextField
            autoFocus
            required
            id="current-password"
            name="currentPassword"
            type={showPasswords.current ? 'text' : 'password'}
            fullWidth
            value={formData.currentPassword}
            onChange={handleInputChange('currentPassword')}
            error={!!formErrors.currentPassword}
            helperText={formErrors.currentPassword}
            disabled={loading}
            aria-invalid={!!formErrors.currentPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('current')}
                    edge="end"
                    disabled={loading}
                    aria-label={showPasswords.current ? 'Şifreyi gizle' : 'Şifreyi göster'}
                  >
                    {showPasswords.current ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        {/* New Password */}
        <FormControl fullWidth>
          <FormLabel htmlFor="new-password">Yeni Şifre *</FormLabel>
          <TextField
            required
            id="new-password"
            name="newPassword"
            type={showPasswords.new ? 'text' : 'password'}
            fullWidth
            value={formData.newPassword}
            onChange={handleInputChange('newPassword')}
            error={!!formErrors.newPassword}
            helperText={formErrors.newPassword}
            disabled={loading}
            aria-invalid={!!formErrors.newPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('new')}
                    edge="end"
                    disabled={loading}
                    aria-label={showPasswords.new ? 'Yeni şifreyi gizle' : 'Yeni şifreyi göster'}
                  >
                    {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        {/* Password Strength Indicator */}
        {formData.newPassword && (
          <Card variant="outlined">
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Şifre Gücü:
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(passwordStrength.score / 5) * 100}
                  color={passwordStrength.color}
                  sx={{ flex: 1, height: 8, borderRadius: 4 }}
                />
                <Typography variant="caption" color={`${passwordStrength.color}.main`} sx={{ fontWeight: 500 }}>
                  {passwordStrength.score}/5
                </Typography>
              </Box>
              {passwordStrength.feedback.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                    Eksik gereksinimler:
                  </Typography>
                  <List dense sx={{ py: 0 }}>
                    {passwordStrength.feedback.map((item, index) => (
                      <ListItem key={index} sx={{ py: 0.5, px: 0 }}>
                        <ListItemIcon sx={{ minWidth: 28 }}>
                          <CloseIcon color="error" fontSize="small" />
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Typography variant="caption" color="text.secondary">
                              {item}
                            </Typography>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Confirm Password */}
        <FormControl fullWidth>
          <FormLabel htmlFor="confirm-password">Yeni Şifre (Tekrar) *</FormLabel>
          <TextField
            required
            id="confirm-password"
            name="confirmNewPassword"
            type={showPasswords.confirm ? 'text' : 'password'}
            fullWidth
            value={formData.confirmNewPassword}
            onChange={handleInputChange('confirmNewPassword')}
            error={!!formErrors.confirmNewPassword}
            helperText={formErrors.confirmNewPassword}
            disabled={loading}
            aria-invalid={!!formErrors.confirmNewPassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => togglePasswordVisibility('confirm')}
                    edge="end"
                    disabled={loading}
                    aria-label={showPasswords.confirm ? 'Şifre tekrarını gizle' : 'Şifre tekrarını göster'}
                  >
                    {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </FormControl>

        {/* Password Match Indicator */}
        {formData.confirmNewPassword && formData.newPassword && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, p: 1, borderRadius: 1, backgroundColor: formData.newPassword === formData.confirmNewPassword ? 'success.50' : 'error.50' }}>
            {formData.newPassword === formData.confirmNewPassword ? (
              <>
                <CheckIcon color="success" fontSize="small" />
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 500 }}>
                  Şifreler eşleşiyor
                </Typography>
              </>
            ) : (
              <>
                <CloseIcon color="error" fontSize="small" />
                <Typography variant="body2" color="error.main" sx={{ fontWeight: 500 }}>
                  Şifreler eşleşmiyor
                </Typography>
              </>
            )}
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ pb: 3, px: 3, gap: 1 }}>
        <Button 
          onClick={handleClose_} 
          disabled={loading}
          variant="outlined"
        >
          İptal
        </Button>
        <Button 
          variant="contained" 
          type="submit"
          disabled={loading || passwordStrength.score < 4 || formData.newPassword !== formData.confirmNewPassword}
          sx={{ minWidth: 140 }}
        >
          {loading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
