import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, TrendingUp, CheckCircle2, Circle, PlayCircle, Award, Sparkles } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { mockModules } from "@/lib/mockData";
import { useToast } from "@/hooks/use-toast";
import { useGamification } from "@/contexts/GamificationContext";
import confetti from "canvas-confetti";

const statusConfig = {
  not_started: { label: "Não iniciado", color: "bg-muted" },
  in_progress: { label: "Em andamento", color: "bg-primary" },
  completed: { label: "Concluído", color: "bg-success" },
};

const levelColors = {
  Iniciante: "bg-success/10 text-success",
  Intermediário: "bg-warning/10 text-warning",
  Avançado: "bg-destructive/10 text-destructive",
};

export default function Aprendizagem() {
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [modules, setModules] = useState(mockModules);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [newLevel, setNewLevel] = useState(0);
  const { toast } = useToast();
  const { addXP, unlockBadge } = useGamification();

  // Get the current selected module from the updated modules state
  const selectedModule = selectedModuleId 
    ? modules.find(m => m.id === selectedModuleId) || null
    : null;

  const toggleTask = (moduleId: string, taskId: string) => {
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

  const completeModule = () => {
    if (!selectedModule) return;

    // Trigger confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    // Update module status to completed
    setModules(prev =>
      prev.map(module =>
        module.id === selectedModule.id
          ? { ...module, status: "completed" as const }
          : module
      )
    );

    // Adicionar 150 XP
    const result = addXP(150);

    // Verificar se subiu de nível
    if (result.leveledUp) {
      setNewLevel(result.newLevel);
      setShowLevelUp(true);
      
      // Confetti extra para level up
      confetti({
        particleCount: 200,
        spread: 100,
        origin: { y: 0.5 }
      });
    }

    // Desbloquear badge se completou 3 módulos
    const completedCount = modules.filter(m => m.status === "completed").length + 1;
    if (completedCount === 3) {
      unlockBadge({
        id: "first_3_modules",
        name: "Explorador Iniciante",
        description: "Complete 3 módulos de aprendizagem",
        icon: "🎯"
      });
    }
    if (completedCount === 5) {
      unlockBadge({
        id: "first_5_modules",
        name: "Estudante Dedicado",
        description: "Complete 5 módulos de aprendizagem",
        icon: "📚"
      });
    }

    // Show success toast
    toast({
      title: "🎉 Parabéns! Você ganhou +150 XP",
      description: `Módulo "${selectedModule.title}" concluído com sucesso!`,
    });

    // Close drawer
    setSelectedModuleId(null);
  };

  const completedTasks = selectedModule?.tasks.filter(t => t.completed).length || 0;
  const totalTasks = selectedModule?.tasks.length || 1;
  const progressPercent = (completedTasks / totalTasks) * 100;

  // Calculate overall progress
  const completedModules = modules.filter(m => m.status === "completed").length;
  const totalModules = modules.length;
  const overallProgress = (completedModules / totalModules) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Aprendizagem</h1>
        <p className="text-muted-foreground">
          Módulos personalizados para desenvolver suas habilidades
        </p>
      </div>

      {/* Overall Progress Bar */}
      <Card className="bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Nível Atual: Explorador do Futuro</h3>
              <p className="text-sm text-muted-foreground">
                {completedModules} de {totalModules} módulos concluídos
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">{Math.round(overallProgress)}%</div>
            </div>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {modules.map((module, index) => (
          <motion.div
            key={module.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card
              className="cursor-pointer hover:shadow-lg transition-all"
              onClick={() => setSelectedModuleId(module.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={levelColors[module.level as keyof typeof levelColors]}>
                        {module.level}
                      </Badge>
                      <Badge variant="secondary">{module.category}</Badge>
                    </div>
                    <CardTitle className="text-xl mb-2">{module.title}</CardTitle>
                    <CardDescription>{module.description}</CardDescription>
                  </div>
                  <div className={`h-12 w-12 rounded-2xl ${statusConfig[module.status].color} flex items-center justify-center`}>
                    {module.status === "completed" ? (
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    ) : module.status === "in_progress" ? (
                      <PlayCircle className="h-6 w-6 text-white" />
                    ) : (
                      <Circle className="h-6 w-6 text-white" />
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {module.duration}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    {module.tasks.filter(t => t.completed).length}/{module.tasks.length} tarefas
                  </div>
                </div>
                <Progress
                  value={(module.tasks.filter(t => t.completed).length / module.tasks.length) * 100}
                  className="h-2"
                />
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Module Detail Drawer */}
      <Sheet open={!!selectedModule} onOpenChange={() => setSelectedModuleId(null)}>
        <SheetContent className="sm:max-w-md overflow-y-auto">
          {selectedModule && (
            <>
              <SheetHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={levelColors[selectedModule.level as keyof typeof levelColors]}>
                    {selectedModule.level}
                  </Badge>
                  <Badge variant="secondary">{selectedModule.category}</Badge>
                </div>
                <SheetTitle className="text-2xl">{selectedModule.title}</SheetTitle>
                <SheetDescription>{selectedModule.description}</SheetDescription>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">Progresso do Módulo</span>
                    <span className="text-muted-foreground">{Math.round(progressPercent)}%</span>
                  </div>
                  <Progress value={progressPercent} className="h-3" />
                </div>

                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Microtarefas
                  </h3>
                  <div className="space-y-3">
                    {selectedModule.tasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <Checkbox
                          checked={task.completed}
                          onCheckedChange={() => toggleTask(selectedModule.id, task.id)}
                        />
                        <span className={task.completed ? "line-through text-muted-foreground" : ""}>
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <Button
                  className="w-full h-11"
                  disabled={progressPercent < 100}
                  onClick={completeModule}
                >
                  {progressPercent === 100 ? "🎉 Concluir Módulo" : "Concluir Módulo"}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>

      {/* Level Up Dialog */}
      <Dialog open={showLevelUp} onOpenChange={setShowLevelUp}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center gap-4 py-6"
            >
              <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <DialogTitle className="text-3xl text-center">
                Parabéns! 🎉
              </DialogTitle>
              <DialogDescription className="text-center text-lg">
                Você subiu para o <span className="font-bold text-primary">Nível {newLevel}</span>!
              </DialogDescription>
            </motion.div>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-4">
            <p className="text-center text-muted-foreground text-sm">
              Continue assim para desbloquear mais conquistas e habilidades!
            </p>
            <Button onClick={() => setShowLevelUp(false)} className="w-full">
              Continuar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
