import * as React from 'react';
import {
  Card,
  Typography,
  IconButton,
  Box,
  Tooltip,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef, GridRowParams } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { Shipment } from '../types';
import { getCargoTypeLabel } from '../data/contentOptions';

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
      field: 'kargo_no',
      headerName: 'Kargo No',
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
          title={`${params.value} (${getCargoTypeLabel(params.row.kargo_tipi)})`}
        >
          {params.value} • {getCargoTypeLabel(params.row.kargo_tipi)}
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
          {params.row.toplama_gonullusu_detail?.full_name || '-'}
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
          {params.row.tasima_gonullusu_detail?.full_name || '-'}
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
          {params.row.dagitim_gonullusu_detail?.full_name || '-'}
        </Typography>
      ),
    },
    {
      field: 'cikis_yeri_display',
      headerName: 'Çıkış → Varış',
      width: 150,
      minWidth: 120,
      flex: 1,
      renderCell: (params) => (
        <Typography variant="body2">
          {params.row.cikis_yeri_display} → {params.row.ulasacagi_yer_display}
        </Typography>
      ),
    },
    {
      field: 'durum',
      headerName: 'Durum',
      width: 140,
      minWidth: 120,
      flex: 1,
      renderCell: (params) => {
        const getStatusConfig = (status: string) => {
          switch (status) {
            case 'hazirlaniyor':
              return {
                color: 'primary' as const,
                icon: <InventoryIcon sx={{ fontSize: 16 }} />,
                label: 'Hazırlanıyor'
              };
            case 'yolda':
              return {
                color: 'secondary' as const,
                icon: <LocalShippingIcon sx={{ fontSize: 16 }} />,
                label: 'Yolda'
              };
            case 'teslim_edildi':
              return {
                color: 'success' as const,
                icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
                label: 'Teslim Edildi'
              };
            case 'iptal_edildi':
              return {
                color: 'error' as const,
                icon: <CancelIcon sx={{ fontSize: 16 }} />,
                label: 'İptal Edildi'
              };
            default:
              return {
                color: 'default' as const,
                icon: <InventoryIcon sx={{ fontSize: 16 }} />,
                label: params.row.durum_display || params.value || 'Bilinmiyor'
              };
          }
        };
        
        const config = getStatusConfig(params.value);
        
        return (
          <Chip
            icon={config.icon}
            label={config.label}
            color={config.color}
            size="small"
            variant="filled"
            sx={{
              fontWeight: 500,
              fontSize: '0.75rem',
              height: 24,
              '& .MuiChip-icon': {
                marginLeft: '4px',
                marginRight: '-2px'
              }
            }}
          />
        );
      },
    },
    {
      field: 'son_degisiklik',
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
