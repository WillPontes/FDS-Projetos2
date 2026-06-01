import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { OrganizationsCombobox } from "@/features/fleet/components/OrganizationsCombobox/OrganizationsCombobox";
import { createUser } from "@/features/users/api/requests";
import { userQueryKeys } from "@/features/users/api/query-keys";

type DriverCreateDialogProps = {
  open: boolean;
  onClose: () => void;
};

export const DriverCreateDialog = ({ open, onClose }: DriverCreateDialogProps) => {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [organizationId, setOrganizationId] = useState<number | undefined>();

  const mutation = useMutation({
    mutationFn: () =>
      createUser({
        name,
        email,
        role: "motorista",
        organization_id: organizationId ?? null,
      }),
    onSuccess: () => {
      toast.success("Motorista cadastrado.");
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      setName("");
      setEmail("");
      setOrganizationId(undefined);
      onClose();
    },
    onError: () => toast.error("Erro ao cadastrar motorista."),
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cadastrar Motorista</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="driver-name">Nome *</Label>
            <Input id="driver-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="driver-email">E-mail *</Label>
            <Input id="driver-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div>
            <Label>Organização</Label>
            <OrganizationsCombobox
              value={organizationId}
              onValueChange={setOrganizationId}
              placeholder="Sem organização (motorista comum)"
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button
              onClick={() => mutation.mutate()}
              disabled={!name.trim() || !email.trim() || mutation.isPending}
            >
              Salvar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
