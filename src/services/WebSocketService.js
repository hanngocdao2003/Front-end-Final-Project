class WebSocketService {
  constructor() {
    this.socket = null;
    this.onLoginResponse = null;
    this.onLogoutResponse = null;
    this.onUserListResponse = null;
    this.onAuthError = null; // Callback for auth errors
    this.isConnected = false;
    this.pendingMessages = [];
    this.reconnectAttempts = 0;
    this.reLoginAttempted = false;

    // Add event listener to manage connection when the page is reloaded or closed
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }

  handleBeforeUnload = (event) => {
    // Remove event listener to prevent default action when the page is reloaded
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
            this.onAuthError(); // Notify auth error
          }
        }
        break;
      case 'LOGIN':
        if (data.status === 'success') {
          localStorage.setItem('RE_LOGIN_CODE', data.data.RE_LOGIN_CODE);
          localStorage.setItem('username', data.data.user);
          this.reLoginAttempted = false; // Reset re-login attempt flag
        }
        if (this.onLoginResponse) {
          this.onLoginResponse(data);
        }
        break;
      case 'RE_LOGIN':
        if (data.status === 'error') {
            console.error('Re-login failed:', data.mes);
            // Option 1: Redirect to login page and clear storage
            window.location.href = '/login'; // Replace with your login page URL
            localStorage.removeItem('RE_LOGIN_CODE');
            localStorage.removeItem('isConnected');
        } else if (data.status === 'success') {
          console.log('Re-login successful');
          this.reLoginAttempted = true; // Flag that re-login was attempted
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
}

const webSocketService = new WebSocketService();
export default webSocketService;
