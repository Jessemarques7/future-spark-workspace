import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { mockModules, mockMoodHistory, mockProjects } from "@/lib/mockData";

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

interface Module {
  id: string;
  title: string;
  duration: string;
  level: string;
  status: "not_started" | "in_progress" | "completed";
  category: string;
  description: string;
  tasks: Task[];
}

interface MoodEntry {
  date: string;
  mood: string;
  score: number;
}

interface ProjectParticipation {
  [projectId: string]: boolean;
}

interface AppContextType {
  modules: Module[];
  updateModuleTask: (moduleId: string, taskId: string) => void;
  completeModule: (moduleId: string) => void;
  moodHistory: MoodEntry[];
  addMoodEntry: (mood: string, score: number) => void;
  projectParticipations: ProjectParticipation;
  toggleProjectParticipation: (projectId: string) => void;
  userXP: number;
  addXP: (amount: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  // Load from localStorage or use defaults
  const [modules, setModules] = useState<Module[]>(() => {
    const stored = localStorage.getItem("humanai_modules");
    return stored ? JSON.parse(stored) : mockModules;
  });

  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(() => {
    const stored = localStorage.getItem("humanai_mood");
    return stored ? JSON.parse(stored) : mockMoodHistory;
  });

  const [projectParticipations, setProjectParticipations] = useState<ProjectParticipation>(() => {
    const stored = localStorage.getItem("humanai_projects");
    return stored ? JSON.parse(stored) : {};
  });

  const [userXP, setUserXP] = useState<number>(() => {
    const stored = localStorage.getItem("humanai_xp");
    return stored ? parseInt(stored) : 0;
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem("humanai_modules", JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem("humanai_mood", JSON.stringify(moodHistory));
  }, [moodHistory]);

  useEffect(() => {
    localStorage.setItem("humanai_projects", JSON.stringify(projectParticipations));
  }, [projectParticipations]);

  useEffect(() => {
    localStorage.setItem("humanai_xp", userXP.toString());
  }, [userXP]);

  const updateModuleTask = (moduleId: string, taskId: string) => {
    setModules(prev =>
      prev.map(module =>
        module.id === moduleId
          ? {
              ...module,
              tasks: module.tasks.map(task =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : module
      )
    );
  };

  const completeModule = (moduleId: string) => {
    setModules(prev =>
      prev.map(module =>
        module.id === moduleId ? { ...module, status: "completed" } : module
      )
    );
  };

  const addMoodEntry = (mood: string, score: number) => {
    const today = new Date().toISOString().split('T')[0];
    const newEntry = { date: today, mood, score };
    setMoodHistory(prev => [...prev.slice(-6), newEntry]);
  };

  const toggleProjectParticipation = (projectId: string) => {
    setProjectParticipations(prev => ({
      ...prev,
      [projectId]: !prev[projectId],
    }));
  };

  const addXP = (amount: number) => {
    setUserXP(prev => prev + amount);
  };

  return (
    <AppContext.Provider
      value={{
        modules,
        updateModuleTask,
        completeModule,
        moodHistory,
        addMoodEntry,
        projectParticipations,
        toggleProjectParticipation,
        userXP,
        addXP,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
}
