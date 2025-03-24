
import React, { useState } from "react";
import { MessageSquare, Phone, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TemplatesList from "@/components/email/TemplatesList";
import SequencesList from "@/components/email/SequencesList";
import TemplateDialog from "@/components/email/TemplateDialog";
import SequenceDialog from "@/components/email/SequenceDialog";
import { EmailTemplate, AutomationSequence } from "@/types/emailAutomation";
import { sampleTemplates, sampleSequences } from "@/data/sampleEmailData";

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
  const [sequenceFormData, setSequenceFormData] = useState<Partial<AutomationSequence>>({
    name: '',
    description: '',
    triggers: [],
    actions: [],
    isActive: true
  });
  
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
    setSequenceFormData({
      name: sequence.name,
      description: sequence.description,
      triggers: sequence.triggers,
      actions: sequence.actions,
      isActive: sequence.isActive
    });
    setIsSequenceDialogOpen(true);
  };
  
  const handleDeleteSequence = (id: string) => {
    setSequences(sequences.filter(s => s.id !== id));
    toast.success("Automation sequence deleted successfully");
  };
  
  const handleAddSequence = () => {
    setCurrentSequence(null);
    setSequenceFormData({
      name: '',
      description: '',
      triggers: [{
        id: `trigger-${Date.now()}`,
        type: 'contact-added',
        config: {}
      }],
      actions: [{
        id: `action-${Date.now()}`,
        type: 'send-email',
        config: {
          templateId: templates[0]?.id,
          delayDays: 0
        }
      }],
      isActive: true
    });
    setIsSequenceDialogOpen(true);
  };
  
  const handleToggleSequenceActive = (id: string, active: boolean) => {
    setSequences(sequences.map(s => 
      s.id === id ? { ...s, isActive: active } : s
    ));
    toast.success(`Sequence ${active ? 'activated' : 'deactivated'}`);
  };
  
  const handleSequenceFormChange = (field: string, value: any) => {
    setSequenceFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleSaveSequence = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sequenceFormData.name) {
      toast.error("Sequence name is required");
      return;
    }
    
    if (currentSequence) {
      // Update existing sequence
      setSequences(prevSequences => prevSequences.map(s => 
        s.id === currentSequence.id ? {
          ...currentSequence,
          name: sequenceFormData.name || currentSequence.name,
          description: sequenceFormData.description || currentSequence.description,
          triggers: sequenceFormData.triggers || currentSequence.triggers,
          actions: sequenceFormData.actions || currentSequence.actions,
          isActive: sequenceFormData.isActive !== undefined ? sequenceFormData.isActive : currentSequence.isActive
        } : s
      ));
      toast.success("Sequence updated successfully");
    } else {
      // Create new sequence
      const newSequence: AutomationSequence = {
        id: `sequence-${Date.now()}`,
        name: sequenceFormData.name || 'New Sequence',
        description: sequenceFormData.description || '',
        triggers: sequenceFormData.triggers || [],
        actions: sequenceFormData.actions || [],
        isActive: sequenceFormData.isActive !== undefined ? sequenceFormData.isActive : true,
        createdAt: new Date()
      };
      
      setSequences(prevSequences => [...prevSequences, newSequence]);
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
              <SequencesList 
                sequences={sequences}
                onAddSequence={handleAddSequence}
                onEditSequence={handleEditSequence}
                onToggleSequence={handleToggleSequenceActive}
                onDeleteSequence={handleDeleteSequence}
              />
            </TabsContent>
            
            <TabsContent value="templates" className="mt-4">
              <TemplatesList
                templates={templates}
                onAddTemplate={handleAddTemplate}
                onEditTemplate={handleEditTemplate}
                onDeleteTemplate={handleDeleteTemplate}
              />
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
          <TemplateDialog
            isOpen={isTemplateDialogOpen}
            onOpenChange={setIsTemplateDialogOpen}
            currentTemplate={currentTemplate}
            onSave={handleSaveTemplate}
          />
          
          {/* Sequence Dialog */}
          <SequenceDialog
            isOpen={isSequenceDialogOpen}
            onOpenChange={setIsSequenceDialogOpen}
            templates={templates}
            currentSequence={currentSequence}
            sequenceFormData={sequenceFormData}
            handleSequenceFormChange={handleSequenceFormChange}
            handleSaveSequence={handleSaveSequence}
          />
        </main>
      </div>
    </div>
  );
};

export default EmailAutomation;
