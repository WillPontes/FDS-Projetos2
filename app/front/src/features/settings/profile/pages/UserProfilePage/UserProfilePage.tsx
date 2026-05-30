import { Link } from "@tanstack/react-router";
import {
  Bell,
  Car,
  ChevronRight,
  HelpCircle,
  History,
  LogOut,
} from "lucide-react";
import { useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageLayout } from "@/components/layout/PageLayout";
import { USER_ROLE_LABELS } from "@/constants/current-user";
import { useAuthStore, useCurrentUser, useLogout } from "@/features/auth";
import { useGetRawVehicles } from "@/features/users/hooks/useGetRawVehicles";
import { findVehicleForUser } from "@/features/users/lib/join-users-with-vehicles";

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const profileLinks = [
  {
    to: "/passagens" as const,
    label: "Histórico de Passagens",
    description: "Veja suas passagens e impacto acumulado",
    icon: History,
  },
  {
    to: "/perfil/notificacoes" as const,
    label: "Configuração de Notificações",
    description: "Gerencie alertas por e-mail e push",
    icon: Bell,
  },
  {
    to: "/perfil/veiculo" as const,
    label: "Informações do Veículo",
    description: "Detalhes do veículo vinculado à sua conta",
    icon: Car,
  },
  {
    to: "/ajuda" as const,
    label: "Ajuda e Suporte",
    description: "FAQ e canais de contato",
    icon: HelpCircle,
  },
];

export const UserProfilePage = () => {
  const { user, isAuthenticated } = useCurrentUser();
  const logout = useLogout();
  const updateUser = useAuthStore((state) => state.updateUser);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: vehicles = [] } = useGetRawVehicles();

  if (!isAuthenticated || !user) {
    return (
      <PageLayout title="Meu perfil">
        <p className="text-muted-foreground">
          Faça login para acessar seu perfil.
        </p>
      </PageLayout>
    );
  }

  const vehicle = findVehicleForUser(user.id, vehicles);
  const status = user.status ?? "active";

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    updateUser({ avatarUrl: url });
  };

  return (
    <PageLayout
      title="Meu perfil"
      description="Visualize e gerencie suas informações pessoais."
    >
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader className="items-center text-center">
            <button
              type="button"
              className="group relative"
              onClick={() => fileInputRef.current?.click()}
            >
              <Avatar className="size-24">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                ) : null}
                <AvatarFallback className="text-lg">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <span className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
                Alterar foto
              </span>
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <CardTitle>{user.name}</CardTitle>
            <CardDescription>{user.email}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Perfil</span>
              <span>{USER_ROLE_LABELS[user.role]}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Status</span>
              <Badge variant={status === "active" ? "success" : "secondary"}>
                {status === "active" ? "Ativo" : "Inativo"}
              </Badge>
            </div>
            {vehicle ? (
              <>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID da frota</span>
                  <span>{vehicle.id_tag}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Placa</span>
                  <span>{vehicle.license_plate}</span>
                </div>
              </>
            ) : (
              <p className="text-muted-foreground">Nenhum veículo vinculado.</p>
            )}
            <Button
              type="button"
              variant="destructive"
              className="mt-4 w-full"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {profileLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="flex items-center gap-4 rounded border border-neutral-300 bg-white p-4 transition-colors hover:bg-accent"
            >
              <link.icon className="size-5 shrink-0 text-muted-foreground" />
              <div className="flex-1">
                <p className="font-medium">{link.label}</p>
                <p className="text-sm text-muted-foreground">
                  {link.description}
                </p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground" />
            </Link>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};
