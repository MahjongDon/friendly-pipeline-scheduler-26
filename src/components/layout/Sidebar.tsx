
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, 
  ListTodo, 
  Calendar, 
  PieChart, 
  Users, 
  Mail, 
  Settings, 
  HelpCircle, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const isMobile = useIsMobile();
  
  const sidebarItems = [
    { 
      icon: LayoutDashboard, 
      label: "Dashboard", 
      href: "/",
      active: location.pathname === "/"
    },
    { 
      icon: PieChart, 
      label: "Pipeline", 
      href: "/pipeline",
      active: location.pathname === "/pipeline"
    },
    { 
      icon: ListTodo, 
      label: "Tasks", 
      href: "/tasks",
      active: location.pathname === "/tasks"
    },
    { 
      icon: Calendar, 
      label: "Calendar", 
      href: "/calendar",
      active: location.pathname === "/calendar"
    },
    { 
      icon: Users, 
      label: "Contacts", 
      href: "/contacts",
      active: location.pathname === "/contacts"
    },
    { 
      icon: Mail, 
      label: "Email", 
      href: "/email",
      active: location.pathname === "/email"
    },
  ];
  
  const bottomItems = [
    { 
      icon: Settings, 
      label: "Settings", 
      href: "/settings",
      active: location.pathname === "/settings"
    },
    { 
      icon: HelpCircle, 
      label: "Help & Support", 
      href: "/help",
      active: location.pathname === "/help"
    },
  ];

  // If mobile, don't show the sidebar when collapsed
  if (isMobile && collapsed) {
    return null;
  }

  return (
    <aside
      className={cn(
        "bg-sidebar fixed inset-y-0 left-0 z-20 flex h-full flex-col border-r border-border transition-all duration-300 ease-smooth",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-16 items-center justify-between px-4 py-5">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white font-semibold text-sm">
              CRM
            </div>
            <span className="font-semibold">CRM Suite</span>
          </Link>
        )}
        {collapsed && (
          <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-md bg-primary text-white font-semibold text-sm">
            CRM
          </div>
        )}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto h-8 w-8"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="flex flex-col gap-1">
          {sidebarItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                className={cn(
                  "sidebar-item",
                  item.active && "active"
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-2 mt-auto">
        <ul className="flex flex-col gap-1">
          {bottomItems.map((item) => (
            <li key={item.label}>
              <Link
                to={item.href}
                className={cn(
                  "sidebar-item",
                  item.active && "active"
                )}
              >
                <item.icon className="h-5 w-5" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};

export default Sidebar;
