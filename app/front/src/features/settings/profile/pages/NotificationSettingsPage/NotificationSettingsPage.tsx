import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
import { useCurrentUser } from "@/features/auth";
import type { NotificationSettings } from "@/features/users/api/types";
import { getToastErrorMessage } from "@/lib/api-error";
import { useNotificationSettings } from "../../../hooks/useNotificationSettings";

export const NotificationSettingsPage = () => {
  const { user } = useCurrentUser();
  const { query, mutation } = useNotificationSettings(user?.id);
  const [settings, setSettings] = useState<NotificationSettings | null>(null);

  useEffect(() => {
    if (query.data) {
      setSettings(query.data);
    }
  }, [query.data]);

  const handleSave = () => {
    if (!settings || user?.id == null) return;
    mutation.mutate(settings, {
      onSuccess: () => {
        toast.success("Preferências de notificação salvas!");
      },
      onError: (error) => {
        toast.error(
          getToastErrorMessage(error, {
            fallback: "Erro ao salvar preferências.",
          }),
        );
      },
    });
  };

  if (query.isLoading || !settings) {
    return (
      <PageLayout
        title="Notificações"
        description="Configure como deseja receber alertas e relatórios."
      >
        <div className="flex justify-center py-12">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Notificações"
      description="Configure como deseja receber alertas e relatórios."
    >
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Preferências de Notificação</CardTitle>
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
                setSettings((prev) =>
                  prev ? { ...prev, emailAlerts: checked } : prev,
                )
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
                setSettings((prev) =>
                  prev ? { ...prev, pushAlerts: checked } : prev,
                )
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
                setSettings((prev) =>
                  prev ? { ...prev, weeklyReport: checked } : prev,
                )
              }
            />
          </div>
          <Button
            type="button"
            onClick={handleSave}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Salvando...
              </>
            ) : (
              "Salvar preferências"
            )}
          </Button>
        </CardContent>
      </Card>
    </PageLayout>
  );
};
