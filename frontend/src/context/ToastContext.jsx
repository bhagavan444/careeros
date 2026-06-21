import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Mail, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import '../Pages/Login.css'; // Reuse the toast styles from Login.css

const ToastContext = createContext();

export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((title, message, type = 'info', duration = 4000) => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, dismissToast }}>
      {children}
      
      {/* Global Toast Container */}
      <div className="auth-toast-container" style={{ zIndex: 99999 }}>
        <AnimatePresence>
          {toasts.map(t => {
            let Icon = CheckCircle;
            let color = "#34C759"; // Success green

            if (t.type === "error") { Icon = AlertCircle; color = "#FF3B30"; }
            if (t.type === "warning") { Icon = AlertTriangle; color = "#FF9500"; }
            if (t.type === "info") { Icon = Info; color = "#007AFF"; }
            if (t.type === "mail") { Icon = Mail; color = "#007AFF"; }

            return (
              <motion.div 
                key={t.id}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className="auth-toast"
              >
                <div className="auth-toast-icon" style={{ color }}>
                  <Icon size={20} />
                </div>
                <div className="auth-toast-content">
                  <div className="auth-toast-title">{t.title}</div>
                  <div className="auth-toast-message" style={{ whiteSpace: "pre-line" }}>{t.message}</div>
                </div>
                <button onClick={() => dismissToast(t.id)} className="auth-toast-dismiss">
                  <X size={16} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
