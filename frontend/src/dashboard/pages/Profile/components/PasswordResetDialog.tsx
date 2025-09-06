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

interface PasswordResetDialogProps {
  open: boolean;
  handleClose: () => void;
}

export default function PasswordResetDialog({ open, handleClose }: PasswordResetDialogProps) {
  const [oldPassword, setOldPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert('Yeni şifreler uyuşmuyor!');
      return;
    }
    if (newPassword.length < 6) {
      alert('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }
    // Here you would typically send a request to your backend to change the password
    alert('Şifreniz başarıyla değiştirildi!');
    handleClose();
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
      <DialogTitle>Şifreyi Sıfırla</DialogTitle>
      <DialogContent
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}
      >
        <DialogContentText>
          Lütfen eski şifrenizi ve yeni şifrenizi giriniz.
        </DialogContentText>
        <FormControl fullWidth variant="outlined">
          <FormLabel htmlFor="old-password">Eski Şifre</FormLabel>
          <TextField
            autoFocus
            required
            margin="dense"
            id="old-password"
            name="oldPassword"
            type="password"
            fullWidth
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <FormLabel htmlFor="new-password">Yeni Şifre</FormLabel>
          <TextField
            required
            margin="dense"
            id="new-password"
            name="newPassword"
            type="password"
            fullWidth
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </FormControl>
        <FormControl fullWidth variant="outlined">
          <FormLabel htmlFor="confirm-new-password">Yeni Şifre (Tekrar)</FormLabel>
          <TextField
            required
            margin="dense"
            id="confirm-new-password"
            name="confirmNewPassword"
            type="password"
            fullWidth
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ pb: 3, px: 3 }}>
        <Button onClick={handleClose}>İptal</Button>
        <Button variant="contained" type="submit">
          Şifreyi Değiştir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
