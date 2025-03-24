
import React from "react";
import { Check, Trash } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AutomationSequence, AutomationTrigger, AutomationAction } from "@/types/emailAutomation";
import { sampleTemplates } from "@/data/sampleEmailData";

interface SequenceCardProps {
  sequence: AutomationSequence;
  onEdit: (sequence: AutomationSequence) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}

const SequenceCard: React.FC<SequenceCardProps> = ({ 
  sequence, 
  onEdit, 
  onToggleActive, 
  onDelete 
}) => {
  const getTriggerDescription = (trigger: AutomationTrigger) => {
    switch (trigger.type) {
      case "contact-added":
        return "When a new contact is added";
      case "deal-stage-changed":
        return `When deal stage changes to ${trigger.config.dealStage}`;
      case "task-completed":
        return `When a ${trigger.config.taskCategory || "any"} task is completed`;
      case "scheduled":
        return `At scheduled time: ${trigger.config.scheduledDate 
          ? format(new Date(trigger.config.scheduledDate), "PPP")
          : "Not set"}`;
      default:
        return "Unknown trigger";
    }
  };

  const getActionDescription = (action: AutomationAction) => {
    switch (action.type) {
      case "send-email":
        return `Send email: ${sampleTemplates.find(t => t.id === action.config.templateId)?.name || "Unknown template"}${
          action.config.delayDays ? ` (after ${action.config.delayDays} days)` : ""
        }`;
      case "create-task":
        return `Create task: ${action.config.taskTitle}${
          action.config.delayDays ? ` (after ${action.config.delayDays} days)` : ""
        }`;
      case "future-sms":
        return "Send SMS (Feature coming soon)";
      case "future-call":
        return "Schedule call (Feature coming soon)";
      default:
        return "Unknown action";
    }
  };

  return (
    <Card className={cn("border-l-4", sequence.isActive ? "border-l-green-500" : "border-l-gray-300")}>
      <CardHeader>
        <CardTitle className="flex justify-between">
          <span>{sequence.name}</span>
          <Button
            variant={sequence.isActive ? "default" : "outline"}
            size="sm"
            onClick={() => onToggleActive(sequence.id, !sequence.isActive)}
          >
            {sequence.isActive ? (
              <>
                <Check className="h-4 w-4 mr-2" />
                Active
              </>
            ) : (
              "Inactive"
            )}
          </Button>
        </CardTitle>
        <CardDescription>{sequence.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">Triggers:</h4>
          <ul className="space-y-1 text-sm">
            {sequence.triggers.map((trigger) => (
              <li key={trigger.id} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                {getTriggerDescription(trigger)}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-medium mb-2">Actions:</h4>
          <ul className="space-y-1 text-sm">
            {sequence.actions.map((action) => (
              <li key={action.id} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary"></span>
                {getActionDescription(action)}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onDelete(sequence.id)}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
        <Button size="sm" onClick={() => onEdit(sequence)}>
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SequenceCard;
