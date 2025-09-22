import React from 'react';
import {
  Autocomplete,
  TextField,
  Box,
  Typography,
  Stack,
  Chip,
  CircularProgress,
  FormControl,
  FormLabel,
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  DeliveryDining as DeliveryDiningIcon,
  GroupWork as GroupWorkIcon,
} from '@mui/icons-material';

interface Volunteer {
  id: number;
  gonulluluk_no: string;
  ad: string;
  soyad: string;
  telefon: string;
  sehir: string;
  gonullu_tipi: 'toplama' | 'tasima' | 'dagitim' | 'karma';
  is_active: boolean;
}

interface VolunteerSearchAutocompleteProps {
  label: string;
  volunteerType: 'toplama' | 'tasima' | 'dagitim';
  volunteers: Volunteer[];
  value: number | undefined;
  onChange: (volunteerId: number | undefined) => void;
  error?: string;
  loading?: boolean;
  disabled?: boolean;
  required?: boolean;
}

// Helper functions
const getVolunteerTypeIcon = (type: string) => {
  switch (type) {
    case 'toplama': return <InventoryIcon fontSize="small" />;
    case 'tasima': return <LocalShippingIcon fontSize="small" />;
    case 'dagitim': return <DeliveryDiningIcon fontSize="small" />;
    case 'karma': return <GroupWorkIcon fontSize="small" />;
    default: return <GroupWorkIcon fontSize="small" />;
  }
};

const getVolunteerTypeColor = (type: string): 'primary' | 'secondary' | 'success' | 'warning' => {
  switch (type) {
    case 'toplama': return 'primary';
    case 'tasima': return 'secondary';
    case 'dagitim': return 'success';
    case 'karma': return 'warning';
    default: return 'primary';
  }
};

const getVolunteerTypeLabel = (type: string) => {
  switch (type) {
    case 'toplama': return 'Toplama';
    case 'tasima': return 'Taşıma';
    case 'dagitim': return 'Dağıtım';
    case 'karma': return 'Karma';
    default: return type;
  }
};

export default function VolunteerSearchAutocomplete({
  label,
  volunteerType,
  volunteers,
  value,
  onChange,
  error,
  loading = false,
  disabled = false,
  required = false,
}: VolunteerSearchAutocompleteProps) {
  // Filter volunteers by type (karma volunteers can work in all types)
  const filteredVolunteers = React.useMemo(() => {
    if (volunteers.length === 0) {
      return [];
    }

    const typeFiltered = volunteers.filter(v => {
      return v.gonullu_tipi === volunteerType || v.gonullu_tipi === 'karma';
    });

    return typeFiltered;
  }, [volunteers, volunteerType]);

  // Get selected volunteer
  const selectedVolunteer = volunteers.find(v => v.id === value) || null;

  return (
    <FormControl fullWidth required={required}>
      <FormLabel sx={{ mb: 1, fontWeight: 600 }}>{label}{required && ' *'}</FormLabel>
      <Autocomplete
        size="small"
        options={filteredVolunteers}
        value={selectedVolunteer}
        onChange={(_, newValue) => {
          onChange(newValue ? newValue.id : undefined);
        }}
        getOptionLabel={(option) => 
          option ? `${option.ad} ${option.soyad} (${option.gonulluluk_no})` : ''
        }
        filterOptions={(options, { inputValue }) => {
          // Custom filtering to handle both display format and individual fields
          if (!inputValue.trim()) return options;
          
          const searchLower = inputValue.toLowerCase();
          const filtered = options.filter(option => {
            return (
              option.gonulluluk_no?.toLowerCase().includes(searchLower) ||
              option.ad?.toLowerCase().includes(searchLower) ||
              option.soyad?.toLowerCase().includes(searchLower) ||
              `${option.ad} ${option.soyad}`.toLowerCase().includes(searchLower) ||
              `${option.ad} ${option.soyad} (${option.gonulluluk_no})`.toLowerCase().includes(searchLower) ||
              option.sehir?.toLowerCase().includes(searchLower)
            );
          });
          
          return filtered;
        }}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderOption={(props, option) => {
          const { key, ...otherProps } = props;
          return (
            <Box component="li" key={key} {...otherProps}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" fontWeight={600}>
                    {option.ad} {option.soyad}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.gonulluluk_no} • {option.sehir}
                  </Typography>
                </Box>
                <Chip
                  icon={getVolunteerTypeIcon(option.gonullu_tipi)}
                  label={getVolunteerTypeLabel(option.gonullu_tipi)}
                  size="small"
                  color={getVolunteerTypeColor(option.gonullu_tipi)}
                  variant="outlined"
                />
              </Stack>
            </Box>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="G1234567890 numarası veya isim ile arayın..."
            error={!!error}
            helperText={error || `${filteredVolunteers.length} gönüllü bulundu`}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
        loading={loading}
        disabled={disabled || loading}
        noOptionsText="Arama kriterine uygun gönüllü bulunamadı"
        clearOnBlur={false}
        selectOnFocus
        handleHomeEndKeys
        clearText="Temizle"
        closeText="Kapat"
        openText="Aç"
        loadingText="Yükleniyor..."
      />
    </FormControl>
  );
}
