import { useState, useMemo } from "react";
import { Bell, Search, Check, BookOpen, Heart, Lightbulb, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { mockModules, mockProjects } from "@/lib/mockData";

const typeIcons = {
  learning: "📚",
  wellness: "💚",
  project: "💡",
  system: "⚙️",
};

const wellnessActivities = [
  { id: "respiracao", title: "Exercício de Respiração 4-7-8", category: "wellness", route: "/bem-estar/respiracao" },
  { id: "meditacao", title: "Meditação Guiada", category: "wellness", route: "/bem-estar/meditacao" },
  { id: "alongamento", title: "Alongamento Rápido", category: "wellness", route: "/bem-estar/alongamento" },
  { id: "gratidao", title: "Diário de Gratidão", category: "wellness", route: "/bem-estar/gratidao" },
];

interface SearchResult {
  id: string;
  title: string;
  category: "module" | "project" | "wellness";
  route: string;
  description?: string;
}

export function Header() {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Combine all searchable content
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    // Search learning modules
    mockModules.forEach(module => {
      if (
        module.title.toLowerCase().includes(query) ||
        module.description.toLowerCase().includes(query) ||
        module.category.toLowerCase().includes(query)
      ) {
        results.push({
          id: module.id,
          title: module.title,
          category: "module",
          route: "/aprendizagem",
          description: module.description,
        });
      }
    });

    // Search projects
    mockProjects.forEach(project => {
      if (
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.type.toLowerCase().includes(query)
      ) {
        results.push({
          id: project.id,
          title: project.title,
          category: "project",
          route: "/projetos",
          description: project.description,
        });
      }
    });

    // Search wellness activities
    wellnessActivities.forEach(activity => {
      if (activity.title.toLowerCase().includes(query)) {
        results.push({
          id: activity.id,
          title: activity.title,
          category: "wellness",
          route: activity.route,
        });
      }
    });

    return results.slice(0, 8); // Limit to 8 results
  }, [searchQuery]);

  const handleResultClick = (route: string) => {
    navigate(route);
    setSearchQuery("");
    setIsSearchOpen(false);
  };

  const getCategoryIcon = (category: SearchResult["category"]) => {
    switch (category) {
      case "module":
        return <BookOpen className="h-4 w-4" />;
      case "project":
        return <Lightbulb className="h-4 w-4" />;
      case "wellness":
        return <Heart className="h-4 w-4" />;
    }
  };

  const getCategoryLabel = (category: SearchResult["category"]) => {
    switch (category) {
      case "module":
        return "Módulo";
      case "project":
        return "Projeto";
      case "wellness":
        return "Bem-estar";
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-card/50 backdrop-blur-lg">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex-1 flex items-center gap-4">
          <Popover open={isSearchOpen && searchQuery.length > 0} onOpenChange={setIsSearchOpen}>
            <PopoverTrigger asChild>
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar módulos, projetos, exercícios..."
                  className="pl-9 bg-background"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchOpen(true);
                  }}
                  onFocus={() => searchQuery.length > 0 && setIsSearchOpen(true)}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent 
              className="w-[500px] p-0" 
              align="start"
              onOpenAutoFocus={(e) => e.preventDefault()}
            >
              <ScrollArea className="max-h-[400px]">
                {searchResults.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhum resultado encontrado</p>
                    <p className="text-xs mt-1">Tente buscar por módulos, projetos ou exercícios</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {searchResults.map((result) => (
                      <button
                        key={`${result.category}-${result.id}`}
                        onClick={() => handleResultClick(result.route)}
                        className="w-full text-left p-3 rounded-lg hover:bg-muted transition-colors mb-1 group"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1 text-muted-foreground group-hover:text-foreground transition-colors">
                            {getCategoryIcon(result.category)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-medium text-sm truncate">{result.title}</p>
                              <Badge variant="secondary" className="text-xs">
                                {getCategoryLabel(result.category)}
                              </Badge>
                            </div>
                            {result.description && (
                              <p className="text-xs text-muted-foreground line-clamp-2">
                                {result.description}
                              </p>
                            )}
                          </div>
                          <TrendingUp className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
        </div>
        
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="font-semibold">Notificações</h3>
                {unreadCount > 0 && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="h-8 text-xs"
                  >
                    <Check className="h-3 w-3 mr-1" />
                    Marcar todas como lidas
                  </Button>
                )}
              </div>
              <ScrollArea className="h-[400px]">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">Nenhuma notificação</p>
                  </div>
                ) : (
                  <div className="p-2">
                    {notifications.map((notification) => (
                      <button
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`w-full text-left p-3 rounded-lg hover:bg-muted transition-colors mb-1 ${
                          !notification.read ? "bg-primary/5" : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-xl">{typeIcons[notification.type]}</span>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-1">
                              <p className="font-medium text-sm">{notification.title}</p>
                              {!notification.read && (
                                <Badge variant="default" className="h-2 w-2 p-0 rounded-full" />
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-1">
                              {notification.description}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(notification.createdAt, {
                                addSuffix: true,
                                locale: ptBR,
                              })}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </PopoverContent>
          </Popover>
          
          <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 ring-primary transition-all">
            <AvatarImage src={user?.avatar} />
            <AvatarFallback>{user?.name?.substring(0, 2).toUpperCase() || "US"}</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
