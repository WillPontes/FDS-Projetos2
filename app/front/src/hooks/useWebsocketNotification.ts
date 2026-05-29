import { useEffect } from 'react';
import { toast } from 'sonner';

/**
 * Hook que conecta ao WebSocket de notificações e dispara toasts.
 * Requer userId para receber apenas notificações do usuário logado.
 */
export const useWebsocketNotification = (userId: number | null) => {
  useEffect(() => {
    if (userId === null) return;

    const wsUrl = import.meta.env.PROD 
      ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/notifications/ws?user_id=${userId}`
      : `ws://localhost:8000/api/notifications/ws?user_id=${userId}`;
    
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
