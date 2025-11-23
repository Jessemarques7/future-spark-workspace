import { useState } from "react";
import { motion } from "framer-motion";
import { Smile, Frown, Meh, TrendingUp, BookOpen, Lightbulb, Zap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockRecommendations } from "@/lib/mockData";

const moodOptions = [
  { value: "happy", label: "Feliz", icon: Smile, color: "text-success" },
  { value: "neutral", label: "Neutro", icon: Meh, color: "text-muted-foreground" },
  { value: "tired", label: "Cansado", icon: Frown, color: "text-warning" },
  { value: "stressed", label: "Estressado", icon: Frown, color: "text-destructive" },
];

const skills = [
  { name: "Python", progress: 65, color: "bg-primary" },
  { name: "Comunicação", progress: 80, color: "bg-success" },
  { name: "Liderança", progress: 45, color: "bg-warning" },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [mood, setMood] = useState<string>("");

  const firstName = user?.name?.split(" ")[0] || "Usuário";

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Olá, {firstName}! 👋</h1>
        <p className="text-muted-foreground">Veja como está seu progresso hoje</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
      >
        {/* Mood Card */}
        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="text-lg">Humor do Dia</CardTitle>
              <CardDescription>Como você está se sentindo?</CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={mood} onValueChange={setMood}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione seu humor" />
                </SelectTrigger>
                <SelectContent>
                  {moodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className={`h-4 w-4 ${option.color}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-all bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                Módulos Ativos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">3</div>
              <p className="text-xs text-muted-foreground mt-1">60% concluído</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-all bg-gradient-to-br from-success/10 to-success/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-success" />
                Sequência
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-success">7</div>
              <p className="text-xs text-muted-foreground mt-1">dias consecutivos</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="hover:shadow-lg transition-all bg-gradient-to-br from-warning/10 to-warning/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-warning" />
                Projetos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-warning">2</div>
              <p className="text-xs text-muted-foreground mt-1">em andamento</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Recomendações da IA
            </CardTitle>
            <CardDescription>Personalizadas para você</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockRecommendations.map((rec) => (
              <div
                key={rec.id}
                className="flex items-start gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors"
              >
                <div className="mt-1">
                  {rec.type === "learning" && <BookOpen className="h-5 w-5 text-primary" />}
                  {rec.type === "wellness" && <Smile className="h-5 w-5 text-success" />}
                  {rec.type === "project" && <Lightbulb className="h-5 w-5 text-warning" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                  <p className="text-xs text-muted-foreground">{rec.description}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Skills Progress */}
        <Card>
          <CardHeader>
            <CardTitle>Progresso de Skills</CardTitle>
            <CardDescription>Suas habilidades em desenvolvimento</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {skills.map((skill) => (
              <div key={skill.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{skill.name}</span>
                  <span className="text-muted-foreground">{skill.progress}%</span>
                </div>
                <Progress value={skill.progress} className="h-2" />
              </div>
            ))}
            <Button variant="outline" className="w-full mt-4">
              Ver Todas as Skills
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
