
import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Check, 
  Clock, 
  Mail, 
  MessageSquare, 
  Phone, 
  PlusCircle, 
  Save, 
  SendHorizontal,
  Trash,
  Users
} from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { format } from "date-fns";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  category: string;
}

interface AutomationSequence {
  id: string;
  name: string;
  description: string;
  triggers: AutomationTrigger[];
  actions: AutomationAction[];
  isActive: boolean;
  createdAt: Date;
}

interface AutomationTrigger {
  id: string;
  type: "task-completed" | "deal-stage-changed" | "contact-added" | "scheduled";
  config: {
    taskCategory?: string;
    dealStage?: string;
    scheduledDate?: Date;
  };
}

interface AutomationAction {
  id: string;
  type: "send-email" | "create-task" | "future-sms" | "future-call";
  config: {
    templateId?: string;
    taskTitle?: string;
    taskDescription?: string;
    delayDays?: number;
  };
}

// Sample email templates
const sampleTemplates: EmailTemplate[] = [
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
const sampleSequences: AutomationSequence[] = [
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

const TemplateCard: React.FC<{
  template: EmailTemplate;
  onEdit: (template: EmailTemplate) => void;
  onDelete: (id: string) => void;
}> = ({ template, onEdit, onDelete }) => {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{template.name}</span>
          <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
            {template.category}
          </span>
        </CardTitle>
        <CardDescription>
          Subject: {template.subject}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground whitespace-pre-line line-clamp-3">
          {template.body}
        </p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => onDelete(template.id)}>
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </Button>
        <Button size="sm" onClick={() => onEdit(template)}>
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
};

const SequenceCard: React.FC<{
  sequence: AutomationSequence;
  onEdit: (sequence: AutomationSequence) => void;
  onToggleActive: (id: string, active: boolean) => void;
  onDelete: (id: string) => void;
}> = ({ sequence, onEdit, onToggleActive, onDelete }) => {
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

const EmailAutomation: React.FC = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  // Templates state
  const [templates, setTemplates] = useState<EmailTemplate[]>(sampleTemplates);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [currentTemplate, setCurrentTemplate] = useState<EmailTemplate | null>(null);
  
  // Sequences state
  const [sequences, setSequences] = useState<AutomationSequence[]>(sampleSequences);
  const [isSequenceDialogOpen, setIsSequenceDialogOpen] = useState(false);
  const [currentSequence, setCurrentSequence] = useState<AutomationSequence | null>(null);
  
  // Template handling
  const handleEditTemplate = (template: EmailTemplate) => {
    setCurrentTemplate(template);
    setIsTemplateDialogOpen(true);
  };
  
  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id));
    toast.success("Template deleted successfully");
  };
  
  const handleAddTemplate = () => {
    setCurrentTemplate(null);
    setIsTemplateDialogOpen(true);
  };
  
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('#template-name') as HTMLInputElement).value;
    const subject = (form.querySelector('#template-subject') as HTMLInputElement).value;
    const body = (form.querySelector('#template-body') as HTMLTextAreaElement).value;
    const category = (form.querySelector('#template-category') as HTMLSelectElement).value;
    
    if (currentTemplate) {
      // Update existing template
      setTemplates(templates.map(t => 
        t.id === currentTemplate.id ? { ...t, name, subject, body, category } : t
      ));
      toast.success("Template updated successfully");
    } else {
      // Add new template
      const newTemplate: EmailTemplate = {
        id: `template-${Date.now()}`,
        name,
        subject,
        body,
        category
      };
      setTemplates([...templates, newTemplate]);
      toast.success("Template created successfully");
    }
    
    setIsTemplateDialogOpen(false);
  };
  
  // Sequence handling
  const handleEditSequence = (sequence: AutomationSequence) => {
    setCurrentSequence(sequence);
    setIsSequenceDialogOpen(true);
  };
  
  const handleDeleteSequence = (id: string) => {
    setSequences(sequences.filter(s => s.id !== id));
    toast.success("Automation sequence deleted successfully");
  };
  
  const handleAddSequence = () => {
    setCurrentSequence(null);
    setIsSequenceDialogOpen(true);
  };
  
  const handleToggleSequenceActive = (id: string, active: boolean) => {
    setSequences(sequences.map(s => 
      s.id === id ? { ...s, isActive: active } : s
    ));
    toast.success(`Sequence ${active ? 'activated' : 'deactivated'}`);
  };
  
  const handleSaveSequence = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, we would collect all form data here
    
    if (currentSequence) {
      // Pretend to update the sequence
      toast.success("Sequence updated successfully");
    } else {
      // Pretend to create a new sequence
      toast.success("Sequence created successfully");
    }
    
    setIsSequenceDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div 
        className={cn(
          "flex-1 transition-all duration-300 ease-smooth",
          sidebarCollapsed ? "ml-16" : "ml-64",
          isMobile && "ml-0"
        )}
      >
        <Header />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Email Automation</h1>
              <p className="text-muted-foreground">Create and manage email templates and automation sequences</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button size="sm" onClick={handleAddSequence}>
                <PlusCircle className="h-4 w-4 mr-2" /> New Sequence
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="sequences" className="mb-6">
            <TabsList>
              <TabsTrigger value="sequences">Automation Sequences</TabsTrigger>
              <TabsTrigger value="templates">Email Templates</TabsTrigger>
              <TabsTrigger value="future" disabled>Future Channels (Coming Soon)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="sequences" className="mt-4">
              <div className="grid gap-6 md:grid-cols-2">
                {sequences.map(sequence => (
                  <SequenceCard 
                    key={sequence.id}
                    sequence={sequence}
                    onEdit={handleEditSequence}
                    onToggleActive={handleToggleSequenceActive}
                    onDelete={handleDeleteSequence}
                  />
                ))}
                
                <Card className="border-dashed flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={handleAddSequence}
                >
                  <PlusCircle className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground font-medium">Add New Automation Sequence</p>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="templates" className="mt-4">
              <div className="flex justify-end mb-4">
                <Button onClick={handleAddTemplate}>
                  <PlusCircle className="h-4 w-4 mr-2" /> Add Template
                </Button>
              </div>
              
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {templates.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    onEdit={handleEditTemplate}
                    onDelete={handleDeleteTemplate}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="future" className="mt-4">
              <div className="p-12 text-center">
                <div className="flex items-center justify-center space-x-6 mb-6">
                  <div className="flex flex-col items-center">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mb-2" />
                    <span className="font-medium">SMS</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Phone className="h-12 w-12 text-muted-foreground mb-2" />
                    <span className="font-medium">Calls</span>
                  </div>
                </div>
                <h3 className="text-xl font-medium mb-2">Additional Channels Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  We're working on adding SMS and automated call scheduling capabilities to enhance
                  your automation workflows.
                </p>
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Template Dialog */}
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>{currentTemplate ? "Edit Email Template" : "Create Email Template"}</DialogTitle>
                <DialogDescription>
                  Design your email template with variables that will be automatically filled in.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveTemplate}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="template-name"
                      defaultValue={currentTemplate?.name}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template-subject" className="text-right">
                      Subject
                    </Label>
                    <Input
                      id="template-subject"
                      defaultValue={currentTemplate?.subject}
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="template-category" className="text-right">
                      Category
                    </Label>
                    <Select defaultValue={currentTemplate?.category || "general"}>
                      <SelectTrigger id="template-category" className="col-span-3">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="onboarding">Onboarding</SelectItem>
                        <SelectItem value="sales">Sales</SelectItem>
                        <SelectItem value="meetings">Meetings</SelectItem>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-4 gap-4">
                    <Label htmlFor="template-body" className="text-right">
                      Body
                    </Label>
                    <div className="col-span-3">
                      <Textarea
                        id="template-body"
                        defaultValue={currentTemplate?.body}
                        rows={10}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Available variables: &#123;contact.firstName&#125;, &#123;contact.lastName&#125;, &#123;user.name&#125;, &#123;deal.name&#125;, &#123;meeting.date&#125;, &#123;meeting.time&#125;
                      </p>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Template
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
          
          {/* Sequence Dialog */}
          <Dialog open={isSequenceDialogOpen} onOpenChange={setIsSequenceDialogOpen}>
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>{currentSequence ? "Edit Automation Sequence" : "Create Automation Sequence"}</DialogTitle>
                <DialogDescription>
                  Configure when and how your automated emails should be sent.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSaveSequence}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="sequence-name">
                      Sequence Name
                    </Label>
                    <Input
                      id="sequence-name"
                      defaultValue={currentSequence?.name}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sequence-description">
                      Description
                    </Label>
                    <Textarea
                      id="sequence-description"
                      defaultValue={currentSequence?.description}
                      rows={2}
                    />
                  </div>
                  
                  <div className="grid gap-2 pt-4">
                    <h3 className="text-lg font-medium">Triggers</h3>
                    <p className="text-sm text-muted-foreground">
                      Define when this automation sequence should start.
                    </p>
                    
                    {/* Trigger selection would go here - simplified for this example */}
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm">
                        You would configure trigger conditions here such as:
                      </p>
                      <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                        <li>When a contact is added</li>
                        <li>When a deal moves to a specific stage</li>
                        <li>When a task is completed</li>
                        <li>At a scheduled time and date</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="grid gap-2 pt-4">
                    <h3 className="text-lg font-medium">Actions</h3>
                    <p className="text-sm text-muted-foreground">
                      Define what should happen when this automation is triggered.
                    </p>
                    
                    {/* Action configuration would go here - simplified for this example */}
                    <div className="bg-muted p-4 rounded-md">
                      <p className="text-sm">
                        You would configure actions here such as:
                      </p>
                      <ul className="list-disc list-inside text-sm mt-2 space-y-1">
                        <li>Send email from a template</li>
                        <li>Create a task with specific details</li>
                        <li>Add a delay between actions</li>
                        <li>(Coming soon) Send SMS or schedule calls</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">
                    <Save className="h-4 w-4 mr-2" />
                    Save Sequence
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
};

export default EmailAutomation;
