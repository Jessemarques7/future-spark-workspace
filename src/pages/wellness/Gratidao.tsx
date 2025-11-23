import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ArrowLeft, Plus, Trash2, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";

interface GratitudeEntry {
  id: string;
  text: string;
  date: string;
}

export default function Gratidao() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState("");

  const handleAddEntry = () => {
    if (!currentEntry.trim()) {
      toast({
        title: "Atenção",
        description: "Por favor, escreva algo antes de adicionar.",
        variant: "destructive",
      });
      return;
    }

    const newEntry: GratitudeEntry = {
      id: Date.now().toString(),
      text: currentEntry,
      date: new Date().toLocaleDateString("pt-BR"),
    };

    setEntries([newEntry, ...entries]);
    setCurrentEntry("");

    if (entries.length + 1 >= 3) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      toast({
        title: "Parabéns! 🎉",
        description: "Você completou sua lista de gratidão diária!",
      });
    } else {
      toast({
        title: "Adicionado!",
        description: `Faltam ${3 - entries.length - 1} itens para completar hoje.`,
      });
    }
  };

  const handleDeleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
    toast({
      title: "Removido",
      description: "Item removido da lista.",
    });
  };

  const todayEntries = entries.filter(
    entry => entry.date === new Date().toLocaleDateString("pt-BR")
  );

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
            <Heart className="h-6 w-6 text-white" />
          </div>
          Gratidão Diária
        </h1>
        <p className="text-muted-foreground">
          Liste 3 coisas pelas quais você é grato hoje e cultive uma mentalidade positiva
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Por que praticar gratidão?</CardTitle>
          <CardDescription>
            A prática diária de gratidão traz diversos benefícios para o bem-estar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Aumenta a felicidade e satisfação com a vida
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Reduz pensamentos negativos e estresse
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Melhora relacionamentos e conexões sociais
            </li>
            <li className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 rounded-full bg-primary" />
              Fortalece a resiliência emocional
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Adicione suas gratidões</CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sparkles className="h-4 w-4" />
              {todayEntries.length}/3 hoje
            </div>
          </div>
          <CardDescription>
            Reflita sobre o que há de bom em sua vida
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Textarea
              placeholder="Eu sou grato por..."
              value={currentEntry}
              onChange={(e) => setCurrentEntry(e.target.value)}
              className="min-h-24 resize-none"
            />
            <Button onClick={handleAddEntry} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar gratidão
            </Button>
          </div>

          <div className="space-y-3 mt-6">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Gratidões de hoje
            </h3>
            <AnimatePresence>
              {todayEntries.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <Heart className="h-12 w-12 mx-auto mb-2 opacity-20" />
                  <p className="text-sm">Ainda não há gratidões para hoje</p>
                </motion.div>
              ) : (
                todayEntries.map((entry, index) => (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="bg-muted/50">
                      <CardContent className="pt-4">
                        <div className="flex items-start gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold flex-shrink-0">
                            {index + 1}
                          </div>
                          <p className="flex-1 pt-1">{entry.text}</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEntry(entry.id)}
                            className="flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {entries.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Histórico</CardTitle>
            <CardDescription>
              Total de {entries.length} gratidões registradas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {entries
                .filter(entry => entry.date !== new Date().toLocaleDateString("pt-BR"))
                .map((entry) => (
                  <div
                    key={entry.id}
                    className="p-3 bg-muted/30 rounded-lg text-sm"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-muted-foreground">{entry.date}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleDeleteEntry(entry.id)}
                      >
                        <Trash2 className="h-3 w-3 text-destructive" />
                      </Button>
                    </div>
                    <p>{entry.text}</p>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-gradient-primary text-white">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <Heart className="h-8 w-8 mx-auto" />
            <h3 className="font-semibold">Dica do dia</h3>
            <p className="text-sm opacity-90">
              Tente ser específico em suas gratidões. Em vez de "Sou grato pela minha família", 
              experimente "Sou grato pelo abraço que recebi da minha mãe hoje".
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}