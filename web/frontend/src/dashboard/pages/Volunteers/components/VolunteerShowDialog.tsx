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
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { getOne as getVolunteer, type Volunteer, type VolunteerType } from '../data/volunteers';
import { dateUtils } from '../../../theme/customizations/dateUtils';

// Helper function to get volunteer type color
const getVolunteerTypeColor = (type: VolunteerType) => {
  switch (type) {
    case 'toplama':
      return 'primary';
    case 'taşıma':
      return 'secondary';
    case 'dağıtım':
      return 'success';
    case 'karma':
      return 'warning';
    default:
      return 'default';
  }
};

// Helper function to get volunteer type label
const getVolunteerTypeLabel = (type: VolunteerType) => {
  switch (type) {
    case 'toplama':
      return 'Toplama Gönüllüsü';
    case 'taşıma':
      return 'Taşıma Görevlisi';
    case 'dağıtım':
      return 'Dağıtım Görevlisi';
    case 'karma':
      return 'Karma Görevli';
    default:
      return type;
  }
};

interface VolunteerShowDialogProps {
  open: boolean;
  volunteerId: number;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export default function VolunteerShowDialog({
  open,
  volunteerId,
  onClose,
  onEdit,
  onDelete,
}: VolunteerShowDialogProps) {
  const [volunteer, setVolunteer] = React.useState<Volunteer | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadData = React.useCallback(async () => {
    if (!open || !volunteerId) return;

    setError(null);
    setIsLoading(true);

    try {
      const showData = await getVolunteer(volunteerId);
      setVolunteer(showData);
    } catch (showDataError) {
      setError(showDataError as Error);
    }
    setIsLoading(false);
  }, [volunteerId, open]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const renderShow = React.useMemo(() => {
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
      <Box>
        {/* Header Section */}
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Typography variant="h5" fontWeight={600} gutterBottom>
            {volunteer.name} {volunteer.surname}
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
            <Chip
              label={getVolunteerTypeLabel(volunteer.volunteerType)}
              color={getVolunteerTypeColor(volunteer.volunteerType) as any}
              variant="filled"
              size="medium"
            />
            <Typography variant="body2" color="text.secondary">
              {volunteer.gonulluluk_no}
            </Typography>
          </Stack>
          <Divider />
        </Box>

        {/* Information Grid */}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Gönüllülük Numarası
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {volunteer.gonulluluk_no}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Ad Soyad
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {volunteer.name} {volunteer.surname}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                E-posta
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {volunteer.email}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Telefon
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {volunteer.phone}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Şehir
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {volunteer.city}
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" display="block">
                Katılım Tarihi
              </Typography>
              <Typography variant="body1" fontWeight={500}>
                {dateUtils.formatDateLong(volunteer.joinDate)}
              </Typography>
            </Box>
          </Grid>

          <Grid size={12} sx={{ mt: 1 }}>
            <Box sx={{ p: 2, bgcolor: 'primary.50', borderRadius: 1, border: '1px solid', borderColor: 'primary.200' }}>
              <Typography variant="h6" fontWeight={600} color="primary.main" gutterBottom>
                {getVolunteerTypeLabel(volunteer.volunteerType)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {volunteer.volunteerType === 'toplama' && 'Yardım malzemelerinin toplanması ve organize edilmesi'}
                {volunteer.volunteerType === 'taşıma' && 'Yardım malzemelerinin güvenli bir şekilde taşınması'}
                {volunteer.volunteerType === 'dağıtım' && 'Yardım malzemelerinin ihtiyaç sahiplerine dağıtılması'}
                {volunteer.volunteerType === 'karma' && 'Birden fazla alanda görev alabilir ve esnek çalışma imkanı'}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    ) : null;
  }, [isLoading, error, volunteer]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        {volunteer ? `${volunteer.name} ${volunteer.surname} - Gönüllü Detayları` : 'Gönüllü Detayları'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {renderShow}
      </DialogContent>
      <DialogActions>
        <Stack direction="row" spacing={2} sx={{ ml: 'auto' }}>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={onEdit}
          >
            Düzenle
          </Button>
          <Button
            variant="contained"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={onDelete}
          >
            Sil
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
