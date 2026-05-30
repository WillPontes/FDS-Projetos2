import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { PageLayout } from "@/components/layout/PageLayout";
import {
  loadNotificationSettings,
  saveNotificationSettings,
  type NotificationSettings,
} from "../../../api/requests";

export const NotificationSettingsPage = () => {
  const [settings, setSettings] = useState<NotificationSettings>(
    loadNotificationSettings(),
  );

  useEffect(() => {
    saveNotificationSettings(settings);
  }, [settings]);

  const handleSave = () => {
    saveNotificationSettings(settings);
    toast.success("Preferências de notificação salvas!");
  };

  return (
    <PageLayout
      title="Notificações"
      description="Configure como deseja receber alertas e relatórios."
    >
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Preferências de notificação</CardTitle>
          <CardDescription>
            Escolha os canais e tipos de alerta que deseja receber.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-md border p-4">
            <div>
              <Label>Alertas por e-mail</Label>
              <p className="text-xs text-muted-foreground">
                Receba atualizações importantes no seu e-mail.
              </p>
            </div>
            <Switch
              checked={settings.emailAlerts}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, emailAlerts: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-4">
            <div>
              <Label>Notificações push</Label>
              <p className="text-xs text-muted-foreground">
                Alertas em tempo real no dispositivo.
              </p>
            </div>
            <Switch
              checked={settings.pushAlerts}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, pushAlerts: checked }))
              }
            />
          </div>
          <div className="flex items-center justify-between rounded-md border p-4">
            <div>
              <Label>Relatório semanal</Label>
              <p className="text-xs text-muted-foreground">
                Resumo semanal de impacto e passagens.
              </p>
            </div>
            <Switch
              checked={settings.weeklyReport}
              onCheckedChange={(checked) =>
                setSettings((prev) => ({ ...prev, weeklyReport: checked }))
              }
            />
          </div>
          <Button type="button" onClick={handleSave}>
            Salvar preferências
          </Button>
        </CardContent>
      </Card>
    </PageLayout>
  );
};
