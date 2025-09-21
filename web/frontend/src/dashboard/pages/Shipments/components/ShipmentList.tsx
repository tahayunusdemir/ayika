import * as React from 'react';
import {
  Card,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Shipment } from '../types';
import { getStatusLabel, getCargoTypeLabel } from '../data/contentOptions';

interface ShipmentListProps {
  shipments: Shipment[];
  onRowClick?: (shipment: Shipment) => void;
  onEdit?: (shipment: Shipment) => void;
  onViewDetails?: (shipment: Shipment) => void;
  loading?: boolean;
}


export default function ShipmentList({
  shipments,
  onRowClick,
  onEdit,
  onViewDetails,
  loading = false,
}: ShipmentListProps) {
  const handleEdit = (event: React.MouseEvent, shipment: Shipment) => {
    event.stopPropagation();
    if (onEdit) {
      onEdit(shipment);
    }
  };

  const handleViewDetails = (event: React.MouseEvent, shipment: Shipment) => {
    event.stopPropagation();
    if (onViewDetails) {
      onViewDetails(shipment);
    }
  };

  const handleRowClick = (params: GridRowParams) => {
    if (onRowClick) {
      onRowClick(params.row as Shipment);
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'takip_no',
      headerName: 'Takip No',
      width: 130,
      minWidth: 120,
      flex: 0.8,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
          {params.value}
        </Typography>
      ),
    },
    {
      field: 'icerik',
      headerName: 'İçerik',
      width: 180,
      minWidth: 150,
      flex: 1.2,
      renderCell: (params) => (
        <Typography 
          variant="body2" 
          sx={{ 
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap'
          }}
          title={`${params.value.icerik_adi} (${getCargoTypeLabel(params.value.kargo_tipi)})`}
        >
          {params.value.icerik_adi} • {getCargoTypeLabel(params.value.kargo_tipi)}
        </Typography>
      ),
    },
    {
      field: 'toplama_gonullusu',
      headerName: 'Toplama',
      width: 140,
      minWidth: 120,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {`${params.row.gorevliler.yardim_toplama_gonullusu.ad} ${params.row.gorevliler.yardim_toplama_gonullusu.soyad}`}
        </Typography>
      ),
    },
    {
      field: 'tasima_gonullusu',
      headerName: 'Taşıma',
      width: 140,
      minWidth: 120,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.gorevliler.yardim_tasima_gorevlisi ? 
            `${params.row.gorevliler.yardim_tasima_gorevlisi.ad} ${params.row.gorevliler.yardim_tasima_gorevlisi.soyad}` : 
            '-'
          }
        </Typography>
      ),
    },
    {
      field: 'dagitim_gonullusu',
      headerName: 'Dağıtım',
      width: 140,
      minWidth: 120,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.gorevliler.yardim_dagitim_gorevlisi ? 
            `${params.row.gorevliler.yardim_dagitim_gorevlisi.ad} ${params.row.gorevliler.yardim_dagitim_gorevlisi.soyad}` : 
            '-'
          }
        </Typography>
      ),
    },
    {
      field: 'konum',
      headerName: 'Şehir',
      width: 120,
      minWidth: 100,
      flex: 0.8,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.value.sehir}
        </Typography>
      ),
    },
    {
      field: 'kargo_durumu',
      headerName: 'Durum',
      width: 120,
      minWidth: 100,
      flex: 0.8,
      renderCell: (params) => {
        const getStatusColor = (status: string) => {
          switch (status) {
            case 'hazırlanıyor':
              return 'warning.main';
            case 'yolda':
              return 'info.main';
            case 'teslim edildi':
              return 'success.main';
            case 'iptal edildi':
              return 'error.main';
            default:
              return 'text.primary';
          }
        };
        
        return (
          <Typography 
            variant="body2" 
            sx={{ 
              color: getStatusColor(params.value),
              fontWeight: 500
            }}
          >
            {getStatusLabel(params.value)}
          </Typography>
        );
      },
    },
    {
      field: 'son_guncelleme_tarihi',
      headerName: 'Son Güncelleme',
      width: 140,
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString('tr-TR');
      },
    },
    {
      field: 'actions',
      headerName: '',
      width: 100,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', gap: 0.5 }}>
          {onViewDetails && (
            <Tooltip title="Detayları Görüntüle">
              <IconButton
                size="small"
                onClick={(e) => handleViewDetails(e, params.row as Shipment)}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <VisibilityIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onEdit && (
            <Tooltip title="Düzenle">
              <IconButton
                size="small"
                onClick={(e) => handleEdit(e, params.row as Shipment)}
                sx={{ 
                  color: 'text.secondary',
                  '&:hover': {
                    color: 'text.primary',
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  return (
    <>
      <Card>
        <DataGrid
          rows={shipments}
          columns={columns}
          loading={loading}
          rowHeight={52}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          onRowClick={handleRowClick}
          sx={{
            border: 0,
            '& .MuiDataGrid-root': {
              minWidth: 0,
            },
            '& .MuiDataGrid-row:hover': {
              cursor: onRowClick ? 'pointer' : 'default',
            },
            '& .MuiDataGrid-cell': {
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: 'grey.50',
            },
            '& .MuiDataGrid-columnHeader:last-child': {
              '& .MuiDataGrid-columnHeaderTitle': {
                display: 'none',
              },
            },
          }}
          autoHeight
          disableRowSelectionOnClick
          columnVisibilityModel={{
            // Show all columns by default - responsive handled by flex
          }}
        />
      </Card>
    </>
  );
}
