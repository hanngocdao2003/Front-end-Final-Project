class WebSocketService {
    constructor() {
        this.socket = null;
        this.onLoginResponse = null;
        this.onLogoutResponse = null;
        this.onUserListResponse = null;
        this.onMessageReceived = null;
        this.onRegistrationResponse = null;
    }

    connect(url) {
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        this.socket.onmessage = (message) => {
            const data = JSON.parse(message.data);
            this.handleMessage(data);
        };

        this.socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        this.socket.onclose = () => {
            console.log('WebSocket connection closed');
        };
    }

    handleMessage(data) {
        switch (data.event) {
            case 'LOGIN':
                if (this.onLoginResponse) {
                    this.onLoginResponse(data);
                }
                break;
            case 'LOGOUT':
                if (this.onLogoutResponse) {
                    this.onLogoutResponse(data);
                }
                break;
            case 'GET_USER_LIST':
                if (this.onUserListResponse) {
                    this.onUserListResponse(data);
                }
                break;
            case 'RECEIVE_CHAT':
                if (this.onMessageReceived) {
                    this.onMessageReceived(data);
                }
                break;
            case 'REGISTER':
                if (this.onRegistrationResponse) {
                    this.onRegistrationResponse(data);
                }
                break;
            default:
                console.warn('Unhandled event:', data.event);
        }
    }
    setRegistrationResponseCallback(callback) {
        this.onRegistrationResponse = callback;
    }

    send(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            this.socket.send(JSON.stringify(data));
        }
    }

    close() {
        if (this.socket) {
            this.socket.close();
        }
    }

    setLoginResponseCallback(callback) {
        this.onLoginResponse = callback;
    }

    setLogoutResponseCallback(callback) {
        this.onLogoutResponse = callback;
    }

    setUserListResponseCallback(callback) {
        this.onUserListResponse = callback;
    }

    setMessageReceivedCallback(callback) {
        this.onMessageReceived = callback;
    }

    sendMessage(type, to, message) {
        const sendMessageData = {
            action: 'onchat',
            data: {
                event: 'SEND_CHAT',
                data: {
                    type,
                    to,
                    mes: message,
                },
            },
        };
        this.send(sendMessageData);
    }

    logout() {
        const logoutData = {
            action: 'onchat',
            data: {
                event: 'LOGOUT',
            },
        };
        this.send(logoutData);
    }

    getUserList() {
        const userListData = {
            action: 'onchat',
            data: {
                event: 'GET_USER_LIST',
            },
        };
        this.send(userListData);
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;
