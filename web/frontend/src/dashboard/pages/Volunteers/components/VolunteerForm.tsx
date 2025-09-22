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
import { TURKISH_CITIES, getCityDisplayName } from '../data/volunteers';
import type { Volunteer, VolunteerType } from '../data/volunteers';

export interface VolunteerFormState {
  values: Partial<Omit<Volunteer, 'id' | 'user' | 'updated_at' | 'created_at' | 'gonulluluk_no'>>;
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

const VOLUNTEER_TYPES: { value: VolunteerType; label: string; description: string }[] = [
  { value: 'toplama', label: 'Toplama Gönüllüsü', description: 'Yardım malzemelerinin toplanması' },
  { value: 'tasima', label: 'Taşıma Gönüllüsü', description: 'Yardım malzemelerinin taşınması' },
  { value: 'dagitim', label: 'Dağıtım Gönüllüsü', description: 'Yardım malzemelerinin dağıtılması' },
  { value: 'karma', label: 'Karma Gönüllü', description: 'Birden fazla alanda görev alabilir' },
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
    <Box
      component="form"
      onSubmit={handleSubmit}
      noValidate
      autoComplete="off"
      onReset={handleReset}
    >
        <Grid container spacing={2} mb={2} columns={12}>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.gonullu_tipi} fullWidth>
              <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Gönüllü Tipi</FormLabel>
              <Select
                value={formValues.gonullu_tipi ?? ''}
                onChange={handleSelectFieldChange as SelectProps['onChange']}
                name="gonullu_tipi"
                defaultValue=""
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Gönüllü tipi seçin
                </MenuItem>
                {VOLUNTEER_TYPES.map((type) => (
                  <MenuItem key={type.value} value={type.value}>
                    <Box>
                      <Box component="span" fontWeight={500}>
                        {type.label}
                      </Box>
                      <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.875rem', ml: 1 }}>
                        - {type.description}
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{formErrors.gonullu_tipi ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.email} fullWidth>
              <FormLabel sx={{ mb: 1, fontWeight: 600 }}>E-posta Adresi</FormLabel>
              <TextField
                value={formValues.email ?? ''}
                onChange={handleTextFieldChange}
                name="email"
                type="email"
                placeholder="ornek@email.com"
                error={!!formErrors.email}
                fullWidth
              />
              <FormHelperText>{formErrors.email ?? 'Geçerli bir e-posta adresi giriniz'}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.ad} fullWidth>
              <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Ad</FormLabel>
              <TextField
                value={formValues.ad ?? ''}
                onChange={handleTextFieldChange}
                name="ad"
                placeholder="Adınızı girin"
                error={!!formErrors.ad}
                fullWidth
              />
              <FormHelperText>{formErrors.ad ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.soyad} fullWidth>
              <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Soyad</FormLabel>
              <TextField
                value={formValues.soyad ?? ''}
                onChange={handleTextFieldChange}
                name="soyad"
                placeholder="Soyadınızı girin"
                error={!!formErrors.soyad}
                fullWidth
              />
              <FormHelperText>{formErrors.soyad ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.telefon} fullWidth>
              <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Telefon</FormLabel>
              <TextField
                value={formValues.telefon ?? ''}
                onChange={handleTextFieldChange}
                name="telefon"
                placeholder="5XXXXXXXXX"
                error={!!formErrors.telefon}
                fullWidth
                inputProps={{ maxLength: 10 }}
              />
              <FormHelperText>{formErrors.telefon ?? 'Başında 0 olmadan 10 haneli telefon numarası'}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.sehir} fullWidth>
              <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Şehir</FormLabel>
              <Select
                value={formValues.sehir ?? ''}
                onChange={handleSelectFieldChange as SelectProps['onChange']}
                name="sehir"
                defaultValue=""
                displayEmpty
                fullWidth
              >
                <MenuItem value="" disabled>
                  Şehir seçin
                </MenuItem>
                {TURKISH_CITIES.map((city) => (
                  <MenuItem key={city} value={city}>
                    {getCityDisplayName(city)}
                  </MenuItem>
                ))}
              </Select>
              <FormHelperText>{formErrors.sehir ?? ' '}</FormHelperText>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }} sx={{ display: 'flex' }}>
            <FormControl error={!!formErrors.is_active} fullWidth>
              <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Aktif Durum</FormLabel>
              <Select
                value={String(formValues.is_active ?? true)}
                onChange={handleSelectFieldChange as SelectProps['onChange']}
                name="is_active"
                defaultValue="true"
                fullWidth
              >
                <MenuItem value="true">Aktif</MenuItem>
                <MenuItem value="false">Pasif</MenuItem>
              </Select>
              <FormHelperText>{formErrors.is_active ?? ' '}</FormHelperText>
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
  );
}
