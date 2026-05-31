import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createUser, updateUser, deleteUser } from "../../api/requests";
import { userQueryKeys } from "../../api/query-keys";
import type { UpdateUserPayload, User } from "../../api/types";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      name: string;
      email: string;
      role?: string;
      organization_id?: number | null;
    }) => createUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKeys.all });
      toast.success("Usuário criado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar usuário.");
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserPayload }) =>
      updateUser(id, data),
    onSuccess: (updatedUser) => {
      queryClient.setQueryData<User[]>(userQueryKeys.list(), (old) =>
        old?.map((user) => (user.id === updatedUser.id ? updatedUser : user)),
      );
      queryClient.setQueryData(userQueryKeys.detail(updatedUser.id), updatedUser);
      toast.success("Usuário atualizado com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar usuário.");
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteUser(id),
    onSuccess: (_data, id) => {
      queryClient.setQueryData<User[]>(userQueryKeys.list(), (old) =>
        old?.filter((user) => user.id !== id),
      );
      queryClient.removeQueries({ queryKey: userQueryKeys.detail(id) });
      toast.success("Usuário excluído com sucesso!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao excluir usuário.");
    },
  });
};
