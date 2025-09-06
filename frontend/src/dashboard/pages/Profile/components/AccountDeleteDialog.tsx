import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

interface AccountDeleteDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function AccountDeleteDialog({ open, handleClose }: AccountDeleteDialogProps) {
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (confirmDelete) {
      // Here you would typically send a request to your backend to delete the account
      alert('Hesap silme işlemi başlatıldı.');
      handleClose();
    } else {
      alert('Lütfen hesap silme işlemini onaylayın.');
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmDelete(event.target.checked);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      slotProps={{
        paper: {
          component: 'form',
          onSubmit: handleSubmit,
          sx: { backgroundImage: 'none' },
        },
      }}
    >
      <DialogTitle>Hesabı Sil</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Hesabınızı silmek üzeresiniz. Bu işlem geri alınamaz ve aşağıdaki bilgiler kalıcı olarak silinecektir:
          <ul>
            <li>Kişisel bilgileriniz (ad, soyad, e-posta, konum, katılma tarihi)</li>
            <li>Hesabınıza bağlı tüm veriler ve ayarlar</li>
            <li>Gönüllülük geçmişiniz ve ilgili kayıtlar</li>
            <li>Geçmiş etkinlikleriniz ve log kayıtları</li>
          </ul>
          Lütfen devam etmek için aşağıdaki kutucuğu işaretleyiniz.
        </DialogContentText>
        <FormControlLabel
          control={<Checkbox checked={confirmDelete} onChange={handleCheckboxChange} />}
          label="Hesabı silmek için onaylıyorum."
        />
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>İptal</Button>
        <Button variant="contained" color="error" type="submit" disabled={!confirmDelete}>
          Hesabı Sil
        </Button>
      </DialogActions>
    </Dialog>
  );
}
