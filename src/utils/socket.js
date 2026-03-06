// socket.js – offline stub (socket.io replaced by window events via SocketContext)
// This file is kept for compatibility with any remaining imports.

const socket = {
  emit() {},
  on() {},
  off() {},
  connect() {},
  disconnect() {},
  connected: true,
};

export const initSocket = () => {};
export const disconnectSocket = () => {};

export default socket;
