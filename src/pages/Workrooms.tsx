import { useState } from "react";
import { Video, Mic, MicOff, VideoOff, PhoneOff, Send, Users, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Room {
  id: string;
  name: string;
  description: string;
  participants: number;
  image: string;
}

const rooms: Room[] = [
  {
    id: "1",
    name: "Sala de Mentoria IA",
    description: "Sessões de mentoria com especialistas em inteligência artificial",
    participants: 12,
    image: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  },
  {
    id: "2",
    name: "Simulação de Drones",
    description: "Ambiente virtual para testar e programar drones",
    participants: 8,
    image: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  },
  {
    id: "3",
    name: "Debate ODS 2030",
    description: "Discussões sobre Objetivos de Desenvolvimento Sustentável",
    participants: 15,
    image: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  },
  {
    id: "4",
    name: "Lab de Inovação",
    description: "Espaço colaborativo para projetos inovadores",
    participants: 6,
    image: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  },
  {
    id: "5",
    name: "Arena de Pitch",
    description: "Apresente suas ideias para investidores virtuais",
    participants: 10,
    image: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  },
  {
    id: "6",
    name: "Hackathon Space",
    description: "Sala dedicada a maratonas de programação",
    participants: 20,
    image: "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  },
];

const aiMessages = [
  { id: 1, text: "🤖 Bem-vindo ao Workroom! Sou a IA Mentora e estarei aqui para auxiliar.", timestamp: "agora" },
  { id: 2, text: "Esta sala foi projetada para maximizar sua produtividade e colaboração.", timestamp: "agora" },
  { id: 3, text: "Você pode ativar seu microfone e câmera usando os controles abaixo.", timestamp: "agora" },
];

export default function Workrooms() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [micEnabled, setMicEnabled] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState(aiMessages);

  const handleEnterRoom = (room: Room) => {
    setSelectedRoom(room);
    setMessages(aiMessages);
  };

  const handleLeaveRoom = () => {
    setSelectedRoom(null);
    setMicEnabled(false);
    setVideoEnabled(false);
    setChatMessage("");
  };

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      setMessages([...messages, {
        id: messages.length + 1,
        text: chatMessage,
        timestamp: "agora",
      }]);
      setChatMessage("");
      
      // Simular resposta da IA após 1 segundo
      setTimeout(() => {
        setMessages(prev => [...prev, {
          id: prev.length + 1,
          text: "🤖 Entendi! Vou processar sua mensagem e retornar em breve.",
          timestamp: "agora",
        }]);
      }, 1000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Sparkles className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Workrooms
            </h1>
          </div>
          <p className="text-gray-300 text-lg">
            Entre em salas imersivas de colaboração e aprendizado virtual
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Card
              key={room.id}
              className="relative overflow-hidden border-purple-500/20 bg-gray-800/50 backdrop-blur-sm hover:scale-105 transition-all duration-300 cursor-pointer group"
              onClick={() => handleEnterRoom(room)}
            >
              <div
                className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity"
                style={{ background: room.image }}
              />
              <div className="relative p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-bold text-white">{room.name}</h3>
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300">
                    <Users className="h-3 w-3 mr-1" />
                    {room.participants}
                  </Badge>
                </div>
                <p className="text-gray-300 text-sm">{room.description}</p>
                <Button
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEnterRoom(room);
                  }}
                >
                  Entrar na Sala
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!selectedRoom} onOpenChange={() => handleLeaveRoom()}>
        <DialogContent className="max-w-6xl h-[80vh] bg-gray-900 border-purple-500/30 text-white p-0">
          <div className="flex h-full">
            {/* Main video area */}
            <div className="flex-1 flex flex-col">
              <div className="flex-1 bg-gradient-to-br from-purple-900/30 to-gray-900 flex items-center justify-center relative">
                <div className="absolute top-4 left-4">
                  <Badge className="bg-purple-500/20 text-purple-300">
                    {selectedRoom?.name}
                  </Badge>
                </div>
                
                <div className="text-center space-y-4">
                  <Avatar className="h-32 w-32 mx-auto border-4 border-purple-500 animate-pulse">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-500 text-white text-4xl">
                      {selectedRoom?.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold">Você está conectado</h3>
                    <p className="text-gray-400">Aguardando outros participantes...</p>
                  </div>
                </div>
              </div>

              {/* Controls */}
              <div className="bg-gray-800/95 backdrop-blur-sm p-4 flex items-center justify-center gap-4">
                <Button
                  size="lg"
                  variant={micEnabled ? "default" : "secondary"}
                  className={micEnabled ? "bg-purple-500 hover:bg-purple-600" : ""}
                  onClick={() => setMicEnabled(!micEnabled)}
                >
                  {micEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                </Button>
                <Button
                  size="lg"
                  variant={videoEnabled ? "default" : "secondary"}
                  className={videoEnabled ? "bg-purple-500 hover:bg-purple-600" : ""}
                  onClick={() => setVideoEnabled(!videoEnabled)}
                >
                  {videoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
                <Button
                  size="lg"
                  variant="destructive"
                  onClick={handleLeaveRoom}
                >
                  <PhoneOff className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Chat sidebar */}
            <div className="w-80 bg-gray-800/95 backdrop-blur-sm flex flex-col border-l border-purple-500/20">
              <div className="p-4 border-b border-purple-500/20">
                <h3 className="font-bold flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-purple-400" />
                  Chat da Sala
                </h3>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-3 rounded-lg ${
                      message.text.startsWith("🤖")
                        ? "bg-purple-500/20 border border-purple-500/30"
                        : "bg-gray-700/50"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{message.timestamp}</p>
                  </div>
                ))}
              </div>

              <div className="p-4 border-t border-purple-500/20">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite sua mensagem..."
                    value={chatMessage}
                    onChange={(e) => setChatMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="bg-gray-700 border-purple-500/30 text-white placeholder:text-gray-400"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
