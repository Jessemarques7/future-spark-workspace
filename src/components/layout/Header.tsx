import { Bell, Search, Check } from "lucide-react";
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

const typeIcons = {
  learning: "📚",
  wellness: "💚",
  project: "💡",
  system: "⚙️",
};

export function Header() {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotifications();

  return (
    <header className="sticky top-0 z-40 border-b bg-card/50 backdrop-blur-lg">
      <div className="flex h-16 items-center gap-4 px-6">
        <div className="flex-1 flex items-center gap-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar módulos, projetos..."
              className="pl-9 bg-background"
            />
          </div>
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
