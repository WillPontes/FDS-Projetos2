import { useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Hook que conecta ao WebSocket de notificações e dispara toasts.
 * Requer userId para receber apenas notificações do usuário logado.
 */
export const useWebsocketNotification = (userId: number | null) => {
  useEffect(() => {
    if (userId === null) return;

    const apiBase = import.meta.env.VITE_API_URL?.replace(/\/$/, "");
    const wsUrl = apiBase
      ? `${apiBase.replace(/^http/, "ws")}/api/notifications/ws?user_id=${userId}`
      : `${window.location.protocol === "https:" ? "wss:" : "ws:"}//${window.location.host}/api/notifications/ws?user_id=${userId}`;
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      if (event.data) {
        toast.success(event.data, {
          duration: 5000,
        });
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error: ', error);
    };

    ws.onclose = () => {
      console.log('WebSocket Disconnected');
    };

    return () => {
      ws.close();
    };
  }, [userId]);
};
