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
  Warning as WarningIcon,
  Person as PersonIcon,
  History as HistoryIcon,
  Event as EventIcon,
  Storage as StorageIcon
} from '@mui/icons-material';

interface AccountDeleteDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function AccountDeleteDialog({ open, handleClose }: AccountDeleteDialogProps) {
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirmDelete) {
      // Here you would typically send a request to your backend to delete the account
      alert('Hesap silme işlemi başlatıldı.');
      handleClose();
    } else {
      alert('Lütfen hesap silme işlemini onaylayın.');
    }
  }, [confirmDelete, handleClose]);

  const handleCheckboxChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmDelete(event.target.checked);
  }, []);

  const handleClose_ = React.useCallback(() => {
    setConfirmDelete(false);
    handleClose();
  }, [handleClose]);

  const deletionItems = [
    { icon: <PersonIcon />, text: 'Kişisel bilgileriniz (ad, soyad, e-posta, konum, katılma tarihi)' },
    { icon: <StorageIcon />, text: 'Hesabınıza bağlı tüm veriler ve ayarlar' },
    { icon: <HistoryIcon />, text: 'Gönüllülük geçmişiniz ve ilgili kayıtlar' },
    { icon: <EventIcon />, text: 'Geçmiş etkinlikleriniz ve log kayıtları' }
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
          <WarningIcon color="error" />
          Hesabı Sil
        </Typography>
      </DialogTitle>
      
      <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            Bu işlem geri alınamaz!
          </Typography>
        </Alert>

        <DialogContentText id="account-delete-description">
          Hesabınızı silmek üzeresiniz. Aşağıdaki bilgiler kalıcı olarak silinecektir:
        </DialogContentText>

        <Card variant="outlined">
          <CardContent>
            <List dense>
              {deletionItems.map((item, index) => (
                <ListItem key={index}>
                  <ListItemIcon sx={{ color: 'error.main' }}>
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
              checked={confirmDelete} 
              onChange={handleCheckboxChange}
              aria-describedby="account-delete-description"
              color="error"
            />
          }
          label={
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Hesabı silmek için onaylıyorum ve sonuçlarını kabul ediyorum.
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
          color="error" 
          type="submit" 
          disabled={!confirmDelete}
          sx={{ minWidth: 120 }}
        >
          Hesabı Sil
        </Button>
      </DialogActions>
    </Dialog>
  );
}
