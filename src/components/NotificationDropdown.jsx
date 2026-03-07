import React, { useState, useRef, useEffect } from 'react';
import { IconBell, IconCheck, IconChecks } from '@tabler/icons-react';
import { useNotifications } from '../hooks/useNotifications';

export default function NotificationDropdown({ userId, userRole = "customer", isDarkTheme = false }) {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications(userId, userRole);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    // Close dropdown if clicked outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getBadgeColor = (type) => {
    switch (type) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-full transition-colors ${
          isDarkTheme ? 'text-gray-300 hover:bg-gray-800' : 'text-neutral hover:bg-gray-100 hover:text-primary'
        }`}
      >
        <IconBell stroke={1.5} size={28} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-1 text-[10px] font-bold leading-none text-white transform bg-red-500 rounded-full">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div 
          className={`absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl shadow-xl z-50 overflow-hidden border ${
            isDarkTheme ? 'bg-[#1e1e1e] border-gray-700' : 'bg-white border-gray-100'
          }`}
        >
          <div className={`px-4 py-3 flex justify-between items-center border-b ${isDarkTheme ? 'border-gray-700' : 'border-gray-100'}`}>
            <h3 className={`font-bold text-lg ${isDarkTheme ? 'text-white' : 'text-secondary'}`}>Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors flex items-center gap-1"
              >
                <IconChecks size={14} /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
            {notifications.length === 0 ? (
              <div className={`p-8 text-center text-sm ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                <IconBell size={32} className="mx-auto mb-2 opacity-20" />
                <p>No notifications yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-800 pointer-events-auto">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`p-4 transition-colors ${!notif.isRead ? (isDarkTheme ? 'bg-gray-800/50' : 'bg-blue-50/30') : ''} hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer flex gap-3`}
                    onClick={() => {
                      if (!notif.isRead) markAsRead(notif.id);
                    }}
                  >
                    <div className="mt-1 flex-shrink-0">
                      <span className={`w-2.5 h-2.5 rounded-full inline-block ${getBadgeColor(notif.type)} ${!notif.isRead ? 'animate-pulse' : 'opacity-50'}`}></span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${isDarkTheme ? 'text-gray-200' : 'text-gray-800'} ${!notif.isRead ? 'font-semibold' : ''}`}>
                        {notif.message}
                      </p>
                      <p className={`text-xs mt-1 ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                        {new Date(notif.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); markAsRead(notif.id); }}
                        className="text-gray-400 hover:text-primary self-center p-1"
                        title="Mark as read"
                      >
                        <IconCheck size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
