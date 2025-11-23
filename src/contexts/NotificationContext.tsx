import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface Notification {
  id: string;
  type: "learning" | "wellness" | "project" | "system";
  title: string;
  description: string;
  read: boolean;
  createdAt: Date;
}

interface NotificationSettings {
  aiRecommendations: boolean;
  wellnessReminders: boolean;
  newProjects: boolean;
}

interface NotificationContextType {
  notifications: Notification[];
  settings: NotificationSettings;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const defaultNotifications: Notification[] = [
  {
    id: "1",
    type: "learning",
    title: "Continue seu módulo de Python",
    description: "Você está 60% completo! Apenas 1h30 para finalizar.",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: "2",
    type: "wellness",
    title: "Hora de fazer uma pausa",
    description: "Você está focado há 2 horas. Que tal um alongamento?",
    read: false,
    createdAt: new Date(Date.now() - 30 * 60 * 1000),
  },
  {
    id: "3",
    type: "project",
    title: "Novo projeto disponível",
    description: "App de Reciclagem Inteligente combina com suas skills.",
    read: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000),
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [settings, setSettings] = useState<NotificationSettings>({
    aiRecommendations: true,
    wellnessReminders: true,
    newProjects: false,
  });

  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    const savedSettings = localStorage.getItem("notificationSettings");
    
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications).map((n: any) => ({
        ...n,
        createdAt: new Date(n.createdAt),
      })));
    } else {
      setNotifications(defaultNotifications);
      localStorage.setItem("notifications", JSON.stringify(defaultNotifications));
    }

    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => {
      const updated = prev.map(n => n.id === id ? { ...n, read: true } : n);
      localStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });
  };

  const markAllAsRead = () => {
    setNotifications(prev => {
      const updated = prev.map(n => ({ ...n, read: true }));
      localStorage.setItem("notifications", JSON.stringify(updated));
      return updated;
    });
  };

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem("notificationSettings", JSON.stringify(updated));
      return updated;
    });
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider value={{ notifications, settings, markAsRead, markAllAsRead, updateSettings, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
