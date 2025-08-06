import { useEffect, useRef, useState } from 'react';
import { Notification } from '@/types';
import { toast } from '@/hooks/use-toast';

interface UseWebSocketOptions {
  url?: string;
  onNotification?: (notification: Notification) => void;
}

export const useWebSocket = ({ url = 'ws://localhost:8080', onNotification }: UseWebSocketOptions = {}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connect = () => {
    try {
      ws.current = new WebSocket(url);

      ws.current.onopen = () => {
        setIsConnected(true);
        console.log('WebSocket connected');
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'notification') {
            const notification: Notification = {
              id: data.id || Date.now().toString(),
              type: data.notificationType || 'system',
              title: data.title || 'Bildirim',
              message: data.message || '',
              read: false,
              createdAt: new Date().toISOString(),
            };

            setNotifications(prev => [notification, ...prev]);
            onNotification?.(notification);

            // Show toast notification
            toast({
              title: notification.title,
              description: notification.message,
              variant: notification.type === 'low_stock' ? 'destructive' : 'default',
            });
          }
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = () => {
        setIsConnected(false);
        console.log('WebSocket disconnected');
        
        // Reconnect after 3 seconds
        reconnectTimeout.current = setTimeout(() => {
          connect();
        }, 3000);
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  };

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [url]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  return {
    isConnected,
    notifications,
    markAsRead,
    clearNotifications,
    unreadCount: notifications.filter(n => !n.read).length,
  };
};