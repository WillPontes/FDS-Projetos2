import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, Navigate, useNavigate, useParams } from "@tanstack/react-router";
import { Trash } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ControlledInput } from "@/components/form/ControlledInput";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { FormActions } from "@/components/form/FormActions";
import { PageLayout } from "@/components/layout/PageLayout";
import { useCurrentUser } from "@/features/auth";
import { USER_ROLE_OPTIONS } from "../../constants";
import { useGetUser } from "../../hooks/useGetUser";
import { useDeleteUser, useUpdateUser } from "../../hooks/useUpdateUser";
import { userFormSchema, type UserFormData } from "../../schemas/user-schema";

const roleOptions = USER_ROLE_OPTIONS.filter(
  (option) => option.value !== "all",
);

export const EditUserPage = () => {
  const navigate = useNavigate();
  const { user: currentUser, isAuthenticated } = useCurrentUser();
  const { id } = useParams({ from: "/usuarios/editar/$id" });
  const userId = Number(id);
  const isValidId = Number.isFinite(userId);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: user, isLoading, isError } = useGetUser(userId, isValidId);
  const { mutate: updateUser, isPending } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema as any),
    defaultValues: {
      name: "",
      email: "",
      role: "motorista",
      organization_id: null,
    },
  });

  useEffect(() => {
    if (!user) return;
    form.reset({
      name: user.name,
      email: user.email,
      role: user.role,
      organization_id: user.organization_id,
    });
  }, [user, form]);

  const onSubmit = (formData: UserFormData) => {
    updateUser(
      { id: userId, data: formData },
      {
        onSuccess: () => navigate({ to: "/usuarios" }),
      },
    );
  };

  const handleDelete = () => {
    deleteUser(userId, {
      onSuccess: () => {
        setShowDeleteDialog(false);
        navigate({ to: "/usuarios" });
      },
    });
  };

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/" />;
  }

  if (currentUser.role !== "admin") {
    return <Navigate to="/perfil" />;
  }

  if (!isValidId) {
    return (
      <PageLayout title="Editar Usuário">
        <p className="text-destructive" role="alert">
          Identificador de usuário inválido.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/usuarios">Voltar para usuários</Link>
        </Button>
      </PageLayout>
    );
  }

  if (isLoading) {
    return (
      <PageLayout title="Editar Usuário">
        <p className="text-muted-foreground">Carregando...</p>
      </PageLayout>
    );
  }

  if (isError || !user) {
    return (
      <PageLayout title="Editar Usuário">
        <p className="text-destructive" role="alert">
          Usuário não encontrado.
        </p>
        <Button asChild variant="outline" className="mt-4">
          <Link to="/usuarios">Voltar para usuários</Link>
        </Button>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Editar Usuário"
      description="Atualize os dados do usuário ou remova o cadastro."
    >
      <section className="max-w-xl space-y-6 rounded border border-neutral-300 bg-white p-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <ControlledInput
            control={form.control}
            name="name"
            label="Nome"
            placeholder="Nome completo"
          />
          <ControlledInput
            control={form.control}
            name="email"
            label="E-mail"
            placeholder="email@exemplo.com"
          />
          <ControlledSelect
            control={form.control}
            name="role"
            label="Perfil"
            options={roleOptions.map((option) => ({
              value: option.value,
              label: option.label,
            }))}
          />
          <ControlledInput
            control={form.control}
            name="organization_id"
            label="ID da organização"
            type="number"
            placeholder="Opcional"
          />
          <FormActions>
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/usuarios" })}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando…" : "Salvar"}
            </Button>
          </FormActions>
        </form>

        <div className="border-t pt-4">
          <Button
            type="button"
            variant="destructive"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash className="h-4 w-4" />
            Excluir usuário
          </Button>
        </div>
      </section>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir usuário</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir <strong>{user.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};
