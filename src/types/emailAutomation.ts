
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

export interface EmailService {
  name: string;
  isConfigured: boolean;
  description: string;
}

export const emailServices: EmailService[] = [
  {
    name: "SMTP",
    isConfigured: false,
    description: "Connect your SMTP server to send emails directly"
  },
  {
    name: "SendGrid",
    isConfigured: false,
    description: "Use SendGrid's API to send transactional emails"
  },
  {
    name: "Mailchimp",
    isConfigured: false,
    description: "Connect to Mailchimp for email campaigns and automation"
  },
  {
    name: "Amazon SES",
    isConfigured: false,
    description: "Use Amazon Simple Email Service for reliable email delivery"
  }
];
