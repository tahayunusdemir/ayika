import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import { getOne as getVolunteer, type Volunteer } from '../data/volunteers';
import { dateUtils } from '../../../theme/customizations/dateUtils';

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
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return <Alert severity="error">{error.message}</Alert>;
    }

    return volunteer ? (
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="overline">Ad</Typography>
              <Typography variant="body1">
                {volunteer.name}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="overline">Soyad</Typography>
              <Typography variant="body1">
                {volunteer.surname}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="overline">E-posta</Typography>
              <Typography variant="body1">
                {volunteer.email}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="overline">Telefon</Typography>
              <Typography variant="body1">
                {volunteer.phone}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="overline">Katılım Tarihi</Typography>
              <Typography variant="body2" color="text.secondary">
                {dateUtils.formatDateLong(volunteer.joinDate)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="overline">Şehir</Typography>
              <Typography variant="body2" color="text.secondary">
                {volunteer.city}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
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
        Gönüllü Detayları
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
