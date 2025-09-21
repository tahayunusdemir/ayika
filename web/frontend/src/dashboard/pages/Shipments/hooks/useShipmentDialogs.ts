import { useState } from 'react';
import { Shipment } from '../types';

interface UseShipmentDialogsReturn {
  // Create dialog
  isCreateDialogOpen: boolean;
  openCreateDialog: () => void;
  closeCreateDialog: () => void;
  
  // Edit dialog
  isEditDialogOpen: boolean;
  editingShipment: Shipment | null;
  openEditDialog: (shipment: Shipment) => void;
  closeEditDialog: () => void;
  
  // Detail drawer
  isDetailDrawerOpen: boolean;
  selectedShipment: Shipment | null;
  openDetailDrawer: (shipment: Shipment) => void;
  closeDetailDrawer: () => void;
  
  // Delete confirmation
  isDeleteDialogOpen: boolean;
  deletingShipment: Shipment | null;
  openDeleteDialog: (shipment: Shipment) => void;
  closeDeleteDialog: () => void;
}

export function useShipmentDialogs(): UseShipmentDialogsReturn {
  // Create dialog state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Edit dialog state
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingShipment, setEditingShipment] = useState<Shipment | null>(null);
  
  // Detail drawer state
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  
  // Delete dialog state
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingShipment, setDeletingShipment] = useState<Shipment | null>(null);

  // Create dialog handlers
  const openCreateDialog = () => {
    setIsCreateDialogOpen(true);
  };

  const closeCreateDialog = () => {
    setIsCreateDialogOpen(false);
  };

  // Edit dialog handlers
  const openEditDialog = (shipment: Shipment) => {
    setEditingShipment(shipment);
    setIsEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingShipment(null);
  };

  // Detail drawer handlers
  const openDetailDrawer = (shipment: Shipment) => {
    setSelectedShipment(shipment);
    setIsDetailDrawerOpen(true);
  };

  const closeDetailDrawer = () => {
    setIsDetailDrawerOpen(false);
    setSelectedShipment(null);
  };

  // Delete dialog handlers
  const openDeleteDialog = (shipment: Shipment) => {
    setDeletingShipment(shipment);
    setIsDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeletingShipment(null);
  };

  return {
    // Create dialog
    isCreateDialogOpen,
    openCreateDialog,
    closeCreateDialog,
    
    // Edit dialog
    isEditDialogOpen,
    editingShipment,
    openEditDialog,
    closeEditDialog,
    
    // Detail drawer
    isDetailDrawerOpen,
    selectedShipment,
    openDetailDrawer,
    closeDetailDrawer,
    
    // Delete confirmation
    isDeleteDialogOpen,
    deletingShipment,
    openDeleteDialog,
    closeDeleteDialog,
  };
}
