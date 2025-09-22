import * as React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridFilterModel,
  GridPaginationModel,
  GridSortModel,
  GridEventListener,
  GridRenderCellParams,
} from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import {
  getMany as getVolunteers,
  getDisplayName,
  getCityDisplayName,
  type Volunteer,
  type VolunteerType,
} from '../data/volunteers';
import VolunteerCreateDialog from './VolunteerCreateDialog';
import VolunteerStatusDialog from './VolunteerStatusDialog';
import VolunteerShowDialog from './VolunteerShowDialog';
import { dateUtils } from '../../../theme/customizations/dateUtils';

const INITIAL_PAGE_SIZE = 10;

// Filter interface
interface VolunteerFilters {
  searchTerm: string;
  volunteerTypeFilter: string;
  cityFilter: string;
  statusFilter: string;
}

// Helper function to get volunteer type icon
const getVolunteerTypeIcon = (type: VolunteerType) => {
  switch (type) {
    case 'toplama':
      return <InventoryIcon fontSize="small" />;
    case 'tasima':
      return <LocalShippingIcon fontSize="small" />;
    case 'dagitim':
      return <DeliveryDiningIcon fontSize="small" />;
    case 'karma':
      return <GroupWorkIcon fontSize="small" />;
    default:
      return <GroupWorkIcon fontSize="small" />;
  }
};

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
      return 'Toplama';
    case 'tasima':
      return 'Taşıma';
    case 'dagitim':
      return 'Dağıtım';
    case 'karma':
      return 'Karma';
    default:
      return type;
  }
};

