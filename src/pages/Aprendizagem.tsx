import { useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Clock, TrendingUp, CheckCircle2, Circle, PlayCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { mockModules } from "@/lib/mockData";

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
  const [selectedModule, setSelectedModule] = useState<typeof mockModules[0] | null>(null);
  const [modules, setModules] = useState(mockModules);

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

  const completedTasks = selectedModule?.tasks.filter(t => t.completed).length || 0;
  const totalTasks = selectedModule?.tasks.length || 1;
  const progressPercent = (completedTasks / totalTasks) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Aprendizagem</h1>
        <p className="text-muted-foreground">
          Módulos personalizados para desenvolver suas habilidades
        </p>
      </div>

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
              onClick={() => setSelectedModule(module)}
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
      <Sheet open={!!selectedModule} onOpenChange={() => setSelectedModule(null)}>
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
                >
                  {progressPercent === 100 ? "Módulo Concluído!" : "Concluir Módulo"}
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
