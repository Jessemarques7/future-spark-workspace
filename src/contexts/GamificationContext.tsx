import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: Date;
}

interface GamificationContextType {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  badges: Badge[];
  addXP: (amount: number) => { leveledUp: boolean; newLevel: number };
  unlockBadge: (badge: Omit<Badge, "unlockedAt">) => void;
}

const GamificationContext = createContext<GamificationContextType | undefined>(undefined);

const STORAGE_KEY = "gamification_data";
const XP_PER_LEVEL = 500; // XP necessário para cada nível

export function GamificationProvider({ children }: { children: ReactNode }) {
  const [level, setLevel] = useState(1);
  const [currentXP, setCurrentXP] = useState(0);
  const [badges, setBadges] = useState<Badge[]>([]);

  // Carregar dados do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setLevel(data.level || 1);
      setCurrentXP(data.currentXP || 0);
      setBadges(data.badges?.map((b: Badge) => ({ ...b, unlockedAt: new Date(b.unlockedAt) })) || []);
    }
  }, []);

  // Salvar dados no localStorage
  useEffect(() => {
    const data = { level, currentXP, badges };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [level, currentXP, badges]);

  const xpToNextLevel = XP_PER_LEVEL;

  const addXP = (amount: number) => {
    let newXP = currentXP + amount;
    let newLevel = level;
    let leveledUp = false;

    // Verificar se subiu de nível
    while (newXP >= XP_PER_LEVEL) {
      newXP -= XP_PER_LEVEL;
      newLevel += 1;
      leveledUp = true;
    }

    setCurrentXP(newXP);
    if (leveledUp) {
      setLevel(newLevel);
    }

    return { leveledUp, newLevel };
  };

  const unlockBadge = (badge: Omit<Badge, "unlockedAt">) => {
    // Verificar se já possui a badge
    if (badges.some(b => b.id === badge.id)) return;

    const newBadge: Badge = {
      ...badge,
      unlockedAt: new Date(),
    };

    setBadges(prev => [newBadge, ...prev]);
  };

  return (
    <GamificationContext.Provider
      value={{
        level,
        currentXP,
        xpToNextLevel,
        badges,
        addXP,
        unlockBadge,
      }}
    >
      {children}
    </GamificationContext.Provider>
  );
}

export function useGamification() {
  const context = useContext(GamificationContext);
  if (!context) {
    throw new Error("useGamification deve ser usado dentro de GamificationProvider");
  }
  return context;
}