
import React from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AutomationSequence } from "@/types/emailAutomation";
import { EmailTemplate } from "@/types/emailAutomation";

interface SequenceDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  templates: EmailTemplate[];
  currentSequence: AutomationSequence | null;
  sequenceFormData: Partial<AutomationSequence>;
  handleSequenceFormChange: (field: string, value: any) => void;
  handleSaveSequence: (e: React.FormEvent) => void;
}

const SequenceDialog: React.FC<SequenceDialogProps> = ({
  isOpen,
  onOpenChange,
  templates,
  currentSequence,
  sequenceFormData,
  handleSequenceFormChange,
  handleSaveSequence
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
                value={sequenceFormData.name || ''}
                onChange={(e) => handleSequenceFormChange('name', e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="sequence-description">
                Description
              </Label>
              <Textarea
                id="sequence-description"
                value={sequenceFormData.description || ''}
                onChange={(e) => handleSequenceFormChange('description', e.target.value)}
                rows={2}
              />
            </div>
            
            <div className="grid gap-2 pt-4">
              <h3 className="text-lg font-medium">Triggers</h3>
              <p className="text-sm text-muted-foreground">
                Define when this automation sequence should start.
              </p>
              
              <div className="bg-muted p-4 rounded-md">
                <Select 
                  value="contact-added"
                  onValueChange={(value) => {
                    const newTriggers = [{
                      id: `trigger-${Date.now()}`,
                      type: value as any,
                      config: {}
                    }];
                    handleSequenceFormChange('triggers', newTriggers);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a trigger" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact-added">When a contact is added</SelectItem>
                    <SelectItem value="deal-stage-changed">When a deal moves to a specific stage</SelectItem>
                    <SelectItem value="task-completed">When a task is completed</SelectItem>
                    <SelectItem value="scheduled">At a scheduled time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2 pt-4">
              <h3 className="text-lg font-medium">Actions</h3>
              <p className="text-sm text-muted-foreground">
                Define what should happen when this automation is triggered.
              </p>
              
              <div className="bg-muted p-4 rounded-md">
                <div className="grid gap-4">
                  <Select 
                    defaultValue="send-email"
                    onValueChange={(value) => {
                      const newActions = [{
                        id: `action-${Date.now()}`,
                        type: value as any,
                        config: {
                          templateId: templates[0]?.id,
                          delayDays: 0
                        }
                      }];
                      handleSequenceFormChange('actions', newActions);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select an action" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="send-email">Send email from a template</SelectItem>
                      <SelectItem value="create-task">Create a task</SelectItem>
                      <SelectItem value="future-sms">(Coming soon) Send SMS</SelectItem>
                      <SelectItem value="future-call">(Coming soon) Schedule call</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  {sequenceFormData.actions?.[0]?.type === 'send-email' && (
                    <div className="grid grid-cols-4 gap-4">
                      <Label htmlFor="template-select" className="text-right">
                        Email Template
                      </Label>
                      <div className="col-span-3">
                        <Select 
                          defaultValue={templates[0]?.id} 
                          onValueChange={(value) => {
                            const updatedActions = [...(sequenceFormData.actions || [])];
                            if (updatedActions[0]) {
                              updatedActions[0].config = {
                                ...updatedActions[0].config,
                                templateId: value
                              };
                              handleSequenceFormChange('actions', updatedActions);
                            }
                          }}
                        >
                          <SelectTrigger id="template-select">
                            <SelectValue placeholder="Select a template" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map(template => (
                              <SelectItem key={template.id} value={template.id}>
                                {template.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {templates.length === 0 && (
                          <p className="text-xs text-amber-600 mt-1">
                            No templates available. Please create a template first.
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-4 gap-4">
                    <Label htmlFor="delay-days" className="text-right">
                      Delay (Days)
                    </Label>
                    <Input
                      id="delay-days"
                      type="number"
                      min="0"
                      className="col-span-3"
                      defaultValue="0"
                      onChange={(e) => {
                        const updatedActions = [...(sequenceFormData.actions || [])];
                        if (updatedActions[0]) {
                          updatedActions[0].config = {
                            ...updatedActions[0].config,
                            delayDays: parseInt(e.target.value) || 0
                          };
                          handleSequenceFormChange('actions', updatedActions);
                        }
                      }}
                    />
                  </div>
                </div>
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
  );
};

export default SequenceDialog;
