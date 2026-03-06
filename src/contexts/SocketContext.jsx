import React, { createContext, useState, useEffect, useRef } from "react";

const SocketContext = createContext(null);

/**
 * createFakeSocket – returns a socket-compatible object using
 * window custom events instead of socket.io.
 */
function createFakeSocket() {
  const listeners = {};

  const fakeSocket = {
    emit(event, payload, tenantId) {
      // Dispatch a window event so other parts of the app can react
      window.dispatchEvent(
        new CustomEvent(`socket_${event}`, { detail: { payload, tenantId } }),
      );
    },
    on(event, callback) {
      if (!listeners[event]) listeners[event] = [];
      const handler = (e) => callback(e.detail?.payload ?? e.detail);
      listeners[event].push({ callback, handler });
      window.addEventListener(`socket_${event}`, handler);
    },
    off(event, callback) {
      if (!listeners[event]) return;
      const entry = listeners[event].find((e) => e.callback === callback);
      if (entry) {
        window.removeEventListener(`socket_${event}`, entry.handler);
        listeners[event] = listeners[event].filter(
          (e) => e.callback !== callback,
        );
      }
    },
    disconnect() {
      Object.keys(listeners).forEach((event) => {
        listeners[event].forEach(({ handler }) => {
          window.removeEventListener(`socket_${event}`, handler);
        });
      });
      Object.keys(listeners).forEach((k) => delete listeners[k]);
    },
    connected: true,
  };

  return fakeSocket;
}

const SocketProvider = ({ children }) => {
  const socketRef = useRef(createFakeSocket());
  const [isSocketConnected] = useState(true); // always "connected" offline

  useEffect(() => {
    return () => socketRef.current.disconnect();
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef.current, isSocketConnected }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
