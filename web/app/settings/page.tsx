"use client";

import { useState, useEffect } from "react";
import api from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { PreferencesResponse } from "@/types/api";

export default function SettingsPage() {
  const [preferences, setPreferences] = useState({
    daily_digest_enabled: false,
    digest_time: "06:00",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get<PreferencesResponse>("/user/preferences");
        // Backend returns: { success, message, data: preferences }
        setPreferences(res.data.data);
      } catch {
        setMsg({ type: "error", text: "Failed to load preferences" });
      }
    })();
  }, []);

  const save = async () => {
    setSaving(true);
    setMsg(null);
    try {
      await api.put("/user/preferences", preferences);
      setMsg({ type: "success", text: "Saved!" });
    } catch {
      setMsg({ type: "error", text: "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Email Preferences</h1>
      <Card className="p-6 space-y-6">
        {msg && (
          <Alert variant={msg.type === "error" ? "destructive" : "success"}>
            {msg.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle2 className="h-4 w-4" />
            )}
            <AlertDescription>{msg.text}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between">
          <div>
            <Label className="text-base font-semibold">Daily Task Digest</Label>
            <p className="text-sm opacity-70">
              Get a daily email summary of your tasks.
            </p>
          </div>
          <Switch
            checked={preferences.daily_digest_enabled}
            onCheckedChange={(v) =>
              setPreferences((p) => ({ ...p, daily_digest_enabled: v }))
            }
          />
        </div>

        {preferences.daily_digest_enabled && (
          <div className="space-y-2">
            <Label htmlFor="digest_time">Delivery Time</Label>
            <Input
              id="digest_time"
              type="time"
              value={preferences.digest_time}
              onChange={(e) =>
                setPreferences((p) => ({ ...p, digest_time: e.target.value }))
              }
              className="w-44"
            />
          </div>
        )}

        <Button onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </Button>
      </Card>
    </div>
  );
}
