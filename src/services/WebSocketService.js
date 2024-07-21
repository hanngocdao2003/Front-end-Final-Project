class WebSocketService {
  constructor() {
    this.socket = null;
    this.onLoginResponse = null;
    this.onLogoutResponse = null;
    this.onUserListResponse = null;
    this.onAuthError = null;
    this.onChatHistoryResponse = null;
    this.onNewMessage = null;
    this.onRegistrationResponse = null; // Callback for registration response
    this.onJoinRoomResponse = null; // New callback for join room response
    this.onRoomChatHistoryResponse = null; // New callback for room chat history response
    this.isConnected = false;
    this.pendingMessages = [];
    this.reconnectAttempts = 0;
    this.reLoginAttempted = false;
    this.users = {};

    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  handleBeforeUnload = (event) => {
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  };

  connect(url) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        console.log('WebSocket connection established');
        this.isConnected = true;
        localStorage.setItem('isConnected', 'true');
        this.reconnectAttempts = 0;

        const reLoginCode = localStorage.getItem('RE_LOGIN_CODE');
        const username = localStorage.getItem('username');
        if (reLoginCode && username && !this.reLoginAttempted) {
          this.sendReLogin(username, reLoginCode);
        } else {
          while (this.pendingMessages.length > 0) {
            const message = this.pendingMessages.shift();
            this.socket.send(JSON.stringify(message));
          }
        }

        this.getUserList();
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
        this.isConnected = false;
        localStorage.removeItem('isConnected');
        this.reconnect();
      };
    }
  }

  reconnect() {
    if (this.reconnectAttempts < 5) {
      this.reconnectAttempts += 1;
      console.log(`Reconnecting attempt ${this.reconnectAttempts}`);
      setTimeout(() => {
        this.connect('ws://140.238.54.136:8080/chat/chat');
      }, this.reconnectAttempts * 1000);
    } else {
      console.warn('Max reconnect attempts reached.');
    }
  }

  handleMessage(data) {
    console.log('Handling WebSocket message:', data);
    switch (data.event) {
      case 'AUTH':
        if (data.status === 'error') {
          console.error('Auth error:', data.mes);
          if (this.onAuthError) {
            window.location.href = '/login';
            localStorage.removeItem('RE_LOGIN_CODE');
            localStorage.removeItem('isConnected');
          }
        }
        break;
      case 'LOGIN':
        if (data.status === 'success') {
          localStorage.setItem('RE_LOGIN_CODE', data.data.RE_LOGIN_CODE);
          localStorage.setItem('username', data.data.user);
          this.reLoginAttempted = false;
        }
        if (this.onLoginResponse) {
          this.onLoginResponse(data);
        }
        break;
      case 'RE_LOGIN':
        if (data.status === 'error') {
          console.error('Re-login failed:', data.mes);
          window.location.href = '/login';
          localStorage.removeItem('RE_LOGIN_CODE');
          localStorage.removeItem('isConnected');
        } else if (data.status === 'success') {
          console.log('Re-login successful');
          this.reLoginAttempted = true;
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
      case 'GET_PEOPLE_CHAT_MES':
        if (this.onChatHistoryResponse) {
          this.onChatHistoryResponse(data);
        }
        break;
      case 'SEND_CHAT':
        if (this.onNewMessage) {
          this.onNewMessage(data.data);
        }
        break;
      case 'REGISTER':
        if (this.onRegistrationResponse) {
          this.onRegistrationResponse(data);
        }
        break;
      case 'JOIN_ROOM':
        if (this.onJoinRoomResponse) {
          this.onJoinRoomResponse(data);
        }
        break;
      case 'GET_ROOM_CHAT_MES':
        if (this.onRoomChatHistoryResponse) {
          this.onRoomChatHistoryResponse(data);
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
    } else {
      console.warn('WebSocket connection not open. Storing pending message...');
      this.pendingMessages.push(data);
      if (!this.isConnected) {
        this.connect('ws://140.238.54.136:8080/chat/chat');
      }
    }
  }

  sendReLogin(username, reLoginCode) {
    const reLoginData = {
      action: 'onchat',
      data: {
        event: 'RE_LOGIN',
        data: {
          user: username,
          code: reLoginCode,
        },
      },
    };
    this.send(reLoginData);
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

  setAuthErrorCallback(callback) {
    this.onAuthError = callback;
  }

  setChatHistoryResponseCallback(callback) {
    this.onChatHistoryResponse = callback;
  }

  setNewMessageCallback(callback) {
    this.onNewMessage = callback;
  }

  setRegistrationResponseCallback(callback) {
    this.onRegistrationResponse = callback;
  }

  setJoinRoomResponseCallback(callback) {
    this.onJoinRoomResponse = callback;
  }

  setRoomChatHistoryResponseCallback(callback) {
    this.onRoomChatHistoryResponse = callback;
  }

  logout() {
    const logoutData = {
      action: 'onchat',
      data: {
        event: 'LOGOUT',
      },
    };
    this.send(logoutData);
    localStorage.removeItem('RE_LOGIN_CODE');
    localStorage.removeItem('username');
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

  sendGetRoomChatHistory(roomName) {
    const message = {
      action: 'onchat',
      data: {
        event: 'GET_ROOM_CHAT_MES',
        data: { room: roomName, page: 1 },
      },
    };
    this.send(message);
  }

  sendGetRoomChatHistory(roomName, page = 1) {
    const chatHistoryData = {
      action: 'onchat',
      data: {
        event: 'GET_ROOM_CHAT_MES',
        data: {
          name: roomName,
          page: page,
        },
      },
    };
    console.log('Requesting room chat history with data:', chatHistoryData);
    this.send(chatHistoryData);
  }

  getChatHistory(name) {
    const chatHistoryData = {
      action: 'onchat',
      data: {
        event: 'GET_PEOPLE_CHAT_MES',
        data: {
          name,
          page: 1, // Assuming page 1 for simplicity
        },
      },
    };
    console.log('Requesting chat history with data:', chatHistoryData);
    this.send(chatHistoryData);
  }
}

const webSocketService = new WebSocketService();
export default webSocketService;
