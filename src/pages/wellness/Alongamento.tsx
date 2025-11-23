import { useState } from "react";
import { motion } from "framer-motion";
import { Move, ArrowLeft, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

const exercises = [
  {
    id: 1,
    title: "Alongamento de Pescoço",
    description: "Incline a cabeça suavemente para cada lado",
    duration: "30 segundos",
    instructions: [
      "Sente-se com as costas retas",
      "Incline a cabeça para o lado direito",
      "Mantenha por 15 segundos",
      "Repita para o lado esquerdo",
    ],
  },
  {
    id: 2,
    title: "Rotação de Ombros",
    description: "Gire os ombros para frente e para trás",
    duration: "45 segundos",
    instructions: [
      "Fique em pé ou sentado",
      "Gire os ombros para frente 10 vezes",
      "Gire os ombros para trás 10 vezes",
      "Respire profundamente",
    ],
  },
  {
    id: 3,
    title: "Alongamento de Braços",
    description: "Estique os braços acima da cabeça",
    duration: "30 segundos",
    instructions: [
      "Levante os braços acima da cabeça",
      "Entrelace os dedos",
      "Empurre as palmas para cima",
      "Sinta o alongamento nas costas",
    ],
  },
  {
    id: 4,
    title: "Torção de Tronco",
    description: "Gire o tronco suavemente para cada lado",
    duration: "45 segundos",
    instructions: [
      "Sente-se com as costas retas",
      "Coloque a mão direita no encosto da cadeira",
      "Gire o tronco para a direita",
      "Repita para o lado esquerdo",
    ],
  },
  {
    id: 5,
    title: "Alongamento de Pernas",
    description: "Estique as pernas e flexione os pés",
    duration: "30 segundos",
    instructions: [
      "Sente-se ou fique em pé",
      "Estenda uma perna",
      "Flexione o pé em sua direção",
      "Alterne entre as pernas",
    ],
  },
];

export default function Alongamento() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentExercise, setCurrentExercise] = useState(0);
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);

  const progress = (completedExercises.length / exercises.length) * 100;

  const handleComplete = () => {
    if (!completedExercises.includes(exercises[currentExercise].id)) {
      setCompletedExercises([...completedExercises, exercises[currentExercise].id]);
    }

    if (currentExercise < exercises.length - 1) {
      setCurrentExercise(currentExercise + 1);
    } else {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "Parabéns! 🎉",
        description: "Você completou todos os alongamentos!",
      });
    }
  };

  const handlePrevious = () => {
    if (currentExercise > 0) {
      setCurrentExercise(currentExercise - 1);
    }
  };

  const currentEx = exercises[currentExercise];

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
            <Move className="h-6 w-6 text-white" />
          </div>
          Pausa para Alongamento
        </h1>
        <p className="text-muted-foreground">
          5 minutos de alongamentos para relaxar o corpo e melhorar a postura
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Progresso</span>
                <span>{completedExercises.length} de {exercises.length} concluídos</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            <div className="grid grid-cols-5 gap-2">
              {exercises.map((ex, index) => (
                <button
                  key={ex.id}
                  onClick={() => setCurrentExercise(index)}
                  className={`h-10 rounded-lg border-2 transition-all ${
                    completedExercises.includes(ex.id)
                      ? "border-success bg-success/10"
                      : index === currentExercise
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  }`}
                >
                  {completedExercises.includes(ex.id) && (
                    <Check className="h-4 w-4 mx-auto text-success" />
                  )}
                  {!completedExercises.includes(ex.id) && (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <motion.div
        key={currentExercise}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">{currentEx.title}</CardTitle>
                <CardDescription className="text-base mt-1">
                  {currentEx.description}
                </CardDescription>
              </div>
              <div className="text-sm font-medium text-muted-foreground bg-muted px-3 py-1 rounded-full">
                {currentEx.duration}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h3 className="font-semibold">Como fazer:</h3>
              {currentEx.instructions.map((instruction, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                  <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                    {index + 1}
                  </div>
                  <p className="text-sm pt-0.5">{instruction}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentExercise === 0}
                className="flex-1"
              >
                Anterior
              </Button>
              <Button
                onClick={handleComplete}
                className="flex-1"
              >
                {currentExercise === exercises.length - 1 ? "Finalizar" : "Próximo"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Benefícios dos Alongamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Reduz tensão muscular e dores
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Melhora a circulação sanguínea
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Aumenta a flexibilidade e mobilidade
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Previne lesões e melhora a postura
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}