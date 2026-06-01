import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ControlledInput } from "@/components/form/ControlledInput";
import { ControlledSelect } from "@/components/form/ControlledSelect";
import { OrganizationsRelationSelect } from "@/components/form/relation-selects";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from "../../hooks/useUpdateUser";
import { userFormSchema, type UserFormData } from "../../schemas/user-schema";
import { USER_ROLE_OPTIONS } from "../../constants";
import type { User } from "../../api/types";

const roleOptions = USER_ROLE_OPTIONS.filter((o) => o.value !== "all");

const defaultValues: UserFormData = {
  name: "",
  email: "",
  role: "motorista",
  organization_id: null,
};

type UserFormDialogProps = {
  open: boolean;
  onClose: () => void;
  user?: User;
};

export const UserFormDialog = ({ open, onClose, user }: UserFormDialogProps) => {
  const isCreate = user == null;
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { mutate: createUser, isPending: isCreating } = useCreateUser();
  const { mutate: updateUser, isPending: isUpdating } = useUpdateUser();
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();
  const isPending = isCreating || isUpdating;

  const form = useForm<UserFormData>({
    resolver: zodResolver(userFormSchema as any),
    defaultValues,
  });

  useEffect(() => {
    if (!open) return;
    form.reset(
      isCreate
        ? defaultValues
        : {
            name: user.name,
            email: user.email,
            role: user.role,
            organization_id: user.organization_id ?? null,
          },
    );
  }, [open, user, isCreate, form]);

  const onSubmit = form.handleSubmit((data) => {
    if (isCreate) {
      createUser(data, { onSuccess: onClose });
      return;
    }
    updateUser({ id: user.id, data }, { onSuccess: onClose });
  });

  const handleDelete = () => {
    if (!user) return;
    deleteUser(user.id, {
      onSuccess: () => {
        setConfirmDelete(false);
        onClose();
      },
    });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{isCreate ? "Novo Usuário" : "Editar Usuário"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={onSubmit} className="space-y-4">
            <ControlledInput control={form.control} name="name" label="Nome" placeholder="Nome completo" />
            <ControlledInput control={form.control} name="email" label="E-mail" placeholder="email@exemplo.com" />
            <ControlledSelect
              control={form.control}
              name="role"
              label="Perfil"
              options={roleOptions.map((o) => ({ value: o.value, label: o.label }))}
            />
            <div className="space-y-1">
              <Label>Frota / Organização</Label>
              <Controller
                control={form.control}
                name="organization_id"
                render={({ field }) => (
                  <OrganizationsRelationSelect
                    value={field.value ?? undefined}
                    onValueChange={(v) => field.onChange(v ?? null)}
                    placeholder="Sem organização"
                  />
                )}
              />
            </div>
            <div className="flex items-center justify-between pt-2">
              {!isCreate ? (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => setConfirmDelete(true)}
                >
                  <Trash className="mr-1 h-3 w-3" />
                  Excluir
                </Button>
              ) : (
                <span />
              )}
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Salvando…" : isCreate ? "Criar" : "Salvar"}
                </Button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {!isCreate && (
        <Dialog open={confirmDelete} onOpenChange={setConfirmDelete}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Excluir usuário</DialogTitle>
              <DialogDescription>
                Tem certeza que deseja excluir <strong>{user.name}</strong>? Esta ação não pode ser desfeita.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
              <Button variant="destructive" disabled={isDeleting} onClick={handleDelete}>
                Excluir
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
