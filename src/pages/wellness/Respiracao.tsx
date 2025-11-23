import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wind, Play, Pause, RotateCcw, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

type Phase = "inhale" | "hold" | "exhale" | "rest";

const phases = {
  inhale: { duration: 4, label: "Inspire", color: "hsl(var(--primary))" },
  hold: { duration: 7, label: "Segure", color: "hsl(var(--warning))" },
  exhale: { duration: 8, label: "Expire", color: "hsl(var(--success))" },
  rest: { duration: 2, label: "Descanse", color: "hsl(var(--muted))" },
};

export default function Respiracao() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<Phase>("inhale");
  const [timeLeft, setTimeLeft] = useState(phases.inhale.duration);
  const [cyclesCompleted, setCyclesCompleted] = useState(0);
  const totalCycles = 4;

  useEffect(() => {
    if (!isActive) return;

    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }

    // Move to next phase
    const phaseOrder: Phase[] = ["inhale", "hold", "exhale", "rest"];
    const currentIndex = phaseOrder.indexOf(currentPhase);
    const nextPhase = phaseOrder[(currentIndex + 1) % phaseOrder.length];
    
    if (nextPhase === "inhale") {
      const newCycles = cyclesCompleted + 1;
      setCyclesCompleted(newCycles);
      
      if (newCycles >= totalCycles) {
        setIsActive(false);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
        toast({
          title: "Parabéns! 🎉",
          description: "Você completou a sessão de respiração 4-7-8!",
        });
        return;
      }
    }
    
    setCurrentPhase(nextPhase);
    setTimeLeft(phases[nextPhase].duration);
  }, [isActive, timeLeft, currentPhase, cyclesCompleted, toast]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase("inhale");
    setTimeLeft(phases.inhale.duration);
    setCyclesCompleted(0);
  };

  const progress = ((totalCycles - cyclesCompleted) / totalCycles) * 100;

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
            <Wind className="h-6 w-6 text-white" />
          </div>
          Respiração 4-7-8
        </h1>
        <p className="text-muted-foreground">
          Uma técnica simples de respiração para relaxamento e redução do estresse
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Como funciona</CardTitle>
          <CardDescription>
            A técnica 4-7-8 é uma prática de respiração que ajuda a acalmar o sistema nervoso
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold">1</div>
              <div>
                <p className="font-medium">Inspire pelo nariz</p>
                <p className="text-sm text-muted-foreground">Conte até 4 segundos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="h-8 w-8 rounded-full bg-warning flex items-center justify-center text-white font-bold">2</div>
              <div>
                <p className="font-medium">Segure a respiração</p>
                <p className="text-sm text-muted-foreground">Conte até 7 segundos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="h-8 w-8 rounded-full bg-success flex items-center justify-center text-white font-bold">3</div>
              <div>
                <p className="font-medium">Expire pela boca</p>
                <p className="text-sm text-muted-foreground">Conte até 8 segundos</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-8">
            <div className="space-y-2">
              <div className="text-sm text-muted-foreground">
                Ciclo {cyclesCompleted + 1} de {totalCycles}
              </div>
              <Progress value={100 - progress} className="h-2" />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentPhase}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="py-12"
              >
                <motion.div
                  animate={{
                    scale: isActive ? [1, 1.2, 1] : 1,
                  }}
                  transition={{
                    duration: phases[currentPhase].duration,
                    repeat: 0,
                  }}
                  className="mx-auto h-48 w-48 rounded-full flex items-center justify-center"
                  style={{
                    background: `radial-gradient(circle, ${phases[currentPhase].color}, transparent)`,
                  }}
                >
                  <div className="text-center">
                    <div className="text-6xl font-bold" style={{ color: phases[currentPhase].color }}>
                      {timeLeft}
                    </div>
                    <div className="text-xl font-medium mt-2" style={{ color: phases[currentPhase].color }}>
                      {phases[currentPhase].label}
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

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
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}