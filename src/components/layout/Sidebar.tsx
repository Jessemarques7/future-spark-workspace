import { Brain, LayoutDashboard, BookOpen, Heart, Lightbulb, Settings } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Aprendizagem", href: "/aprendizagem", icon: BookOpen },
  { name: "Bem-estar", href: "/bem-estar", icon: Heart },
  { name: "Projetos", href: "/projetos", icon: Lightbulb },
  { name: "Configurações", href: "/configuracoes", icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 border-r bg-sidebar/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-primary shadow-lg shadow-primary/50">
          <Brain className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-none">Human.AI</h1>
          <p className="text-xs text-muted-foreground">Workspace</p>
        </div>
      </div>
      
      <nav className="space-y-1 p-4">
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={cn(
              "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium",
              "transition-all duration-200",
              "hover:bg-sidebar-accent"
            )}
            activeClassName="bg-sidebar-accent text-sidebar-primary font-semibold shadow-md shadow-primary/30 [&>svg]:drop-shadow-[0_0_8px_hsl(var(--primary))]"
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
