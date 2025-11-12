import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";

type AlertType = "success" | "error" | "info" | "warning" | "confirm";

interface UnifiedAlertProps {
  type: AlertType;
  title?: string;
  message: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm?: () => void;
  isLoading?: boolean;
  confirmText?: string;
  cancelText?: string;
}

const alertConfig = {
  success: {
    icon: CheckCircle2,
    variant: "success" as const,
    defaultTitle: "Success",
  },
  error: {
    icon: XCircle,
    variant: "destructive" as const,
    defaultTitle: "Error",
  },
  info: {
    icon: Info,
    variant: "default" as const,
    defaultTitle: "Information",
  },
  warning: {
    icon: AlertCircle,
    variant: "destructive" as const,
    defaultTitle: "Warning",
  },
  confirm: {
    icon: AlertCircle,
    variant: "default" as const,
    defaultTitle: "Confirm",
  },
};

export function UnifiedAlert({
  type,
  title,
  message,
  open,
  onOpenChange,
  onConfirm,
  isLoading = false,
  confirmText = "Confirm",
  cancelText = "Cancel",
}: UnifiedAlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;
  const displayTitle = title || config.defaultTitle;

  // For confirm dialogs, use AlertDialog
  if (type === "confirm") {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Icon className="h-5 w-5 text-primary" />
              {displayTitle}
            </AlertDialogTitle>
            <AlertDialogDescription>{message}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isLoading}
              className={
                type === "confirm"
                  ? ""
                  : "bg-destructive text-destructive-foreground hover:bg-destructive/90"
              }
            >
              {isLoading ? "Processing..." : confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // For other alerts, use Alert component (inline)
  return (
    <Alert variant={config.variant} className="mb-6">
      <Icon className="h-4 w-4" />
      <div>
        <AlertTitle>{displayTitle}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </div>
    </Alert>
  );
}
