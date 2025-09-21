import * as React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Fade,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography
} from '@mui/material';
import {
  PauseCircle as PauseIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  Event as EventIcon,
  Storage as StorageIcon
} from '@mui/icons-material';

interface AccountDeleteDialogProps {
  open: boolean;
  loading?: boolean;
  error?: string | null;
  handleClose: () => void;
  onAccountDeactivate?: () => Promise<void>;
  onClearError?: () => void;
}

export default function AccountDeleteDialog({ 
  open, 
  loading = false, 
  error = null, 
  handleClose, 
  onAccountDeactivate, 
  onClearError 
}: AccountDeleteDialogProps) {
  const [confirmDeactivate, setConfirmDeactivate] = React.useState(false);

  const handleSubmit = React.useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirmDeactivate && onAccountDeactivate) {
      try {
        await onAccountDeactivate();
      } catch (error) {
        // Error is handled by the hook
      }
    } else {
      alert('Lütfen hesap deaktif etme işlemini onaylayın.');
    }
  }, [confirmDeactivate, onAccountDeactivate]);

  const handleCheckboxChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmDeactivate(event.target.checked);
  }, []);

  const handleClose_ = React.useCallback(() => {
    setConfirmDeactivate(false);
    handleClose();
  }, [handleClose]);

  const deactivationItems = [
    { icon: <PersonIcon />, text: 'Hesabınız pasif duruma geçecek, giriş yapamazsınız' },
    { icon: <StorageIcon />, text: 'Verileriniz korunur, silinmez' },
    { icon: <HistoryIcon />, text: 'Gönüllülük geçmişiniz ve kayıtlarınız saklanır' },
    { icon: <EventIcon />, text: 'İstediğiniz zaman hesabınızı yeniden aktif edebilirsiniz' }
  ];

  return (
    <Dialog
      open={open}
      onClose={handleClose_}
      aria-labelledby="account-delete-title"
      aria-describedby="account-delete-description"
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit,
        },
      }}
    >
      <DialogTitle id="account-delete-title">
        <Typography variant="h6" component="h2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <PauseIcon color="warning" />
          Hesabı Deaktif Et
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        {error && (
          <Alert severity="error" onClose={onClearError} sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        
        <Alert severity="warning" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Hesabınız geçici olarak deaktif edilecek!
          </Typography>
        </Alert>

        <DialogContentText id="account-delete-description">
          Hesabınızı deaktif etmek üzeresiniz. Bu işlemin sonuçları:
        </DialogContentText>

        <Card variant="outlined">
          <CardContent>
            <List dense>
              {deactivationItems.map((item: any, index: number) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ color: 'warning.main' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={
                      <Typography variant="body2">
                        {item.text}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </CardContent>
        </Card>

        <FormControlLabel
          control={
            <Checkbox 
              checked={confirmDeactivate} 
              onChange={handleCheckboxChange}
              aria-describedby="account-delete-description"
              color="warning"
            />
          }
          label={
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Hesabımı deaktif etmek istiyorum ve sonuçlarını kabul ediyorum.
            </Typography>
          }
        />
      </DialogContent>
      
      <DialogActions sx={{ pb: 3, px: 3, gap: 1 }}>
        <Button onClick={handleClose_} variant="outlined">
          İptal
        </Button>
        <Button 
          variant="contained" 
          color="warning" 
          type="submit" 
          disabled={!confirmDeactivate || loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? 'Deaktif ediliyor...' : 'Hesabı Deaktif Et'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
