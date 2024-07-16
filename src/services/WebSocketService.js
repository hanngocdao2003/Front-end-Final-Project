class WebSocketService {
    constructor() {
        this.socket = null;
        this.onLoginResponse = null;
        this.onLogoutResponse = null;
        this.onUserListResponse = null;
    }

    connect(url) {
        this.socket = new WebSocket(url);

        this.socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        this.socket.onmessage = (message) => {
            console.log('WebSocket message received:', message);
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
        console.log('Handling WebSocket message:', data);
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
            case 'GET_USER_LIST': // Update the event name to match the server response
                if (this.onUserListResponse) {
                    this.onUserListResponse(data);
                }
                break;
            default:
                console.warn('Unhandled event:', data.event);
        }
    }

    send(data) {
        if (this.socket && this.socket.readyState === WebSocket.OPEN) {
            console.log('Sending WebSocket data:', data);
            this.socket.send(JSON.stringify(data));
        }
    }

    close() {
        if (this.socket) {
            console.log('Closing WebSocket connection');
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
        console.log('Requesting user list with data:', userListData);
        this.send(userListData);
    }
}

const webSocketService = new WebSocketService();
export default webSocketService;
