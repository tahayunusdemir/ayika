import * as React from 'react';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  getOne as getVolunteer,
  updateOne as updateVolunteer,
  validate as validateVolunteer,
  type Volunteer,
} from '../data/volunteers';
import VolunteerForm, {
  type FormFieldValue,
  type VolunteerFormState,
} from './VolunteerForm';

interface VolunteerEditDialogProps {
  open: boolean;
  volunteerId: number;
  onClose: () => void;
  onSuccess: () => void;
}


export default function VolunteerEditDialog({
  open,
  volunteerId,
  onClose,
  onSuccess,
}: VolunteerEditDialogProps) {
  const notifications = useNotifications();
  const [volunteer, setVolunteer] = React.useState<Volunteer | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);
  const [formState, setFormState] = React.useState<VolunteerFormState>(() => ({
    values: {},
    errors: {},
  }));

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

  // Update form state when volunteer data loads
  React.useEffect(() => {
    if (volunteer) {
      setFormState({
        values: volunteer,
        errors: {},
      });
    }
  }, [volunteer]);

  const setFormValues = React.useCallback(
    (newFormValues: Partial<VolunteerFormState['values']>) => {
      setFormState((previousState) => ({
        ...previousState,
        values: newFormValues,
      }));
    },
    [],
  );

  const setFormErrors = React.useCallback(
    (newFormErrors: Partial<VolunteerFormState['errors']>) => {
      setFormState((previousState) => ({
        ...previousState,
        errors: newFormErrors,
      }));
    },
    [],
  );

  const handleFormFieldChange = React.useCallback(
    (name: keyof VolunteerFormState['values'], value: FormFieldValue) => {
      const validateField = async (values: Partial<VolunteerFormState['values']>) => {
        const { issues } = validateVolunteer(values);
        setFormErrors({
          ...formState.errors,
          [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
        });
      };

      const newFormValues = { ...formState.values, [name]: value };
      setFormValues(newFormValues);
      validateField(newFormValues);
    },
    [formState.values, formState.errors, setFormErrors, setFormValues],
  );

  const handleFormReset = React.useCallback(() => {
    if (volunteer) {
      setFormValues(volunteer);
    }
  }, [volunteer, setFormValues]);

  const handleFormSubmit = React.useCallback(async () => {
    const { issues } = validateVolunteer(formState.values);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
      const updatedData = await updateVolunteer(volunteerId, formState.values);
      setVolunteer(updatedData);
      notifications.show('Gönüllü başarıyla güncellendi.', {
        severity: 'success',
        autoHideDuration: 3000,
      });
      onSuccess();
    } catch (editError) {
      notifications.show(
        `Gönüllü güncellenirken hata oluştu: ${(editError as Error).message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw editError;
    }
  }, [formState.values, volunteerId, notifications, setFormErrors, onSuccess]);

  const renderEdit = React.useMemo(() => {
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
      <VolunteerForm
        formState={formState}
        onFieldChange={handleFormFieldChange}
        onSubmit={handleFormSubmit}
        onReset={handleFormReset}
        onCancel={onClose}
        submitButtonLabel="Kaydet"
      />
    ) : null;
  }, [isLoading, error, volunteer, formState, handleFormFieldChange, handleFormSubmit, handleFormReset, onClose]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Gönüllü Düzenle
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        {renderEdit}
      </DialogContent>
    </Dialog>
  );
}
