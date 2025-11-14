"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { updatePreferencesAction } from "@/app/actions/settings";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";

/**
 * Client Component: Settings Form
 * Uses Next.js Server Actions for form submission (progressive enhancement)
 * Manages client-side state for form inputs and displays server response
 */

interface SettingsClientProps {
  initialPreferences: {
    daily_digest_enabled: boolean;
    digest_time: string;
  };
}

function SubmitButton({ disabled }: { disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled}>
      {pending ? "Saving..." : "Save"}
    </Button>
  );
}

export function SettingsClient({ initialPreferences }: SettingsClientProps) {
  // Local state for form inputs (client-side reactivity)
  const [preferences, setPreferences] = useState(initialPreferences);

  // Server Action state management with useActionState
  const [state, formAction] = useActionState(updatePreferencesAction, null);

  // Update local state when initial preferences change (after server action)
  useEffect(() => {
    setPreferences(initialPreferences);
  }, [initialPreferences]);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Email Preferences</h1>
      <Card className="p-6 space-y-6">
        {/* Server response messages */}
        {state?.success === false && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        {state?.success === true && (
          <Alert variant="success">
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        {/* Form using Server Action */}
        <form action={formAction} className="space-y-6">
          {/* Hidden inputs to pass form data to Server Action */}
          <input
            type="hidden"
            name="daily_digest_enabled"
            value={String(preferences.daily_digest_enabled)}
          />
          <input
            type="hidden"
            name="digest_time"
            value={preferences.digest_time}
          />

          {/* Daily Digest Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base font-semibold">
                Daily Task Digest
              </Label>
              <p className="text-sm opacity-70">
                Get a daily email summary of your tasks.
              </p>
            </div>
            <Switch
              checked={preferences.daily_digest_enabled}
              onCheckedChange={(value) =>
                setPreferences((prev) => ({
                  ...prev,
                  daily_digest_enabled: value,
                }))
              }
            />
          </div>

          {/* Delivery Time Input (conditionally shown) */}
          {preferences.daily_digest_enabled && (
            <div className="space-y-2">
              <Label htmlFor="digest_time">Delivery Time</Label>
              <Input
                id="digest_time"
                name="digest_time_display"
                type="time"
                value={preferences.digest_time}
                onChange={(e) =>
                  setPreferences((prev) => ({
                    ...prev,
                    digest_time: e.target.value,
                  }))
                }
                className="w-44"
              />
            </div>
          )}

          {/* Submit Button with loading state */}
          <SubmitButton />
        </form>
      </Card>
    </div>
  );
}
