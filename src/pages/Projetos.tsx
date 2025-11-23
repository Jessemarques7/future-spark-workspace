import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Users, Calendar, TrendingUp, Filter, Check, Sparkles, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { mockProjects } from "@/lib/mockData";
import { useProjects } from "@/contexts/ProjectsContext";
import { useToast } from "@/hooks/use-toast";

const typeColors = {
  Social: "bg-primary/10 text-primary",
  Ambiental: "bg-success/10 text-success",
  Educacional: "bg-warning/10 text-warning",
};

const difficultyColors = {
  Fácil: "bg-success/10 text-success",
  Médio: "bg-warning/10 text-warning",
  Avançado: "bg-destructive/10 text-destructive",
};

export default function Projetos() {
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [showAnalysisDialog, setShowAnalysisDialog] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const { enrollInProject, isEnrolled, hasAnalyzed, setHasAnalyzed, recommendedProjectId, setRecommendedProjectId } = useProjects();
  const { toast } = useToast();

  const filteredProjects = mockProjects.filter(project => {
    if (typeFilter !== "all" && project.type !== typeFilter) return false;
    if (difficultyFilter !== "all" && project.difficulty !== difficultyFilter) return false;
    return true;
  });

  // Reorder projects if analysis was done
  const orderedProjects = hasAnalyzed && recommendedProjectId
    ? [
        ...filteredProjects.filter(p => p.id === recommendedProjectId),
        ...filteredProjects.filter(p => p.id !== recommendedProjectId)
      ]
    : filteredProjects;

  const handleAnalyzeCompatibility = () => {
    setShowAnalysisDialog(true);
    setIsAnalyzing(true);

    // Simulate AI analysis
    setTimeout(() => {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
      setRecommendedProjectId("2"); // App de Reciclagem Inteligente
      
      toast({
        title: "Análise Concluída!",
        description: "Encontramos o projeto perfeito para você.",
      });
    }, 3000);
  };

  const handleEnroll = (project: { id: string; title: string; type: string }) => {
    enrollInProject(project);
    
    toast({
      title: "Inscrição Realizada!",
      description: `Você agora faz parte do projeto "${project.title}"`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Projetos de Impacto</h1>
          <p className="text-muted-foreground">
            Conecte-se a projetos sociais e ambientais que transformam o mundo
          </p>
        </div>
        <Button 
          onClick={handleAnalyzeCompatibility}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Sparkles className="mr-2 h-4 w-4" />
          Analisar Compatibilidade com IA
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Categoria</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Social">Social</SelectItem>
                <SelectItem value="Ambiental">Ambiental</SelectItem>
                <SelectItem value="Educacional">Educacional</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex-1 min-w-[200px]">
            <label className="text-sm font-medium mb-2 block">Dificuldade</label>
            <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="Fácil">Fácil</SelectItem>
                <SelectItem value="Médio">Médio</SelectItem>
                <SelectItem value="Avançado">Avançado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Projects Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {orderedProjects.map((project, index) => {
          const enrolled = isEnrolled(project.id);
          const isRecommended = hasAnalyzed && project.id === recommendedProjectId;
          
          return (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={`hover:shadow-lg transition-all h-full flex flex-col ${
              isRecommended ? 'border-2 border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.3)]' : ''
            }`}>
              <CardHeader>
                <div className="flex items-start justify-between mb-2 flex-wrap gap-2">
                  <div className="flex gap-2 flex-wrap">
                    <Badge variant="outline" className={typeColors[project.type as keyof typeof typeColors]}>
                      {project.type}
                    </Badge>
                    <Badge variant="outline" className={difficultyColors[project.difficulty as keyof typeof difficultyColors]}>
                      {project.difficulty}
                    </Badge>
                    {isRecommended && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white">
                        <Sparkles className="mr-1 h-3 w-3" />
                        98% de Match
                      </Badge>
                    )}
                    {enrolled && (
                      <Badge className="bg-success/10 text-success border-success/20">
                        <Check className="mr-1 h-3 w-3" />
                        Inscrito
                      </Badge>
                    )}
                  </div>
                </div>
                <CardTitle className="text-xl">{project.title}</CardTitle>
                <CardDescription>{project.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    {project.participants} participantes
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Duração: {project.duration}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-sm font-medium mb-2">
                      <TrendingUp className="h-4 w-4" />
                      Skills relacionadas
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => handleEnroll({ id: project.id, title: project.title, type: project.type })}
                  disabled={enrolled}
                  variant={enrolled ? "secondary" : "default"}
                >
                  {enrolled ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Inscrito
                    </>
                  ) : (
                    <>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Participar do Projeto
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        );
        })}
      </div>

      {/* Analysis Dialog */}
      <Dialog open={showAnalysisDialog} onOpenChange={setShowAnalysisDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Análise de Compatibilidade
            </DialogTitle>
            <DialogDescription>
              {isAnalyzing 
                ? "Analisando seu perfil e comparando com os requisitos dos projetos..."
                : "Análise concluída! Encontramos projetos perfeitos para você."
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            {isAnalyzing ? (
              <>
                <Loader2 className="h-16 w-16 animate-spin text-purple-500" />
                <p className="text-sm text-muted-foreground text-center">
                  Analisando skills, interesses e disponibilidade...
                </p>
              </>
            ) : (
              <>
                <div className="h-16 w-16 rounded-full bg-success/10 flex items-center justify-center">
                  <Check className="h-8 w-8 text-success" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-semibold">Match encontrado!</p>
                  <p className="text-sm text-muted-foreground">
                    Recomendamos o projeto "App de Reciclagem Inteligente" com 98% de compatibilidade
                  </p>
                </div>
                <Button 
                  onClick={() => setShowAnalysisDialog(false)}
                  className="w-full"
                >
                  Ver Projetos
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {filteredProjects.length === 0 && (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              Nenhum projeto encontrado com esses filtros.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
