import { useState, useEffect } from 'react';

const NOTIFICATIONS_KEY = 'ordersync_notifications';

export function useNotifications(userId, userRole = "customer") {
  const [notifications, setNotifications] = useState([]);

  // Load notifications from local storage
  const loadNotifications = () => {
    try {
      const allNotifs = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || [];
      // Filter for the current user (if customer, match ID. If admin, match role "admin")
      const userNotifs = allNotifs.filter(
        (n) => (userRole === "admin" && n.forAdmin === true) || (n.userId === userId)
      );
      // Sort newest first
      setNotifications(userNotifs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
    } catch (error) {
      console.error("Failed to load notifications", error);
    }
  };

  useEffect(() => {
    loadNotifications();

    // Listen to local storage changes to sync across tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === NOTIFICATIONS_KEY) {
        loadNotifications();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event to update in the same window without waiting for storage event
    const handleCustomEvent = () => loadNotifications();
    window.addEventListener('notifications_updated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('notifications_updated', handleCustomEvent);
    };
  }, [userId, userRole]);

  const markAsRead = (notificationId) => {
    try {
      const allNotifs = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || [];
      const updated = allNotifs.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      );
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
      loadNotifications();
      // Dispatch event to inform other components
      window.dispatchEvent(new Event('notifications_updated'));
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const markAllAsRead = () => {
    try {
      const allNotifs = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || [];
      const updated = allNotifs.map(n => {
        // Only mark our own as read
        if ((userRole === "admin" && n.forAdmin === true) || n.userId === userId) {
          return { ...n, isRead: true };
        }
        return n;
      });
      localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
      loadNotifications();
      window.dispatchEvent(new Event('notifications_updated'));
    } catch (error) {
      console.error("Failed to mark all as read", error);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return { notifications, unreadCount, markAsRead, markAllAsRead };
}

// Global utility to add a notification from anywhere
export function addNotification({ userId, message, type = 'info', forAdmin = false }) {
  try {
    const allNotifs = JSON.parse(localStorage.getItem(NOTIFICATIONS_KEY)) || [];
    const newNotif = {
      id: Date.now() + Math.random().toString(36).substr(2, 9),
      userId: userId || null,
      forAdmin: forAdmin,
      message,
      type, // 'info', 'success', 'warning', 'error'
      isRead: false,
      createdAt: new Date().toISOString()
    };
    allNotifs.push(newNotif);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(allNotifs));
    
    // Dispatch event to refresh hooks in standard window
    window.dispatchEvent(new Event('notifications_updated'));
  } catch (error) {
    console.error("Failed to add notification", error);
  }
}
