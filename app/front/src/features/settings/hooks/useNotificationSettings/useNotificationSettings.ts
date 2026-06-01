import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserById, updateUser } from "@/features/users/api/requests";
import {
  notificationSettingsToPayload,
  userToNotificationSettings,
  type NotificationSettings,
} from "@/features/users/api/types";

const notificationSettingsKey = (userId: number) =>
  ["notification-settings", userId] as const;

export const useNotificationSettings = (userId: number | undefined) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: notificationSettingsKey(userId ?? 0),
    queryFn: () => getUserById(userId!),
    enabled: userId != null,
    select: userToNotificationSettings,
  });

  const mutation = useMutation({
    mutationFn: (settings: NotificationSettings) =>
      updateUser(userId!, notificationSettingsToPayload(settings)),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: notificationSettingsKey(userId!),
      });
    },
  });

  return { query, mutation };
};
