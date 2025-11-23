import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface EnrolledProject {
  id: string;
  title: string;
  type: string;
  enrolledAt: string;
  matchScore?: number;
}

interface ProjectsContextType {
  enrolledProjects: EnrolledProject[];
  enrollInProject: (project: { id: string; title: string; type: string }) => void;
  isEnrolled: (projectId: string) => boolean;
  unenrollFromProject: (projectId: string) => void;
  hasAnalyzed: boolean;
  setHasAnalyzed: (value: boolean) => void;
  recommendedProjectId: string | null;
  setRecommendedProjectId: (id: string | null) => void;
}

const ProjectsContext = createContext<ProjectsContextType | undefined>(undefined);

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [enrolledProjects, setEnrolledProjects] = useState<EnrolledProject[]>(() => {
    const saved = localStorage.getItem("enrolledProjects");
    return saved ? JSON.parse(saved) : [];
  });

  const [hasAnalyzed, setHasAnalyzed] = useState(() => {
    const saved = localStorage.getItem("hasAnalyzedProjects");
    return saved === "true";
  });

  const [recommendedProjectId, setRecommendedProjectId] = useState<string | null>(() => {
    const saved = localStorage.getItem("recommendedProjectId");
    return saved || null;
  });

  useEffect(() => {
    localStorage.setItem("enrolledProjects", JSON.stringify(enrolledProjects));
  }, [enrolledProjects]);

  useEffect(() => {
    localStorage.setItem("hasAnalyzedProjects", hasAnalyzed.toString());
  }, [hasAnalyzed]);

  useEffect(() => {
    if (recommendedProjectId) {
      localStorage.setItem("recommendedProjectId", recommendedProjectId);
    } else {
      localStorage.removeItem("recommendedProjectId");
    }
  }, [recommendedProjectId]);

  const enrollInProject = (project: { id: string; title: string; type: string }) => {
    if (!isEnrolled(project.id)) {
      const newProject: EnrolledProject = {
        id: project.id,
        title: project.title,
        type: project.type,
        enrolledAt: new Date().toISOString(),
        matchScore: project.id === recommendedProjectId ? 98 : undefined,
      };
      setEnrolledProjects([...enrolledProjects, newProject]);
    }
  };

  const unenrollFromProject = (projectId: string) => {
    setEnrolledProjects(enrolledProjects.filter(p => p.id !== projectId));
  };

  const isEnrolled = (projectId: string) => {
    return enrolledProjects.some(p => p.id === projectId);
  };

  return (
    <ProjectsContext.Provider
      value={{
        enrolledProjects,
        enrollInProject,
        isEnrolled,
        unenrollFromProject,
        hasAnalyzed,
        setHasAnalyzed,
        recommendedProjectId,
        setRecommendedProjectId,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectsContext);
  if (context === undefined) {
    throw new Error("useProjects must be used within a ProjectsProvider");
  }
  return context;
}
