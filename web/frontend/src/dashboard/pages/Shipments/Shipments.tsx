import React from 'react';
import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
  FormControl,
  FormLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
} from '@mui/material';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import DashboardPageLayout from '../../components/DashboardPageLayout';
import { Shipment, ShipmentFormData, ShipmentFilters } from './types';
// Mock data import removed - now using real API data
import { cargoTypes, statusOptions } from './data/contentOptions';
import { useShipments } from './hooks/useShipments';
import { useShipmentDialogs } from './hooks/useShipmentDialogs';
import ShipmentList from './components/ShipmentList';
import ShipmentCreateDialog from './components/ShipmentCreateDialog';
import ShipmentEditDialog from './components/ShipmentEditDialog';
import ShipmentDetailDialog from './components/ShipmentDetailDialog';


export default function Shipments() {
  // Hooks
  const {
    shipments,
    filteredShipments,
    filters,
    setFilters,
    addShipment,
    updateShipment,
    // deleteShipment, // Will be used for delete functionality later
    loading,
    error,
  } = useShipments();

  const {
    isCreateDialogOpen,
    openCreateDialog,
    closeCreateDialog,
    isEditDialogOpen,
    editingShipment,
    openEditDialog,
    closeEditDialog,
    isDetailDrawerOpen,
    selectedShipment,
    openDetailDrawer,
    closeDetailDrawer,
  } = useShipmentDialogs();

  // Local state
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'success' });

  // Get unique values for filters
  const uniqueOriginCities = React.useMemo(() => {
    const cities = new Set<string>();
    shipments.forEach(s => {
      if (s.cikis_yeri) cities.add(s.cikis_yeri);
    });
    return Array.from(cities).filter(Boolean);
  }, [shipments]);

  const uniqueDestinationCities = React.useMemo(() => {
    const cities = new Set<string>();
    shipments.forEach(s => {
      if (s.ulasacagi_yer) cities.add(s.ulasacagi_yer);
    });
    return Array.from(cities).filter(Boolean);
  }, [shipments]);

  // Event handlers
  const handleRowClick = (shipment: Shipment) => {
    openDetailDrawer(shipment);
  };

  const handleCreateShipment = async (formData: ShipmentFormData) => {
    try {
      await addShipment(formData);
      closeCreateDialog();
      setSnackbar({
        open: true,
        message: 'Kargo başarıyla eklendi!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Kargo eklenirken hata oluştu!',
        severity: 'error'
      });
    }
  };

  const handleUpdateShipment = async (id: number, formData: ShipmentFormData) => {
    try {
      await updateShipment(id, formData);
      closeEditDialog();
      setSnackbar({
        open: true,
        message: 'Kargo başarıyla güncellendi!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Kargo güncellenirken hata oluştu!',
        severity: 'error'
      });
    }
  };

  const handleFilterChange = (field: keyof ShipmentFilters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Show error if exists
  React.useEffect(() => {
    if (error) {
      setSnackbar({
        open: true,
        message: error,
        severity: 'error'
      });
    }
  }, [error]);

  return (
    <DashboardPageLayout
      title="Kargo Yönetimi"
      description="Afet yardım malzemelerinin kargo takip sistemi. Yardım malzemelerinin gönderim, taşıma ve teslimat süreçlerinin koordinasyonu ve izlenmesi."
      icon={LocalShippingRoundedIcon}
    >
      {/* Error Display */}
      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Stack direction="row" spacing={1}>
              <Button 
                color="inherit" 
                size="small" 
                onClick={async () => {
                  try {
                    const { cargoApi } = await import('./data/apiService');
                    await cargoApi.healthCheck();
                    setSnackbar({
                      open: true,
                      message: 'Backend bağlantısı başarılı! ✅',
                      severity: 'success'
                    });
                  } catch (err: any) {
                    setSnackbar({
                      open: true,
                      message: `Bağlantı testi başarısız: ${err.message}`,
                      severity: 'error'
                    });
                  }
                }}
              >
                Test Et
              </Button>
              <Button 
                color="inherit" 
                size="small" 
                onClick={() => window.location.reload()}
              >
                Yenile
              </Button>
            </Stack>
          }
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Bağlantı Hatası
          </Typography>
          {error}
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
            💡 Backend sunucusunun çalıştığından emin olun: <code>npm run dev</code>
          </Typography>
        </Alert>
      )}

      {/* Connection Status */}
      {loading && (
        <Alert severity="info" sx={{ mb: 3 }}>
          <Typography variant="subtitle2">
            🔄 Backend sunucusuna bağlanılıyor...
          </Typography>
          Kargo verileri yükleniyor. Lütfen bekleyin.
        </Alert>
      )}

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filtreler
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-end" sx={{ flex: 1 }}>
              <FormControl sx={{ minWidth: 280 }}>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Arama</FormLabel>
                <TextField
                  placeholder="AYK-123456789 formatında kargo kodu arayın"
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  size="small"
                />
              </FormControl>
              <FormControl sx={{ minWidth: 140 }}>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Kargo Tipi</FormLabel>
                <Select
                  value={filters.cargoTypeFilter}
                  onChange={(e) => handleFilterChange('cargoTypeFilter', e.target.value)}
                  size="small"
                >
                  <MenuItem value="">Tümü</MenuItem>
                  {cargoTypes.map((type) => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 140 }}>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Çıkış Yeri</FormLabel>
                <Select
                  value={filters.originCityFilter}
                  onChange={(e) => handleFilterChange('originCityFilter', e.target.value)}
                  size="small"
                >
                  <MenuItem value="">Tümü</MenuItem>
                  {uniqueOriginCities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city.charAt(0).toUpperCase() + city.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 140 }}>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Varış Yeri</FormLabel>
                <Select
                  value={filters.destinationCityFilter}
                  onChange={(e) => handleFilterChange('destinationCityFilter', e.target.value)}
                  size="small"
                >
                  <MenuItem value="">Tümü</MenuItem>
                  {uniqueDestinationCities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {city.charAt(0).toUpperCase() + city.slice(1)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 130 }}>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Durum</FormLabel>
                <Select
                  value={filters.statusFilter}
                  onChange={(e) => handleFilterChange('statusFilter', e.target.value)}
                  size="small"
                >
                  <MenuItem value="">Tümü</MenuItem>
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Stack>
            <Button
              variant="contained"
              onClick={openCreateDialog}
              sx={{ minWidth: 160, height: 40, flexShrink: 0 }}
            >
              Yeni Kargo Ekle
            </Button>
          </Stack>
        </CardContent>
      </Card>

      {/* Shipment List */}
      <ShipmentList
        shipments={filteredShipments}
        onRowClick={handleRowClick}
        onEdit={openEditDialog}
        onViewDetails={openDetailDrawer}
        loading={loading}
      />

      {/* Create Dialog */}
      <ShipmentCreateDialog
        open={isCreateDialogOpen}
        onClose={closeCreateDialog}
        onSubmit={handleCreateShipment}
        loading={loading}
      />

      {/* Edit Dialog */}
      <ShipmentEditDialog
        open={isEditDialogOpen}
        shipment={editingShipment}
        onClose={closeEditDialog}
        onSubmit={handleUpdateShipment}
        loading={loading}
      />

      {/* Detail Dialog */}
      <ShipmentDetailDialog
        open={isDetailDrawerOpen}
        shipment={selectedShipment}
        onClose={closeDetailDrawer}
        onEdit={openEditDialog}
      />

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </DashboardPageLayout>
  );
}
