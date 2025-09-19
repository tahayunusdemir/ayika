import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  createOne as createVolunteer,
  validate as validateVolunteer,
  type Volunteer,
} from '../data/volunteers';
import VolunteerForm, {
  type FormFieldValue,
  type VolunteerFormState,
} from './VolunteerForm';

const INITIAL_FORM_VALUES: Partial<VolunteerFormState['values']> = {
  joinDate: new Date().toISOString(),
};

interface VolunteerCreateDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function VolunteerCreateDialog({
  open,
  onClose,
  onSuccess,
}: VolunteerCreateDialogProps) {
  const notifications = useNotifications();

  const [formState, setFormState] = React.useState<VolunteerFormState>(() => ({
    values: INITIAL_FORM_VALUES,
    errors: {},
  }));
  const formValues = formState.values;
  const formErrors = formState.errors;

  // Reset form when dialog opens
  React.useEffect(() => {
    if (open) {
      setFormState({
        values: INITIAL_FORM_VALUES,
        errors: {},
      });
    }
  }, [open]);

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
          ...formErrors,
          [name]: issues?.find((issue) => issue.path?.[0] === name)?.message,
        });
      };

      const newFormValues = { ...formValues, [name]: value };

      setFormValues(newFormValues);
      validateField(newFormValues);
    },
    [formValues, formErrors, setFormErrors, setFormValues],
  );

  const handleFormReset = React.useCallback(() => {
    setFormValues(INITIAL_FORM_VALUES);
  }, [setFormValues]);

  const handleFormSubmit = React.useCallback(async () => {
    const { issues } = validateVolunteer(formValues);
    if (issues && issues.length > 0) {
      setFormErrors(
        Object.fromEntries(issues.map((issue) => [issue.path?.[0], issue.message])),
      );
      return;
    }
    setFormErrors({});

    try {
      await createVolunteer(formValues as Omit<Volunteer, 'id'>);
      notifications.show('Gönüllü başarıyla oluşturuldu.', {
        severity: 'success',
        autoHideDuration: 3000,
      });

      onSuccess();
    } catch (createError) {
      notifications.show(
        `Gönüllü oluşturulurken hata oluştu: ${(createError as Error).message}`,
        {
          severity: 'error',
          autoHideDuration: 3000,
        },
      );
      throw createError;
    }
  }, [formValues, notifications, setFormErrors, onSuccess]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        Yeni Gönüllü
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <VolunteerForm
          formState={formState}
          onFieldChange={handleFormFieldChange}
          onSubmit={handleFormSubmit}
          onReset={handleFormReset}
          onCancel={onClose}
          submitButtonLabel="Oluştur"
        />
      </DialogContent>
    </Dialog>
  );
}
