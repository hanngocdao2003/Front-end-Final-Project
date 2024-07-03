import React, { createContext, useContext, useEffect, useState } from 'react';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [client, setClient] = useState(null);

    useEffect(() => {
        const client = new W3CWebSocket('ws://140.238.54.136:8080/chat/chat');
        client.onopen = () => {
            console.log('WebSocket Client Connected');
            setClient(client);
        };

        client.onclose = () => {
            console.log('WebSocket Client Disconnected');
            setClient(null);
        };

        return () => {
            client.close();
        };
    }, []);

    return (
        <WebSocketContext.Provider value={client}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
