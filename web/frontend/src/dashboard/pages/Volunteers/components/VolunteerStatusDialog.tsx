import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import {
  getOne as getVolunteer,
  updateOne as updateVolunteer,
  getDisplayName,
  type Volunteer,
} from '../data/volunteers';

interface VolunteerStatusDialogProps {
  open: boolean;
  volunteerId: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VolunteerStatusDialog({
  open,
  volunteerId,
  onClose,
  onSuccess,
}: VolunteerStatusDialogProps) {
  const [volunteer, setVolunteer] = React.useState<Volunteer | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);
  const [newStatus, setNewStatus] = React.useState<boolean>(true);

  const loadData = React.useCallback(async () => {
    if (!open || !volunteerId) return;

    setError(null);
    setIsLoading(true);

    try {
      const volunteerData = await getVolunteer(volunteerId);
      setVolunteer(volunteerData);
      setNewStatus(volunteerData.is_active);
    } catch (loadError) {
      setError(loadError as Error);
    }

    setIsLoading(false);
  }, [open, volunteerId]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStatusChange = React.useCallback((event: SelectChangeEvent) => {
    setNewStatus(event.target.value === 'true');
  }, []);

  const handleSubmit = React.useCallback(async () => {
    if (!volunteer) return;

    setIsSubmitting(true);
    try {
      await updateVolunteer(volunteer.id, { is_active: newStatus });
      onSuccess();
    } catch (updateError) {
      setError(updateError as Error);
    }
    setIsSubmitting(false);
  }, [volunteer, newStatus, onSuccess]);

  const renderContent = React.useMemo(() => {
    if (isLoading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return <Alert severity="error">{error.message}</Alert>;
    }

    return volunteer ? (
      <Stack spacing={3}>
        {/* Volunteer Info */}
        <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="h6" gutterBottom>
            {getDisplayName(volunteer)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Gönüllülük No: {volunteer.gonulluluk_no}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="body2" color="text.secondary">
              Mevcut Durum:
            </Typography>
            <Chip
              label={volunteer.is_active ? 'Aktif' : 'Pasif'}
              color={volunteer.is_active ? 'success' : 'default'}
              size="small"
              variant="outlined"
            />
          </Stack>
        </Box>

        {/* Status Selection */}
        <FormControl fullWidth>
          <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Yeni Durum</FormLabel>
          <Select
            value={String(newStatus)}
            onChange={handleStatusChange}
            fullWidth
          >
            <MenuItem value="true">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip label="Aktif" color="success" size="small" variant="outlined" />
                <Typography>Gönüllü aktif durumda</Typography>
              </Stack>
            </MenuItem>
            <MenuItem value="false">
              <Stack direction="row" alignItems="center" spacing={1}>
                <Chip label="Pasif" color="default" size="small" variant="outlined" />
                <Typography>Gönüllü pasif durumda</Typography>
              </Stack>
            </MenuItem>
          </Select>
        </FormControl>

        {/* Warning for status change */}
        {volunteer.is_active !== newStatus && (
          <Alert severity="info">
            {newStatus 
              ? 'Gönüllü aktif duruma getirilecek ve görevlere atanabilir hale gelecek.'
              : 'Gönüllü pasif duruma getirilecek ve yeni görevlere atanamayacak.'
            }
          </Alert>
        )}
      </Stack>
    ) : null;
  }, [isLoading, error, volunteer, newStatus, handleStatusChange]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        Gönüllü Durumu Düzenle
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {renderContent}
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            onClick={onClose}
            disabled={isSubmitting}
          >
            İptal
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isSubmitting || !volunteer || volunteer.is_active === newStatus}
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
