import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useCurrentUser } from "@/features/auth";
import {
  loadAdminAccountSettings,
  saveAdminAccountSettings,
} from "../../api/requests";

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z.string().min(6, "Nova senha deve ter ao menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme a nova senha"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

export const AdminAccountSection = () => {
  const { user } = useCurrentUser();
  const [email, setEmail] = useState(user?.email ?? "");
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema as any),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!user) return;
    const saved = loadAdminAccountSettings(user.email);
    setEmail(saved.email);
    setTwoFactorAuth(saved.twoFactorAuth);
  }, [user]);

  const handleSaveAccount = () => {
    saveAdminAccountSettings({ email, twoFactorAuth });
    toast.success("Configurações da conta salvas!");
  };

  const handlePasswordSubmit = (_data: PasswordFormData) => {
    toast.success("Senha alterada com sucesso (mock).");
    passwordForm.reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conta do Administrador</CardTitle>
        <CardDescription>
          Gerencie e-mail, senha e autenticação em dois fatores.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="admin-email">E-mail</Label>
          <Input
            id="admin-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between rounded-md border p-4">
          <div>
            <p className="text-sm font-medium">Autenticação em dois fatores</p>
            <p className="text-xs text-muted-foreground">
              Adiciona uma camada extra de segurança ao login.
            </p>
          </div>
          <Switch checked={twoFactorAuth} onCheckedChange={setTwoFactorAuth} />
        </div>

        <Button type="button" onClick={handleSaveAccount}>
          Salvar configurações da conta
        </Button>

        <form
          onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
          className="space-y-4 border-t pt-6"
        >
          <h3 className="text-sm font-semibold">Alterar senha</h3>
          <div className="space-y-2">
            <Label htmlFor="current-password">Senha atual</Label>
            <Input
              id="current-password"
              type="password"
              {...passwordForm.register("currentPassword")}
            />
            {passwordForm.formState.errors.currentPassword ? (
              <p className="text-xs text-destructive">
                {passwordForm.formState.errors.currentPassword.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="new-password">Nova senha</Label>
            <Input
              id="new-password"
              type="password"
              {...passwordForm.register("newPassword")}
            />
            {passwordForm.formState.errors.newPassword ? (
              <p className="text-xs text-destructive">
                {passwordForm.formState.errors.newPassword.message}
              </p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirmar nova senha</Label>
            <Input
              id="confirm-password"
              type="password"
              {...passwordForm.register("confirmPassword")}
            />
            {passwordForm.formState.errors.confirmPassword ? (
              <p className="text-xs text-destructive">
                {passwordForm.formState.errors.confirmPassword.message}
              </p>
            ) : null}
          </div>
          <Button type="submit" variant="outline">
            Alterar senha
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
