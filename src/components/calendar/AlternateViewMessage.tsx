
import React from "react";
import { Button } from "@/components/ui/button";

interface AlternateViewMessageProps {
  onSwitchView: (view: "day" | "week" | "month") => void;
}

const AlternateViewMessage: React.FC<AlternateViewMessageProps> = ({ onSwitchView }) => {
  return (
    <div className="text-center py-10 text-muted-foreground">
      Daily view provides the most detailed event information.
      <div className="mt-2">
        <Button variant="outline" size="sm" onClick={() => onSwitchView("day")}>
          Switch to Day View
        </Button>
      </div>
    </div>
  );
};

export default AlternateViewMessage;
