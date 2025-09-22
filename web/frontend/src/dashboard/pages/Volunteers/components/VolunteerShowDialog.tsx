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
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import QrCodeIcon from '@mui/icons-material/QrCode';
import { getOne as getVolunteer, getDisplayName, getCityDisplayName, type Volunteer, type VolunteerType } from '../data/volunteers';
import { dateUtils } from '../../../theme/customizations/dateUtils';
import VolunteerBusinessCard from './VolunteerBusinessCard';

// Helper function to get volunteer type color
const getVolunteerTypeColor = (type: VolunteerType) => {
  switch (type) {
    case 'toplama':
      return 'primary';
    case 'tasima':
      return 'secondary';
    case 'dagitim':
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
    case 'tasima':
      return 'Taşıma Gönüllüsü';
    case 'dagitim':
      return 'Dağıtım Gönüllüsü';
    case 'karma':
      return 'Karma Gönüllü';
    default:
      return type;
  }
};

interface VolunteerShowDialogProps {
  open: boolean;
  volunteerId: number;
  onClose: () => void;
  onEdit: () => void;
}

export default function VolunteerShowDialog({
  open,
  volunteerId,
  onClose,
  onEdit,
}: VolunteerShowDialogProps) {
  const [volunteer, setVolunteer] = React.useState<Volunteer | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [businessCardOpen, setBusinessCardOpen] = React.useState(false);

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
        {/* Compact Header */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" fontWeight={600}>
              {getDisplayName(volunteer)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {volunteer.gonulluluk_no}
            </Typography>
          </Box>
          <Chip
            label={getVolunteerTypeLabel(volunteer.gonullu_tipi)}
            color={getVolunteerTypeColor(volunteer.gonullu_tipi) as any}
            size="small"
          />
          <Chip
            label={volunteer.is_active ? 'Aktif' : 'Pasif'}
            color={volunteer.is_active ? 'success' : 'default'}
            size="small"
            variant="outlined"
          />
        </Stack>

        {/* Compact Information */}
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">E-posta</Typography>
            <Typography variant="body2" fontWeight={500}>{volunteer.email || '-'}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">Telefon</Typography>
            <Typography variant="body2" fontWeight={500}>
              {volunteer.telefon ? `${volunteer.telefon.slice(0, 3)} ${volunteer.telefon.slice(3, 6)} ${volunteer.telefon.slice(6, 8)} ${volunteer.telefon.slice(8, 10)}` : '-'}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1, borderBottom: '1px solid', borderColor: 'divider' }}>
            <Typography variant="body2" color="text.secondary">Şehir</Typography>
            <Typography variant="body2" fontWeight={500}>{getCityDisplayName(volunteer.sehir)}</Typography>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
            <Typography variant="body2" color="text.secondary">Katılım Tarihi</Typography>
            <Typography variant="body2" fontWeight={500}>{dateUtils.formatDateLong(volunteer.created_at)}</Typography>
          </Box>
        </Stack>
      </Box>
    ) : null;
  }, [isLoading, error, volunteer]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        {volunteer ? `${getDisplayName(volunteer)} - Gönüllü Detayları` : 'Gönüllü Detayları'}
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
            variant="outlined"
            startIcon={<QrCodeIcon />}
            onClick={() => setBusinessCardOpen(true)}
            disabled={!volunteer}
          >
            Gönüllü Kartı Oluştur
          </Button>
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={onEdit}
          >
            Durum Düzenle
          </Button>
        </Stack>
      </DialogActions>
      
      {/* Business Card Dialog */}
      {volunteer && (
        <VolunteerBusinessCard
          open={businessCardOpen}
          volunteer={volunteer}
          onClose={() => setBusinessCardOpen(false)}
        />
      )}
    </Dialog>
  );
}
