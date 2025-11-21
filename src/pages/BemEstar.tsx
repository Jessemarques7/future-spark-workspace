import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Smile, Frown, Meh, TrendingUp, Wind, Move, Brain } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { mockMoodHistory, mockWellnessTips } from "@/lib/mockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const moodOptions = [
  { value: "happy", label: "Feliz", icon: Smile, color: "text-success" },
  { value: "neutral", label: "Neutro", icon: Meh, color: "text-muted-foreground" },
  { value: "tired", label: "Cansado", icon: Frown, color: "text-warning" },
  { value: "stressed", label: "Estressado", icon: Frown, color: "text-destructive" },
];

const iconMap: Record<string, any> = {
  Wind,
  Move,
  Brain,
  Heart,
};

export default function BemEstar() {
  const [todayMood, setTodayMood] = useState<string>("");

  const chartData = mockMoodHistory.map(entry => ({
    date: new Date(entry.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    score: entry.score,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Bem-estar</h1>
        <p className="text-muted-foreground">
          Cuide da sua saúde mental e equilíbrio emocional
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Mood Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-destructive" />
              Registro de Humor
            </CardTitle>
            <CardDescription>Como você está se sentindo hoje?</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={todayMood} onValueChange={setTodayMood}>
              <SelectTrigger className="w-full h-12">
                <SelectValue placeholder="Selecione seu humor" />
              </SelectTrigger>
              <SelectContent>
                {moodOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2 py-1">
                      <option.icon className={`h-5 w-5 ${option.color}`} />
                      <span className="text-base">{option.label}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {todayMood && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-muted rounded-xl"
              >
                <p className="text-sm text-muted-foreground mb-2">
                  Ótimo! Seu humor foi registrado.
                </p>
                <p className="text-xs text-muted-foreground">
                  Continue acompanhando seu bem-estar diariamente para insights mais precisos.
                </p>
              </motion.div>
            )}
          </CardContent>
        </Card>

        {/* Mood History Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Histórico de Humor
            </CardTitle>
            <CardDescription>Últimos 7 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs" />
                <YAxis domain={[0, 5]} className="text-xs" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--primary))"
                  strokeWidth={3}
                  dot={{ fill: "hsl(var(--primary))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Wellness Tips */}
      <div>
        <h2 className="text-xl font-bold mb-4">Microintervenções de Bem-estar</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {mockWellnessTips.map((tip, index) => {
            const Icon = iconMap[tip.icon];
            return (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all h-full">
                  <CardHeader>
                    <div className="h-12 w-12 rounded-2xl bg-gradient-success flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                    <CardDescription className="text-xs">{tip.duration}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">{tip.description}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      Começar
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
