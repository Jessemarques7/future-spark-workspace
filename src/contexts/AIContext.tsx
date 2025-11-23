import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface PriorityRecommendation {
  id: string;
  type: "wellness" | "learning" | "project";
  title: string;
  description: string;
  actionText: string;
  actionRoute: string;
  icon: string;
  createdAt: Date;
  priority: number; // Maior = mais prioritário
}

interface AIContextType {
  priorityRecommendations: PriorityRecommendation[];
  addPriorityRecommendation: (rec: Omit<PriorityRecommendation, "id" | "createdAt">) => void;
  removePriorityRecommendation: (id: string) => void;
  clearAllRecommendations: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

const STORAGE_KEY = "ai_recommendations";

export function AIProvider({ children }: { children: ReactNode }) {
  const [priorityRecommendations, setPriorityRecommendations] = useState<PriorityRecommendation[]>([]);

  // Carregar do localStorage
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      setPriorityRecommendations(
        data.map((rec: PriorityRecommendation) => ({
          ...rec,
          createdAt: new Date(rec.createdAt),
        }))
      );
    }
  }, []);

  // Salvar no localStorage
  useEffect(() => {
    if (priorityRecommendations.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(priorityRecommendations));
    }
  }, [priorityRecommendations]);

  const addPriorityRecommendation = (rec: Omit<PriorityRecommendation, "id" | "createdAt">) => {
    const newRec: PriorityRecommendation = {
      ...rec,
      id: `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date(),
    };

    setPriorityRecommendations(prev => {
      // Evitar duplicatas do mesmo tipo
      const filtered = prev.filter(r => r.type !== rec.type || r.actionRoute !== rec.actionRoute);
      // Adicionar nova e ordenar por prioridade
      return [...filtered, newRec].sort((a, b) => b.priority - a.priority);
    });
  };

  const removePriorityRecommendation = (id: string) => {
    setPriorityRecommendations(prev => {
      const filtered = prev.filter(r => r.id !== id);
      if (filtered.length === 0) {
        localStorage.removeItem(STORAGE_KEY);
      }
      return filtered;
    });
  };

  const clearAllRecommendations = () => {
    setPriorityRecommendations([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <AIContext.Provider
      value={{
        priorityRecommendations,
        addPriorityRecommendation,
        removePriorityRecommendation,
        clearAllRecommendations,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error("useAI deve ser usado dentro de AIProvider");
  }
  return context;
}