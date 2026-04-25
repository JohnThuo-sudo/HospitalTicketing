import React, { createContext, useContext, useState } from "react";
import Notification from "../components/Notification";

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (type, message, duration = 5000) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, type, message, duration }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const showSuccess = (message, duration) => {
    addNotification("success", message, duration);
  };

  const showError = (message, duration) => {
    addNotification("error", message, duration);
  };

  const showWarning = (message, duration) => {
    addNotification("warning", message, duration);
  };

  const showInfo = (message, duration) => {
    addNotification("info", message, duration);
  };

  return (
    <NotificationContext.Provider
      value={{
        showSuccess,
        showError,
        showWarning,
        showInfo,
        removeNotification,
      }}
    >
      {children}
      <div className="fixed top-0 right-0 z-50 space-y-2 p-4">
        {notifications.map((notif) => (
          <Notification
            key={notif.id}
            type={notif.type}
            message={notif.message}
            onClose={() => removeNotification(notif.id)}
            duration={notif.duration}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider",
    );
  }
  return context;
};
