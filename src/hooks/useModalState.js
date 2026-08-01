import { useState, useCallback } from 'react';

/**
 * Custom hook for managing modal visibility, active editing items, and submission loading states
 * @param {*} [initialItem=null] 
 */
export function useModalState(initialItem = null) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(initialItem);
  const [submitting, setSubmitting] = useState(false);

  const openModal = useCallback((item = null) => {
    setEditingItem(item);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setEditingItem(null);
    setSubmitting(false);
  }, []);

  return {
    isOpen,
    setIsOpen,
    editingItem,
    setEditingItem,
    submitting,
    setSubmitting,
    openModal,
    closeModal,
  };
}

export default useModalState;
