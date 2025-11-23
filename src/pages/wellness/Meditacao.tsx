import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, Play, Pause, RotateCcw, ArrowLeft, Volume2, VolumeX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

const meditationGuides = [
  "Encontre uma posição confortável...",
  "Feche suavemente os olhos...",
  "Observe sua respiração natural...",
  "Inspire profundamente pelo nariz...",
  "Expire lentamente pela boca...",
  "Libere qualquer tensão do corpo...",
  "Foque apenas no momento presente...",
  "Deixe os pensamentos passarem...",
  "Retorne suavemente ao foco na respiração...",
  "Sinta a calma se expandindo...",
];

export default function Meditacao() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [currentGuide, setCurrentGuide] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  const totalTime = 600;
  const progress = ((totalTime - timeLeft) / totalTime) * 100;

  useEffect(() => {
    if (!isActive || timeLeft === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          toast({
            title: "Parabéns! 🎉",
            description: "Você completou a sessão de meditação!",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeLeft, toast]);

  useEffect(() => {
    if (!isActive) return;

    const guideInterval = setInterval(() => {
      setCurrentGuide((prev) => (prev + 1) % meditationGuides.length);
    }, 60000); // Change guide every minute

    return () => clearInterval(guideInterval);
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeLeft(totalTime);
    setCurrentGuide(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Button 
        variant="ghost" 
        className="mb-4"
        onClick={() => navigate("/bem-estar")}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Voltar
      </Button>

      <div>
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <div className="h-12 w-12 rounded-2xl bg-gradient-primary flex items-center justify-center">
            <Brain className="h-6 w-6 text-white" />
          </div>
          Meditação Guiada
        </h1>
        <p className="text-muted-foreground">
          10 minutos de meditação para acalmar a mente e encontrar clareza
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Preparação</CardTitle>
          <CardDescription>
            Antes de começar, certifique-se de estar em um local tranquilo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Encontre um lugar silencioso e confortável
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Sente-se com as costas retas ou deite-se
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Coloque o celular no modo silencioso
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Vista roupas confortáveis
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Tempo restante
              </div>
              <div className="text-5xl font-bold">{formatTime(timeLeft)}</div>
              <Progress value={progress} className="h-2" />
            </div>

            <motion.div
              animate={{
                scale: isActive ? [1, 1.05, 1] : 1,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="py-12"
            >
              <div
                className="mx-auto h-64 w-64 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, hsl(var(--primary)), transparent)",
                }}
              >
                <motion.div
                  animate={{
                    opacity: isActive ? [0.5, 1, 0.5] : 0.5,
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="h-48 w-48 rounded-full bg-primary/20 flex items-center justify-center"
                >
                  <Brain className="h-16 w-16 text-primary" />
                </motion.div>
              </div>
            </motion.div>

            {isActive && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg text-muted-foreground italic min-h-[3rem] flex items-center justify-center"
              >
                {meditationGuides[currentGuide]}
              </motion.div>
            )}

            <div className="flex gap-3 justify-center">
              {!isActive ? (
                <Button onClick={handleStart} size="lg" className="min-w-32">
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar
                </Button>
              ) : (
                <Button onClick={handlePause} size="lg" variant="secondary" className="min-w-32">
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </Button>
              )}
              <Button onClick={handleReset} size="lg" variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reiniciar
              </Button>
              <Button
                onClick={() => setIsSoundEnabled(!isSoundEnabled)}
                size="lg"
                variant="outline"
              >
                {isSoundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Benefícios da Meditação</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Reduz estresse e ansiedade
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Melhora o foco e concentração
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Aumenta a autoconsciência
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Promove clareza mental
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Melhora a qualidade do sono
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}