import React, { createContext, useContext, useEffect, useState } from "react";
import { connectWebSocket, closeWebSocket, subscribeToMessages } from "@/lib/ws";

type Message = {
    critical_stock: number;
    product_id:number;
    stock: number;
    name:string

}
interface WebSocketContextType {
    message: Message;
}

const WebSocketContext = createContext<WebSocketContextType>({
    message: null,
});

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [message, setMessage] = useState<Message>(null);

    useEffect(() => {
        connectWebSocket();

        const unsubscribe = subscribeToMessages((data) => {
            setMessage(data);
        });

        return () => {
            unsubscribe();
            closeWebSocket();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={{ message }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => useContext(WebSocketContext);
