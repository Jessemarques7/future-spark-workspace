import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Smile, Frown, Meh, TrendingUp, BookOpen, Lightbulb, Zap, Award, Trophy, Wind, Sparkles, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useGamification } from "@/contexts/GamificationContext";
import { useAI } from "@/contexts/AIContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const { level, currentXP, xpToNextLevel, badges } = useGamification();
  const { priorityRecommendations, removePriorityRecommendation } = useAI();
  const [mood, setMood] = useState<string>("");

  const firstName = user?.name?.split(" ")[0] || "Usuário";
  const xpPercentage = (currentXP / xpToNextLevel) * 100;

  const iconMap: Record<string, any> = {
    Wind,
    BookOpen,
    Lightbulb,
  };

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
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Olá, {firstName}! 👋</h1>
          <p className="text-muted-foreground">Veja como está seu progresso hoje</p>
        </div>
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 min-w-[200px]">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">Nível {level}</div>
                <p className="text-xs text-muted-foreground">{currentXP} / {xpToNextLevel} XP</p>
              </div>
            </div>
            <Progress value={xpPercentage} className="h-2 mt-3" />
          </CardContent>
        </Card>
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recommendations */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Recomendações da IA
            </CardTitle>
            <CardDescription>Personalizadas para você</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Priority Recommendations */}
            {priorityRecommendations.map((rec) => {
              const Icon = iconMap[rec.icon] || Sparkles;
              return (
                <motion.div
                  key={rec.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="relative"
                >
                  <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/30">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold text-sm">{rec.title}</h4>
                            <Badge variant="secondary" className="text-xs">
                              <Sparkles className="h-3 w-3 mr-1" />
                              IA
                            </Badge>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 hover:bg-destructive/10"
                            onClick={() => removePriorityRecommendation(rec.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mb-3">{rec.description}</p>
                        <Button
                          size="sm"
                          className="w-full"
                          onClick={() => navigate(rec.actionRoute)}
                        >
                          {rec.actionText}
                        </Button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Regular Recommendations */}
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

        {/* Badges */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-warning" />
              Conquistas
            </CardTitle>
            <CardDescription>Suas badges mais recentes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {badges.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                <Award className="h-12 w-12 mx-auto mb-3 opacity-20" />
                <p>Complete módulos para desbloquear conquistas!</p>
              </div>
            ) : (
              badges.slice(0, 3).map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-gradient-to-br from-warning/10 to-warning/5 border border-warning/20"
                >
                  <div className="text-3xl">{badge.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm mb-1">{badge.name}</h4>
                    <p className="text-xs text-muted-foreground">{badge.description}</p>
                  </div>
                </div>
              ))
            )}
            {badges.length > 3 && (
              <Button variant="outline" className="w-full mt-2" size="sm">
                Ver Todas ({badges.length})
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Skills Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso de Skills</CardTitle>
          <CardDescription>Suas habilidades em desenvolvimento</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-3">
          {skills.map((skill) => (
            <div key={skill.name} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{skill.name}</span>
                <span className="text-muted-foreground">{skill.progress}%</span>
              </div>
              <Progress value={skill.progress} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