export default function VolunteerList() {

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [showDialogOpen, setShowDialogOpen] = React.useState(false);
  const [selectedVolunteerId, setSelectedVolunteerId] = React.useState<number | null>(null);

  // Filter states
  const [filters, setFilters] = React.useState<VolunteerFilters>({
    searchTerm: '',
    volunteerTypeFilter: '',
    cityFilter: '',
    statusFilter: '',
  });

  const [paginationModel, setPaginationModel] = React.useState<GridPaginationModel>({
    page: 0,
    pageSize: INITIAL_PAGE_SIZE,
  });
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({ items: [] });
  const [sortModel, setSortModel] = React.useState<GridSortModel>([]);

  const [rowsState, setRowsState] = React.useState<{
    rows: Volunteer[];
    rowCount: number;
  }>({
    rows: [],
    rowCount: 0,
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<Error | null>(null);

  // Filter handler
  const handleFilterChange = React.useCallback((field: keyof VolunteerFilters, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  }, []);

  // Get unique values for filters
  const uniqueCities = React.useMemo(() => 
    Array.from(new Set(rowsState.rows.map(v => v.sehir))).filter(Boolean).sort(),
    [rowsState.rows]
  );

  const handlePaginationModelChange = React.useCallback(
    (model: GridPaginationModel) => {
      setPaginationModel(model);
    },
    [],
  );

  const handleFilterModelChange = React.useCallback(
    (model: GridFilterModel) => {
      setFilterModel(model);
    },
    [],
  );

  const handleSortModelChange = React.useCallback(
    (model: GridSortModel) => {
      setSortModel(model);
    },
    [],
  );

  const loadData = React.useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const listData = await getVolunteers({
        paginationModel,
        sortModel,
        filterModel,
      });

      // Apply local filters
      let filteredItems = listData.items;

      if (filters.searchTerm) {
        const searchLower = filters.searchTerm.toLowerCase();
        filteredItems = filteredItems.filter(volunteer => 
          getDisplayName(volunteer).toLowerCase().includes(searchLower) ||
          volunteer.gonulluluk_no?.toLowerCase().includes(searchLower)
        );
      }

      if (filters.volunteerTypeFilter) {
        filteredItems = filteredItems.filter(volunteer => 
          volunteer.gonullu_tipi === filters.volunteerTypeFilter
        );
      }

      if (filters.cityFilter) {
        filteredItems = filteredItems.filter(volunteer => 
          volunteer.sehir === filters.cityFilter
        );
      }

      if (filters.statusFilter) {
        const isActive = filters.statusFilter === 'true';
        filteredItems = filteredItems.filter(volunteer => 
          volunteer.is_active === isActive
        );
      }

      setRowsState({
        rows: filteredItems,
        rowCount: filteredItems.length,
      });
    } catch (listDataError) {
      setError(listDataError as Error);
    }

    setIsLoading(false);
  }, [paginationModel, sortModel, filterModel, filters]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefresh = React.useCallback(() => {
    if (!isLoading) {
      loadData();
    }
  }, [isLoading, loadData]);

  const handleRowClick = React.useCallback<GridEventListener<'rowClick'>>(
    ({ row }) => {
      setSelectedVolunteerId(row.id);
      setShowDialogOpen(true);
    },
    [],
  );

  const handleCreateClick = React.useCallback(() => {
    setCreateDialogOpen(true);
  }, []);

  const handleRowEdit = React.useCallback(
    (volunteer: Volunteer) => () => {
      setSelectedVolunteerId(volunteer.id);
      setEditDialogOpen(true);
    },
    [],
  );

  const handleRowShow = React.useCallback(
    (volunteer: Volunteer) => () => {
      setSelectedVolunteerId(volunteer.id);
      setShowDialogOpen(true);
    },
    [],
  );


  // Dialog handlers
  const handleCreateDialogClose = React.useCallback(() => {
    setCreateDialogOpen(false);
  }, []);

  const handleCreateDialogSuccess = React.useCallback(() => {
    setCreateDialogOpen(false);
    loadData();
  }, [loadData]);

  const handleEditDialogClose = React.useCallback(() => {
    setEditDialogOpen(false);
    setSelectedVolunteerId(null);
  }, []);

  const handleEditDialogSuccess = React.useCallback(() => {
    setEditDialogOpen(false);
    setSelectedVolunteerId(null);
    loadData();
  }, [loadData]);

  const handleShowDialogClose = React.useCallback(() => {
    setShowDialogOpen(false);
    setSelectedVolunteerId(null);
  }, []);

  const handleShowDialogEdit = React.useCallback(() => {
    setShowDialogOpen(false);
    setEditDialogOpen(true);
  }, []);


  const initialState = React.useMemo(
    () => ({
      pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
      columns: {
        columnVisibilityModel: {
          id: false, // Always hide ID
          'user.email': true, // Show email on desktop, can be toggled
        },
      },
    }),
    [],
  );

  const columns = React.useMemo<GridColDef[]>(
    () => [
      { 
        field: 'id', 
        headerName: 'ID', 
        width: 70,
        hide: true // Hide ID column on mobile
      },
      { 
        field: 'gonulluluk_no', 
        headerName: 'Gönüllülük No', 
        width: 130,
        flex: 0.8
      },
      {
        field: 'fullName',
        headerName: 'Ad Soyad',
        width: 180,
        flex: 1,
        renderCell: (params: GridRenderCellParams) => {
          const volunteer = params.row as Volunteer;
          return (
            <Typography variant="body2" fontWeight={500} sx={{ lineHeight: 1.5 }}>
              {getDisplayName(volunteer)}
            </Typography>
          );
        },
        sortComparator: (_v1, _v2, param1, param2) => {
          const volunteer1 = param1.api.getRow(param1.id) as Volunteer;
          const volunteer2 = param2.api.getRow(param2.id) as Volunteer;
          const name1 = getDisplayName(volunteer1);
          const name2 = getDisplayName(volunteer2);
          return name1.localeCompare(name2);
        },
      },
      {
        field: 'gonullu_tipi',
        headerName: 'Gönüllü Tipi',
        width: 140,
        flex: 0.8,
        renderCell: (params: GridRenderCellParams) => {
          const type = params.value as VolunteerType;
          return (
            <Chip
              icon={getVolunteerTypeIcon(type)}
              label={getVolunteerTypeLabel(type)}
              color={getVolunteerTypeColor(type) as any}
              size="small"
              variant="outlined"
              sx={{ height: '24px', fontSize: '0.75rem' }}
            />
          );
        },
      },
      { 
        field: 'email', 
        headerName: 'E-posta', 
        width: 200,
        flex: 1.2,
        hide: false,
        renderCell: (params: GridRenderCellParams) => {
          const volunteer = params.row as Volunteer;
          return (
            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
              {volunteer.email || '-'}
            </Typography>
          );
        },
      },
      { 
        field: 'telefon', 
        headerName: 'Telefon', 
        width: 140,
        flex: 0.9,
        renderCell: (params: GridRenderCellParams) => {
          const phone = params.value as string;
          // Format phone number for display (5XXXXXXXXX -> 5XX XXX XX XX)
          const formattedPhone = phone && phone.length === 10 
            ? `${phone.slice(0, 3)} ${phone.slice(3, 6)} ${phone.slice(6, 8)} ${phone.slice(8, 10)}`
            : phone || '-';
          return (
            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
              {formattedPhone}
            </Typography>
          );
        },
      },
      { 
        field: 'sehir', 
        headerName: 'Şehir', 
        width: 120,
        flex: 0.8,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
              {getCityDisplayName(params.value as string)}
            </Typography>
          );
        },
      },
      {
        field: 'created_at',
        headerName: 'Katılım Tarihi',
        width: 130,
        flex: 0.9,
        renderCell: (params: GridRenderCellParams) => {
          return (
            <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
              {dateUtils.formatDateTime(params.value)}
            </Typography>
          );
        },
      },
      {
        field: 'is_active',
        headerName: 'Durum',
        width: 100,
        flex: 0.6,
        renderCell: (params: GridRenderCellParams) => {
          const isActive = params.value as boolean;
          return (
            <Chip
              label={isActive ? 'Aktif' : 'Pasif'}
              color={isActive ? 'success' : 'default'}
              size="small"
              variant="outlined"
              sx={{ height: '24px', fontSize: '0.75rem' }}
            />
          );
        },
      },
      {
        field: 'actions',
        type: 'actions',
        headerName: 'İşlemler',
        width: 120,
        flex: 0.6,
        align: 'right',
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="show-item"
            icon={<VisibilityIcon />}
            label="Görüntüle"
            onClick={handleRowShow(row)}
            color="inherit"
          />,
          <GridActionsCellItem
            key="edit-item"
            icon={<EditIcon />}
            label="Durum Düzenle"
            onClick={handleRowEdit(row)}
            color="inherit"
          />,
        ],
      },
    ],
    [handleRowShow, handleRowEdit],
  );

  return (
    <>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Filtreler
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ flexWrap: 'wrap', gap: 2 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="flex-end" sx={{ flex: 1 }}>
              <FormControl sx={{ minWidth: 300 }}>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Arama</FormLabel>
                <TextField
                  placeholder="Ad, soyad veya gönüllülük numarası ile arayın"
                  value={filters.searchTerm}
                  onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                  size="small"
                />
              </FormControl>
              <FormControl sx={{ minWidth: 150 }}>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Gönüllü Tipi</FormLabel>
                <Select
                  value={filters.volunteerTypeFilter}
                  onChange={(e) => handleFilterChange('volunteerTypeFilter', e.target.value)}
                  size="small"
                >
                  <MenuItem value="">Tümü</MenuItem>
                  <MenuItem value="toplama">Toplama Gönüllüsü</MenuItem>
                  <MenuItem value="tasima">Taşıma Gönüllüsü</MenuItem>
                  <MenuItem value="dagitim">Dağıtım Gönüllüsü</MenuItem>
                  <MenuItem value="karma">Karma Gönüllü</MenuItem>
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 150 }}>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Şehir</FormLabel>
                <Select
                  value={filters.cityFilter}
                  onChange={(e) => handleFilterChange('cityFilter', e.target.value)}
                  size="small"
                >
                  <MenuItem value="">Tümü</MenuItem>
                  {uniqueCities.map((city) => (
                    <MenuItem key={city} value={city}>
                      {getCityDisplayName(city)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ minWidth: 120 }}>
                <FormLabel sx={{ mb: 1, fontWeight: 600 }}>Durum</FormLabel>
                <Select
                  value={filters.statusFilter}
                  onChange={(e) => handleFilterChange('statusFilter', e.target.value)}
                  size="small"
                >
                  <MenuItem value="">Tümü</MenuItem>
                  <MenuItem value="true">Aktif</MenuItem>
                  <MenuItem value="false">Pasif</MenuItem>
                </Select>
              </FormControl>
            </Stack>
            
            {/* Action Buttons - Separated on the right */}
            <Stack direction="row" alignItems="center" spacing={1} sx={{ ml: 2 }}>
              <Tooltip title="Verileri yenile">
                <IconButton size="small" aria-label="refresh" onClick={handleRefresh}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
              <Button
                variant="contained"
                onClick={handleCreateClick}
                startIcon={<AddIcon />}
                size="medium"
              >
                Oluştur
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* Table Content */}
      <Card variant="outlined">
        <CardContent>
          {error ? (
            <Alert severity="error">{error.message}</Alert>
          ) : (
            <DataGrid
              rows={rowsState.rows}
              rowCount={rowsState.rowCount}
              columns={columns}
              pagination
              sortingMode="server"
              filterMode="server"
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationModelChange}
              sortModel={sortModel}
              onSortModelChange={handleSortModelChange}
              filterModel={filterModel}
              onFilterModelChange={handleFilterModelChange}
              disableRowSelectionOnClick
              onRowClick={handleRowClick}
              loading={isLoading}
              initialState={initialState}
              slots={{
                toolbar: () => null, // Remove default toolbar for cleaner look
              }}
              pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25, 50]}
              localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
              rowHeight={60}
              sx={{
                // Responsive styling
                '& .MuiDataGrid-root': {
                  border: 'none',
                },
                '& .MuiDataGrid-cell': {
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 16px',
                },
                '& .MuiDataGrid-columnHeaders': {
                  backgroundColor: 'rgba(0, 0, 0, 0.04)',
                  borderBottom: '1px solid rgba(224, 224, 224, 1)',
                },
                '& .MuiDataGrid-virtualScroller': {
                  backgroundColor: 'white',
                },
                // Mobile responsive adjustments
                '@media (max-width: 768px)': {
                  '& .MuiDataGrid-columnHeader[data-field="user.email"]': {
                    display: 'none',
                  },
                  '& .MuiDataGrid-cell[data-field="user.email"]': {
                    display: 'none',
                  },
                },
                '@media (max-width: 600px)': {
                  '& .MuiDataGrid-columnHeader[data-field="created_at"]': {
                    display: 'none',
                  },
                  '& .MuiDataGrid-cell[data-field="created_at"]': {
                    display: 'none',
                  },
                },
              }}
              autoHeight
              disableColumnMenu={false}
              disableColumnSelector={false}
              disableDensitySelector={false}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialogs */}
      <VolunteerCreateDialog
        open={createDialogOpen}
        onClose={handleCreateDialogClose}
        onSuccess={handleCreateDialogSuccess}
      />

      {selectedVolunteerId && (
        <>
          <VolunteerStatusDialog
            open={editDialogOpen}
            volunteerId={selectedVolunteerId}
            onClose={handleEditDialogClose}
            onSuccess={handleEditDialogSuccess}
          />

          <VolunteerShowDialog
            open={showDialogOpen}
            volunteerId={selectedVolunteerId}
            onClose={handleShowDialogClose}
            onEdit={handleShowDialogEdit}
          />
        </>
      )}
    </>
  );
}
