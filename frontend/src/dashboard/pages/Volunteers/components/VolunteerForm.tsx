import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent, SelectProps } from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { trTR } from '@mui/x-date-pickers/locales';
import type { Dayjs } from 'dayjs';
import type { Volunteer } from '../data/volunteers';
import { dateUtils } from '../../../theme/customizations/dateUtils';

export interface VolunteerFormState {
  values: Partial<Omit<Volunteer, 'id'>>;
  errors: Partial<Record<keyof VolunteerFormState['values'], string>>;
}

export type FormFieldValue = string | number | boolean | File | null;

export interface VolunteerFormProps {
  formState: VolunteerFormState;
  onFieldChange: (
    name: keyof VolunteerFormState['values'],
    value: FormFieldValue,
  ) => void;
  onSubmit: (formValues: Partial<VolunteerFormState['values']>) => Promise<void>;
  onReset?: (formValues: Partial<VolunteerFormState['values']>) => void;
  onCancel?: () => void;
  submitButtonLabel: string;
}

const TURKISH_CITIES = [
  'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Amasya', 'Ankara', 'Antalya',
  'Artvin', 'Aydın', 'Balıkesir', 'Bilecik', 'Bingöl', 'Bitlis', 'Bolu',
  'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır',
  'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun',
  'Gümüşhane', 'Hakkâri', 'Hatay', 'Isparta', 'Mersin', 'İstanbul', 'İzmir',
  'Kars', 'Kastamonu', 'Kayseri', 'Kırklareli', 'Kırşehir', 'Kocaeli', 'Konya',
  'Kütahya', 'Malatya', 'Manisa', 'Kahramanmaraş', 'Mardin', 'Muğla', 'Muş',
  'Nevşehir', 'Niğde', 'Ordu', 'Rize', 'Sakarya', 'Samsun', 'Siirt', 'Sinop',
  'Sivas', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli', 'Şanlıurfa', 'Uşak',
  'Van', 'Yozgat', 'Zonguldak', 'Aksaray', 'Bayburt', 'Karaman', 'Kırıkkale',
  'Batman', 'Şırnak', 'Bartın', 'Ardahan', 'Iğdır', 'Yalova', 'Karabük', 'Kilis',
  'Osmaniye', 'Düzce'
];

export default function VolunteerForm(props: VolunteerFormProps) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    onCancel,
    submitButtonLabel,
  } = props;

  const formValues = formState.values;
  const formErrors = formState.errors;

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      setIsSubmitting(true);
      try {
        await onSubmit(formValues);
      } finally {
        setIsSubmitting(false);
      }
    },
    [formValues, onSubmit],
  );

  const handleTextFieldChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFieldChange(
        event.target.name as keyof VolunteerFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleDateFieldChange = React.useCallback(
    (fieldName: keyof VolunteerFormState['values']) => (value: Dayjs | null) => {
      if (value?.isValid()) {
        onFieldChange(fieldName, value.toISOString() ?? null);
      } else {
        onFieldChange(fieldName, null);
      }
    },
    [onFieldChange],
  );

  const handleSelectFieldChange = React.useCallback(
    (event: SelectChangeEvent) => {
      onFieldChange(
        event.target.name as keyof VolunteerFormState['values'],
        event.target.value,
      );
    },
    [onFieldChange],
  );

  const handleReset = React.useCallback(() => {
    if (onReset) {
      onReset(formValues);
    }
  }, [formValues, onReset]);


  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="tr"
      localeText={trTR.components.MuiLocalizationProvider.defaultProps.localeText}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        noValidate
        autoComplete="off"
        onReset={handleReset}
      >
        <Grid container spacing={2} mb={2} columns={12}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.name} fullWidth>
              <FormLabel>Ad</FormLabel>
              <TextField
                value={formValues.name ?? ''}
                onChange={handleTextFieldChange}
                name="name"
                placeholder="Adınızı girin"
                error={!!formErrors.name}
                fullWidth
              />
              <FormHelperText>{formErrors.name ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.surname} fullWidth>
              <FormLabel>Soyad</FormLabel>
              <TextField
                value={formValues.surname ?? ''}
                onChange={handleTextFieldChange}
                name="surname"
                placeholder="Soyadınızı girin"
                error={!!formErrors.surname}
                fullWidth
              />
              <FormHelperText>{formErrors.surname ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.email} fullWidth>
              <FormLabel>E-posta</FormLabel>
              <TextField
                type="email"
                value={formValues.email ?? ''}
                onChange={handleTextFieldChange}
                name="email"
                placeholder="ornek@email.com"
                error={!!formErrors.email}
                fullWidth
              />
              <FormHelperText>{formErrors.email ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.phone} fullWidth>
              <FormLabel>Telefon</FormLabel>
              <TextField
                value={formValues.phone ?? ''}
                onChange={handleTextFieldChange}
                name="phone"
                placeholder="+90 5XX XXX XX XX"
                error={!!formErrors.phone}
                fullWidth
              />
              <FormHelperText>{formErrors.phone ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.city} fullWidth>
              <FormLabel>Şehir</FormLabel>
              <Select
                value={formValues.city ?? ''}
                onChange={handleSelectFieldChange as SelectProps['onChange']}
                name="city"
                defaultValue=""
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Şehir seçin
                </MenuItem>
                {TURKISH_CITIES.map((city) => (
                  <MenuItem key={city} value={city}>
                    {city}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{formErrors.city ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.joinDate} fullWidth>
              <FormLabel>Katılım Tarihi</FormLabel>
              <DatePicker
                value={dateUtils.toDayjs(formValues.joinDate)}
                onChange={handleDateFieldChange('joinDate')}
                name="joinDate"
                {...dateUtils.getDatePickerProps()}
                maxDate={dateUtils.now()}
                shouldDisableDate={(date) => dateUtils.isAfter(date, dateUtils.now())}
                slotProps={{
                  textField: {
                    error: !!formErrors.joinDate,
                    variant: 'outlined',
                  },
                }}
                disabled={isSubmitting}
              />
              <FormHelperText>{formErrors.joinDate ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
        </Grid>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          {onCancel && (
            <Button
              variant="outlined"
              onClick={onCancel}
            >
              İptal
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            size="large"
            disabled={isSubmitting}
          >
            {submitButtonLabel}
          </Button>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}
