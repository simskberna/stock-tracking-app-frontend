import { toast } from "@/hooks/use-toast";

let socket: WebSocket | null = null;
type MessageListener = (data: any) => void;
const listeners: MessageListener[] = [];

export const connectWebSocket = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('No token found');
        return;
    }
    socket = new WebSocket(`wss://stock-tracking-app-backend-3xpv.onrender.com/ws?token=${token}`);

    socket.onopen = () => {
        console.log('WebSocket connected');
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        console.log('Received:', data);

        if(data && data.product_id){
            listeners.forEach((listener) => listener(data));

            toast({
                title: "Critical Stock Alert!",
                description: "Check Products",
            })
        };
    };

    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    socket.onclose = () => {
        console.log('WebSocket disconnected');
    };
};

export const sendWebSocketMessage = (message: string) => {
    if (socket?.readyState === WebSocket.OPEN) {
        socket.send(message);
    } else {
        console.warn('WebSocket not connected');
    }
};

export const closeWebSocket = () => {
    socket?.close();
};

export const subscribeToMessages = (listener: MessageListener) => {
    listeners.push(listener);
    return () => {
        const index = listeners.indexOf(listener);
        if (index !== -1) listeners.splice(index, 1);
    };
};
