import { useState } from "react";
import { motion } from "framer-motion";
import { Lightbulb, Users, Calendar, TrendingUp, Filter } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockProjects } from "@/lib/mockData";

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

  const filteredProjects = mockProjects.filter(project => {
    if (typeFilter !== "all" && project.type !== typeFilter) return false;
    if (difficultyFilter !== "all" && project.difficulty !== difficultyFilter) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Projetos de Impacto</h1>
        <p className="text-muted-foreground">
          Conecte-se a projetos sociais e ambientais que transformam o mundo
        </p>
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
        {filteredProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-all h-full flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="outline" className={typeColors[project.type as keyof typeof typeColors]}>
                    {project.type}
                  </Badge>
                  <Badge variant="outline" className={difficultyColors[project.difficulty as keyof typeof difficultyColors]}>
                    {project.difficulty}
                  </Badge>
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
                <Button className="w-full mt-4">
                  <Lightbulb className="mr-2 h-4 w-4" />
                  Participar do Projeto
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

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
