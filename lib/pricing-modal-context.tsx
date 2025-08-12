'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface PricingModalContextType {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

const PricingModalContext = createContext<PricingModalContextType | undefined>(undefined);

export function PricingModalProvider({ children }: { children: ReactNode }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <PricingModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
      {children}
    </PricingModalContext.Provider>
  );
}

export function usePricingModal() {
  const context = useContext(PricingModalContext);
  if (context === undefined) {
    throw new Error('usePricingModal must be used within a PricingModalProvider');
  }
  return context;
} 