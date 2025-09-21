import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import MuiCard from '@mui/material/Card';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { styled } from '@mui/material/styles';
import {
  Visibility,
  VisibilityOff,
  Check as CheckIcon,
  Close as CloseIcon,
  Security as SecurityIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import AppTheme from '../shared-theme/AppTheme';
import AppAppBar from '../shared-theme/components/AppAppBar';
import { authService } from '../services/authService';

const StyledCard = styled(MuiCard)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'center',
  width: '100%',
  padding: theme.spacing(4),
  gap: theme.spacing(2),
  margin: 'auto',
  [theme.breakpoints.up('sm')]: {
    maxWidth: '500px',
  },
  boxShadow:
    'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
  ...theme.applyStyles('dark', {
    boxShadow:
      'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
  }),
}));

const Container = styled(Stack)(({ theme }) => ({
  height: 'calc((1 - var(--template-frame-height, 0)) * 100dvh)',
  minHeight: '100%',
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(4),
  },
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    zIndex: -1,
    inset: 0,
    backgroundImage:
      'radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
    backgroundRepeat: 'no-repeat',
    ...theme.applyStyles('dark', {
      backgroundImage:
        'radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
    }),
  },
}));

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: 'error' | 'warning' | 'info' | 'success';
}

export default function PasswordResetPage(props: { disableCustomTheme?: boolean }) {
  const { uidb64, token } = useParams<{ uidb64: string; token: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = React.useState(false);
  const [verifying, setVerifying] = React.useState(true);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState(false);
  const [userEmail, setUserEmail] = React.useState('');
  
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [passwordError, setPasswordError] = React.useState('');
  const [confirmPasswordError, setConfirmPasswordError] = React.useState('');
  
  const [showPasswords, setShowPasswords] = React.useState({
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
    () => calculatePasswordStrength(newPassword),
    [calculatePasswordStrength, newPassword]
  );

  // Verify token on component mount
  React.useEffect(() => {
    const verifyToken = async () => {
      if (!uidb64 || !token) {
        setError('Geçersiz şifre sıfırlama bağlantısı.');
        setVerifying(false);
        return;
      }

      try {
        const response = await authService.passwordResetVerify(uidb64, token);
        
        if (response.success) {
          setUserEmail((response as any).user_email || '');
        } else {
          setError(response.message || 'Geçersiz veya süresi dolmuş bağlantı.');
        }
      } catch (error) {
        setError('Token doğrulama sırasında bir hata oluştu.');
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [uidb64, token]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Reset errors
    setPasswordError('');
    setConfirmPasswordError('');
    setError('');
    
    // Validate passwords
    if (!newPassword) {
      setPasswordError('Yeni şifre gereklidir.');
      return;
    }
    
    if (!confirmPassword) {
      setConfirmPasswordError('Şifre tekrarı gereklidir.');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Şifreler eşleşmiyor.');
      return;
    }
    
    if (passwordStrength.score < 4) {
      setPasswordError('Şifre güvenlik gereksinimlerini karşılamıyor.');
      return;
    }
    
    if (!uidb64 || !token) {
      setError('Geçersiz şifre sıfırlama bağlantısı.');
      return;
    }

    setLoading(true);
    
    try {
      const response = await authService.passwordResetConfirm(uidb64, token, newPassword, confirmPassword);
      
      if (response.success) {
        setSuccess(true);
        // Redirect to login after 3 seconds
        setTimeout(() => {
          navigate('/sign-in');
        }, 3000);
      } else {
        if (response.errors?.new_password) {
          setPasswordError(response.errors.new_password.join(' '));
        } else if (response.errors?.confirm_password) {
          setConfirmPasswordError(response.errors.confirm_password.join(' '));
        } else {
          setError(response.message || 'Şifre sıfırlama sırasında bir hata oluştu.');
        }
      }
    } catch (error) {
      setError('Bağlantı hatası. Lütfen tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  if (verifying) {
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <AppAppBar />
        <Container direction="column" justifyContent="center" alignItems="center">
          <StyledCard variant="outlined">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CircularProgress size={40} />
              <Typography variant="h6">Bağlantı doğrulanıyor...</Typography>
            </Box>
          </StyledCard>
        </Container>
      </AppTheme>
    );
  }

  if (error && !userEmail) {
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <AppAppBar />
        <Container direction="column" justifyContent="center" alignItems="center">
          <StyledCard variant="outlined">
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center', mb: 2 }}
            >
              Hata
            </Typography>
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
            <Button
              variant="contained"
              fullWidth
              onClick={() => navigate('/sign-in')}
            >
              Giriş Sayfasına Dön
            </Button>
          </StyledCard>
        </Container>
      </AppTheme>
    );
  }

  if (success) {
    return (
      <AppTheme {...props}>
        <CssBaseline enableColorScheme />
        <AppAppBar />
        <Container direction="column" justifyContent="center" alignItems="center">
          <StyledCard variant="outlined">
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 60 }} />
              <Typography
                component="h1"
                variant="h4"
                sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)', textAlign: 'center' }}
              >
                Başarılı!
              </Typography>
              <Typography variant="body1" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                Şifreniz başarıyla değiştirildi. Artık yeni şifrenizle giriş yapabilirsiniz.
              </Typography>
              <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                3 saniye içinde giriş sayfasına yönlendirileceksiniz...
              </Typography>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/sign-in')}
                sx={{ mt: 2 }}
              >
                Hemen Giriş Yap
              </Button>
            </Box>
          </StyledCard>
        </Container>
      </AppTheme>
    );
  }

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container direction="column" justifyContent="space-between">
        <StyledCard variant="outlined">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <SecurityIcon color="primary" />
            <Typography
              component="h1"
              variant="h4"
              sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
            >
              Yeni Şifre Oluştur
            </Typography>
          </Box>
          
          {userEmail && (
            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
              {userEmail} hesabı için yeni şifre oluşturuluyor
            </Typography>
          )}
          
          {loading && <LinearProgress sx={{ mb: 2 }} />}
          
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              gap: 2,
            }}
          >
            {/* New Password */}
            <FormControl fullWidth>
              <FormLabel htmlFor="new-password" sx={{ mb: 1, fontWeight: 600 }}>
                Yeni Şifre *
              </FormLabel>
              <TextField
                required
                id="new-password"
                name="newPassword"
                type={showPasswords.new ? 'text' : 'password'}
                fullWidth
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (passwordError) setPasswordError('');
                }}
                error={!!passwordError}
                helperText={passwordError}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('new')}
                        edge="end"
                        disabled={loading}
                      >
                        {showPasswords.new ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {/* Password Strength Indicator */}
            {newPassword && (
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
              <FormLabel htmlFor="confirm-password" sx={{ mb: 1, fontWeight: 600 }}>
                Yeni Şifre (Tekrar) *
              </FormLabel>
              <TextField
                required
                id="confirm-password"
                name="confirmPassword"
                type={showPasswords.confirm ? 'text' : 'password'}
                fullWidth
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) setConfirmPasswordError('');
                }}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
                disabled={loading}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => togglePasswordVisibility('confirm')}
                        edge="end"
                        disabled={loading}
                      >
                        {showPasswords.confirm ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </FormControl>

            {/* Password Match Indicator */}
            {confirmPassword && newPassword && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                p: 1, 
                borderRadius: 1, 
                backgroundColor: newPassword === confirmPassword ? 'success.50' : 'error.50' 
              }}>
                {newPassword === confirmPassword ? (
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading || passwordStrength.score < 4 || newPassword !== confirmPassword}
              startIcon={loading ? <CircularProgress size={20} /> : null}
              sx={{ mt: 2 }}
            >
              {loading ? 'Şifre Değiştiriliyor...' : 'Şifreyi Değiştir'}
            </Button>
          </Box>
        </StyledCard>
      </Container>
    </AppTheme>
  );
}
