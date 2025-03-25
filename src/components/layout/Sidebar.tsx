
import React from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Contact,
  HelpCircle,
  LayoutDashboard,
  PieChart,
  Settings,
  ListTodo,
} from "lucide-react";

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, setCollapsed }) => {
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-30 h-full bg-white transition-all duration-300 ease-in-out shadow-md",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && (
            <h1 className="text-xl font-bold">CRM Portfolio</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "rounded-full",
              collapsed && "ml-auto mr-auto"
            )}
            onClick={toggleSidebar}
          >
            {collapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <ChevronLeft className="h-5 w-5" />
            )}
          </Button>
        </div>

        <nav className="flex-1 px-2 py-4">
          <ul className="space-y-1">
            <NavItem
              to="/"
              icon={<LayoutDashboard className="h-5 w-5" />}
              text="Dashboard"
              collapsed={collapsed}
            />
            <NavItem
              to="/pipeline"
              icon={<PieChart className="h-5 w-5" />}
              text="Pipeline"
              collapsed={collapsed}
            />
            <NavItem
              to="/tasks"
              icon={<ListTodo className="h-5 w-5" />}
              text="Tasks"
              collapsed={collapsed}
            />
            <NavItem
              to="/calendar"
              icon={<Calendar className="h-5 w-5" />}
              text="Calendar"
              collapsed={collapsed}
            />
            <NavItem
              to="/contacts"
              icon={<Contact className="h-5 w-5" />}
              text="Contacts"
              collapsed={collapsed}
            />
            <NavItem
              to="/settings"
              icon={<Settings className="h-5 w-5" />}
              text="Settings"
              collapsed={collapsed}
            />
            <NavItem
              to="/help"
              icon={<HelpCircle className="h-5 w-5" />}
              text="Help"
              collapsed={collapsed}
            />
          </ul>
        </nav>

        <div className="p-4">
          <div className="rounded-lg bg-blue-50 p-4">
            {!collapsed && (
              <div className="text-sm">
                <p className="font-medium text-blue-900">Portfolio App</p>
                <p className="mt-1 text-blue-700">CRM Demo Version</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  text: string;
  collapsed: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, text, collapsed }) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          cn(
            "flex items-center rounded-lg px-3 py-2 text-gray-900 hover:bg-gray-100",
            isActive ? "bg-gray-100 font-medium" : "",
            collapsed ? "justify-center" : ""
          )
        }
      >
        {icon}
        {!collapsed && <span className="ml-3">{text}</span>}
      </NavLink>
    </li>
  );
};

export default Sidebar;
