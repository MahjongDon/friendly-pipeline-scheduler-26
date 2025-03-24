
import { EmailTemplate, AutomationSequence } from "@/types/emailAutomation";

// Sample email templates
export const sampleTemplates: EmailTemplate[] = [
  {
    id: "template-1",
    name: "Welcome Email",
    subject: "Welcome to Our Service",
    body: "Dear {contact.firstName},\n\nThank you for choosing our service. We're excited to have you on board!\n\nBest regards,\n{user.name}",
    category: "onboarding",
  },
  {
    id: "template-2",
    name: "Follow-up Email",
    subject: "Following up on our discussion",
    body: "Hi {contact.firstName},\n\nI wanted to follow up on our recent discussion about {deal.name}. Have you had a chance to review the proposal?\n\nRegards,\n{user.name}",
    category: "sales",
  },
  {
    id: "template-3",
    name: "Meeting Confirmation",
    subject: "Confirming our meeting",
    body: "Hello {contact.firstName},\n\nI'm writing to confirm our meeting scheduled for {meeting.date} at {meeting.time}.\n\nLooking forward to speaking with you.\n\nBest,\n{user.name}",
    category: "meetings",
  },
];

// Sample automation sequences
export const sampleSequences: AutomationSequence[] = [
  {
    id: "sequence-1",
    name: "New Lead Nurturing",
    description: "A sequence to nurture new leads with timely follow-ups",
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 5), // 5 days ago
    triggers: [
      {
        id: "trigger-1",
        type: "contact-added",
        config: {},
      },
    ],
    actions: [
      {
        id: "action-1",
        type: "send-email",
        config: {
          templateId: "template-1",
          delayDays: 0,
        },
      },
      {
        id: "action-2",
        type: "send-email",
        config: {
          templateId: "template-2",
          delayDays: 3,
        },
      },
      {
        id: "action-3",
        type: "create-task",
        config: {
          taskTitle: "Call new lead",
          taskDescription: "Make a personal outreach call to new lead",
          delayDays: 5,
        },
      },
    ],
  },
  {
    id: "sequence-2",
    name: "Deal Stage Progression",
    description: "Automated actions when a deal moves to negotiation stage",
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 2), // 2 days ago
    triggers: [
      {
        id: "trigger-2",
        type: "deal-stage-changed",
        config: {
          dealStage: "negotiation",
        },
      },
    ],
    actions: [
      {
        id: "action-4",
        type: "send-email",
        config: {
          templateId: "template-3",
          delayDays: 0,
        },
      },
      {
        id: "action-5",
        type: "create-task",
        config: {
          taskTitle: "Prepare contract draft",
          taskDescription: "Create draft contract for review",
          delayDays: 1,
        },
      },
    ],
  },
];
