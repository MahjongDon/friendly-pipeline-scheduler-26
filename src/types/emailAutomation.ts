
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
}

export interface AutomationSequence {
  id: string;
  name: string;
  description: string;
  triggers: AutomationTrigger[];
  actions: AutomationAction[];
  isActive: boolean;
  createdAt: Date;
}

export interface AutomationTrigger {
  id: string;
  type: "task-completed" | "deal-stage-changed" | "contact-added" | "scheduled";
  config: {
    taskCategory?: string;
    dealStage?: string;
    scheduledDate?: Date;
    scheduledTime?: string;
    contactTags?: string[];
    contactStatus?: string;
  };
}

export interface AutomationAction {
  id: string;
  type: "send-email" | "create-task" | "future-sms" | "future-call";
  config: {
    templateId?: string;
    taskTitle?: string;
    taskDescription?: string;
    delayDays?: number;
    delayHours?: number;
    sendTime?: string;
    specificDate?: Date;
  };
}
