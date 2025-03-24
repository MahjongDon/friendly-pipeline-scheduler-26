
export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
}

export interface SmsTemplate {
  id: string;
  name: string;
  body: string;
  category: string;
  characterCount: number;
}

export interface CallScript {
  id: string;
  name: string;
  script: string;
  category: string;
  hasDecisionPoints: boolean;
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
  type: "send-email" | "create-task" | "send-sms" | "schedule-call";
  config: {
    templateId?: string;
    smsTemplateId?: string;
    callScriptId?: string;
    taskTitle?: string;
    taskDescription?: string;
    delayDays?: number;
    delayHours?: number;
    sendTime?: string;
    specificDate?: Date;
    phoneNumber?: string;
  };
}

export interface EmailService {
  name: string;
  isConfigured: boolean;
  description: string;
}

export interface SmsService {
  name: string;
  isConfigured: boolean;
  description: string;
}

export interface CallService {
  name: string;
  isConfigured: boolean;
  description: string;
}

export interface CommunicationConfig {
  emailService: string | null;
  smsService: string | null;
  callService: string | null;
  defaultFromEmail: string | null;
  defaultFromName: string | null;
  defaultFromPhone: string | null;
}

export interface EmailStats {
  sent: number;
  opened: number;
  clicked: number;
  replied: number;
  bounced: number;
  openRate: number; // percentage
  clickRate: number; // percentage
  replyRate: number; // percentage
}

export interface SmsStats {
  sent: number;
  delivered: number;
  failed: number;
  replied: number;
  deliveryRate: number; // percentage
  replyRate: number; // percentage
}

export interface CallStats {
  scheduled: number;
  completed: number;
  missed: number;
  duration: number; // average in seconds
  completionRate: number; // percentage
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

export const smsServices: SmsService[] = [
  {
    name: "Twilio",
    isConfigured: false,
    description: "Use Twilio's API for SMS messaging"
  },
  {
    name: "Vonage",
    isConfigured: false,
    description: "Formerly Nexmo, for SMS and messaging APIs"
  },
  {
    name: "MessageBird",
    isConfigured: false,
    description: "Cloud communications platform for SMS"
  }
];

export const callServices: CallService[] = [
  {
    name: "Twilio",
    isConfigured: false,
    description: "Use Twilio's API for voice calls and recordings"
  },
  {
    name: "Vonage",
    isConfigured: false,
    description: "Voice APIs for automated calls"
  },
  {
    name: "Closebot",
    isConfigured: false,
    description: "AI-powered sales call automation"
  }
];
