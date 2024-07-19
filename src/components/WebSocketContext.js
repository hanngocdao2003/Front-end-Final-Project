// import React, { createContext, useContext, useEffect, useState } from 'react';
// import { w3cwebsocket as W3CWebSocket } from 'websocket';

// const WebSocketContext = createContext(null);

// export const WebSocketProvider = ({ children }) => {
//     const [client, setClient] = useState(null);
//     const [rooms, setRooms] = useState([]);

//     useEffect(() => {
//         const client = new W3CWebSocket('ws://140.238.54.136:8080/chat/chat');
//         client.onopen = () => {
//             console.log('WebSocket Client Connected');
//             setClient(client);
//         };

//         client.onclose = () => {
//             console.log('WebSocket Client Disconnected');
//             setClient(null);
//         };

//         client.onerror = (error) => {
//             console.error('WebSocket error:', error);
//         };

//         client.onmessage = (message) => {
//             console.log('Received message from WebSocket:', message.data);
//             let response;
//             try {
//                 response = JSON.parse(message.data);
//             } catch (e) {
//                 console.error('Failed to parse message:', e);
//                 return;
//             }

//             if (response && response.data) {
//                 // Handle the event based on the type
//                 // For now, you can add a handler or state to process the events
//                 console.log('Processed message:', response);

//                 // Update the rooms state if the event is related to room creation
//                 if (response.event === 'CREATE_ROOM') {
//                     setRooms([...rooms, response.data]);
//                 }
//             } else {
//                 console.error('Invalid message format:', response);
//             }
//         };

//         return () => {
//             if (client) {
//                 client.close();
//             }
//         };
//     }, [rooms]);

//     const createRoom = (roomName) => {
//         if (client && client.readyState === client.OPEN) {
//             client.send(JSON.stringify({
//                 action: 'onchat',
//                 data: {
//                     event: 'CREATE_ROOM',
//                     data: {
//                         roomName: roomName
//                     }
//                 }
//             }));
//         } else {
//             console.error('WebSocket connection is not ready');
//         }
//     };

//     return (
//         <WebSocketContext.Provider value={{ client, createRoom }}>
//             {children}
//         </WebSocketContext.Provider>
//     );
// };

// export const useWebSocket = () => {
//     return useContext(WebSocketContext);
// };
