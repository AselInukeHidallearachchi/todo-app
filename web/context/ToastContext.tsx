"use client";

import { createContext, useContext, ReactNode } from "react";
import { toast } from "sonner";

interface ToastContextType {
  showSuccess: (message: string, description?: string) => void;
  showError: (message: string, description?: string) => void;
  showWarning: (message: string, description?: string) => void;
  showInfo: (message: string, description?: string) => void;
  handleActionResponse: (response: {
    success: boolean;
    message?: string;
  }) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const showSuccess = (message: string, description?: string) => {
    toast.success(message, { description });
  };

  const showError = (message: string, description?: string) => {
    toast.error(message, { description });
  };

  const showWarning = (message: string, description?: string) => {
    toast.warning(message, { description });
  };

  const showInfo = (message: string, description?: string) => {
    toast.info(message, { description });
  };

  // Helper to handle server action responses
  const handleActionResponse = (response: {
    success: boolean;
    message?: string;
  }) => {
    if (response.success) {
      showSuccess(response.message || "Operation successful");
    } else {
      showError(response.message || "Operation failed");
    }
  };

  return (
    <ToastContext.Provider
      value={{
        showSuccess,
        showError,
        showWarning,
        showInfo,
        handleActionResponse,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
