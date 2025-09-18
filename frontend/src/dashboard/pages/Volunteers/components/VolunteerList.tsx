import * as React from 'react';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
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
} from '@mui/x-data-grid';
import { trTR } from '@mui/x-data-grid/locales';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useDialogs } from '../hooks/useDialogs/useDialogs';
import useNotifications from '../hooks/useNotifications/useNotifications';
import {
  deleteOne as deleteVolunteer,
  getMany as getVolunteers,
  type Volunteer,
} from '../data/volunteers';
import VolunteerCreateDialog from './VolunteerCreateDialog';
import VolunteerEditDialog from './VolunteerEditDialog';
import VolunteerShowDialog from './VolunteerShowDialog';
import { dateUtils } from '../../../theme/customizations/dateUtils';

const INITIAL_PAGE_SIZE = 10;

export default function VolunteerList() {
  const dialogs = useDialogs();
  const notifications = useNotifications();

  // Dialog states
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [showDialogOpen, setShowDialogOpen] = React.useState(false);
  const [selectedVolunteerId, setSelectedVolunteerId] = React.useState<number | null>(null);

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

  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

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

      setRowsState({
        rows: listData.items,
        rowCount: listData.itemCount,
      });
    } catch (listDataError) {
      setError(listDataError as Error);
    }

    setIsLoading(false);
  }, [paginationModel, sortModel, filterModel]);

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

  const handleRowDelete = React.useCallback(
    (volunteer: Volunteer) => async () => {
      const confirmed = await dialogs.confirm(
        `${volunteer.name} ${volunteer.surname} adlı gönüllüyü silmek istediğinizden emin misiniz?`,
        {
          title: `Gönüllüyü sil?`,
          severity: 'error',
          okText: 'Sil',
          cancelText: 'İptal',
        },
      );

      if (confirmed) {
        setIsLoading(true);
        try {
          await deleteVolunteer(Number(volunteer.id));

          notifications.show('Gönüllü başarıyla silindi.', {
            severity: 'success',
            autoHideDuration: 3000,
          });
          loadData();
        } catch (deleteError) {
          notifications.show(
            `Gönüllü silinirken hata oluştu: ${(deleteError as Error).message}`,
            {
              severity: 'error',
              autoHideDuration: 3000,
            },
          );
        }
        setIsLoading(false);
      }
    },
    [dialogs, notifications, loadData],
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

  const handleShowDialogDelete = React.useCallback(async () => {
    if (!selectedVolunteerId) return;

    const volunteer = rowsState.rows.find(v => v.id === selectedVolunteerId);
    if (!volunteer) return;

    // Use the existing handleRowDelete logic to avoid duplication
    await handleRowDelete(volunteer)();
    
    // Close the show dialog after successful deletion
    setShowDialogOpen(false);
    setSelectedVolunteerId(null);
  }, [selectedVolunteerId, rowsState.rows, handleRowDelete]);

  const initialState = React.useMemo(
    () => ({
      pagination: { paginationModel: { pageSize: INITIAL_PAGE_SIZE } },
    }),
    [],
  );

  const columns = React.useMemo<GridColDef[]>(
    () => [
      { field: 'id', headerName: 'ID' },
      { field: 'name', headerName: 'Ad', width: 140 },
      { field: 'surname', headerName: 'Soyad', width: 140 },
      { field: 'email', headerName: 'E-posta', width: 200 },
      { field: 'phone', headerName: 'Telefon', width: 140 },
      { field: 'city', headerName: 'Şehir', width: 120 },
      {
        field: 'joinDate',
        headerName: 'Katılım Tarihi',
        width: 130,
        renderCell: (params) => {
          return dateUtils.formatDateTime(params.value);
        },
      },
      {
        field: 'actions',
        type: 'actions',
        flex: 1,
        align: 'right',
        getActions: ({ row }) => [
          <GridActionsCellItem
            key="show-item"
            icon={<VisibilityIcon />}
            label="Görüntüle"
            onClick={handleRowShow(row)}
          />,
          <GridActionsCellItem
            key="edit-item"
            icon={<EditIcon />}
            label="Düzenle"
            onClick={handleRowEdit(row)}
          />,
          <GridActionsCellItem
            key="delete-item"
            icon={<DeleteIcon />}
            label="Sil"
            onClick={handleRowDelete(row)}
          />,
        ],
      },
    ],
    [handleRowShow, handleRowEdit, handleRowDelete],
  );

  return (
    <>
      {/* Controls */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h6">Gönüllü Listesi</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Tooltip title="Verileri yenile">
            <IconButton size="small" aria-label="refresh" onClick={handleRefresh}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          <Button
            variant="contained"
            onClick={handleCreateClick}
            startIcon={<AddIcon />}
            size="large"
          >
            Oluştur
          </Button>
        </Stack>
      </Stack>

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
              showToolbar
              pageSizeOptions={[5, INITIAL_PAGE_SIZE, 25]}
              localeText={trTR.components.MuiDataGrid.defaultProps.localeText}
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
          <VolunteerEditDialog
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
            onDelete={handleShowDialogDelete}
          />
        </>
      )}
    </>
  );
}
