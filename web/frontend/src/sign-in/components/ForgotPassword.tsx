import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import { authService } from '../../services/authService';

interface ForgotPasswordProps {
  open: boolean;
  handleClose: () => void;
}

export default function ForgotPassword({ open, handleClose }: ForgotPasswordProps) {
  const [email, setEmail] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');
  const [emailError, setEmailError] = React.useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    // Reset states
    setError('');
    setSuccess('');
    setEmailError('');
    
    // Validate email
    if (!email.trim()) {
      setEmailError('E-posta adresi gereklidir.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setEmailError('Geçerli bir e-posta adresi giriniz.');
      return;
    }
    
    setLoading(true);
    
    try {
      const response = await authService.passwordResetRequest(email.trim());
      
      if (response.success) {
        setSuccess(response.message);
        setEmail('');
      } else {
        if (response.errors?.email) {
          setEmailError(response.errors.email[0]);
        } else {
          setError(response.message || 'Bir hata oluştu.');
        }
      }
    } catch (error) {
      setError('Bağlantı hatası. Lütfen tekrar deneyiniz.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose_ = () => {
    setEmail('');
    setError('');
    setSuccess('');
    setEmailError('');
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose_}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit,
          sx: { backgroundImage: 'none' },
        },
      }}
    >
      <DialogTitle>Şifremi Unuttum</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Hesabınızın e-posta adresini girin, size şifre sıfırlama bağlantısı göndereceğiz.
        </DialogContentText>
        
        {error && (
          <Alert severity="error">
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert severity="success">
            {success}
          </Alert>
        )}
        
        <FormControl fullWidth>
          <FormLabel htmlFor="reset-email" sx={{ mb: 1, fontWeight: 600 }}>
            E-posta Adresi *
          </FormLabel>
          <TextField
            autoFocus
            required
            id="reset-email"
            name="email"
            type="email"
            placeholder="ornek@email.com"
            fullWidth
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (emailError) setEmailError('');
              if (error) setError('');
            }}
            error={!!emailError}
            helperText={emailError}
            disabled={loading}
          />
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3, gap: 1 }}>
        <Button onClick={handleClose_} disabled={loading} variant="outlined">
          İptal
        </Button>
        <Button 
          variant="contained" 
          type="submit"
          disabled={loading || !email.trim()}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          sx={{ minWidth: 140 }}
        >
          {loading ? 'Gönderiliyor...' : 'Devam Et'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
