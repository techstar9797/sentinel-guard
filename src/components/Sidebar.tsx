import { NavLink } from "@/components/NavLink";
import {
  Search,
  FileText,
  TrendingUp,
  BookOpen,
  Activity,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    title: "Live Investigation",
    href: "/",
    icon: Search,
  },
  {
    title: "Cases",
    href: "/cases",
    icon: FileText,
  },
  {
    title: "Agent Performance",
    href: "/performance",
    icon: TrendingUp,
  },
  {
    title: "Playbooks",
    href: "/playbooks",
    icon: BookOpen,
  },
  {
    title: "Architecture & Guidelines",
    href: "/guidelines",
    icon: Shield,
  },
  {
    title: "Activity Log",
    href: "/activity",
    icon: Activity,
  },
];

export function Sidebar() {
  return (
    <aside className="w-64 border-r border-border bg-sidebar flex flex-col">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Sentinel</h1>
            <p className="text-xs text-muted-foreground">
              Autonomous fraud guard
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            to={item.href}
            end={item.href === "/"}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
            activeClassName="bg-sidebar-accent text-foreground"
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Agent Version</p>
          <p className="text-primary">detective_v3</p>
        </div>
      </div>
    </aside>
  );
}
