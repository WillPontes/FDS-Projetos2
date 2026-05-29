import { useEffect } from 'react';
import { toast } from 'sonner';

export const useWebsocketNotification = () => {
  useEffect(() => {
    const wsUrl = import.meta.env.PROD 
      ? `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${window.location.host}/api/notifications/ws`
      : 'ws://localhost:8000/api/notifications/ws';
    
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log('WebSocket Connected');
    };

    ws.onmessage = (event) => {
      // Quando recebermos a mensagem do backend
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

    // Cleanup: fecha a conexão quando o componente for desmontado
    return () => {
      ws.close();
    };
  }, []);
};
