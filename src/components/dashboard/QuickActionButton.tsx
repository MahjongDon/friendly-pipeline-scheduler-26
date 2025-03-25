
import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
}

const QuickActionButton: React.FC<QuickActionButtonProps> = ({
  icon: Icon,
  label,
  onClick,
  className,
}) => {
  return (
    <button
      className={cn(
        "flex flex-col items-center justify-center p-6 rounded-lg border border-border bg-card hover:bg-accent transition-colors w-full",
        className
      )}
      onClick={onClick}
    >
      <Icon className="h-6 w-6 mb-2 text-muted-foreground" />
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default QuickActionButton;
