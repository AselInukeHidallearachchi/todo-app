"use client";

import { useEffect, useRef } from "react";
import { useToast } from "@/context/ToastContext";

interface ActionResponse {
  success: boolean;
  message?: string;
}

interface UseActionToastOptions {
  onSuccess?: () => void;
  onError?: () => void;
  successTitle?: string;
  errorTitle?: string;
  successDescription?: string;
  errorDescription?: string;
}

/**
 * Automatically shows toast notifications for server action responses
 * @param state - The action response state from useActionState
 * @param options - Optional callbacks and custom messages
 */
export function useActionToast(
  state: ActionResponse | null,
  options?: UseActionToastOptions
) {
  const { showSuccess, showError } = useToast();
  const lastProcessedState = useRef<ActionResponse | null>(null);

  useEffect(() => {
    // Only process if state exists and is different from last processed state
    if (state && state !== lastProcessedState.current) {
      lastProcessedState.current = state;
      if (state?.success === true) {
        showSuccess(
          options?.successTitle || "Success",
          options?.successDescription ||
            state.message ||
            "Operation completed successfully"
        );

        options?.onSuccess?.();
      } else if (state?.success === false && state?.message) {
        showError(
          options?.errorTitle || "Error",
          options?.errorDescription || state.message
        );
        options?.onError?.();
      }
    }
  }, [state, showSuccess, showError, options]);
}
