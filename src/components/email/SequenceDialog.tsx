
import React, { useState } from "react";
import { CalendarIcon, Clock, Save } from "lucide-react";
import { format } from "date-fns";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AutomationSequence, AutomationTrigger, AutomationAction } from "@/types/emailAutomation";
import { EmailTemplate } from "@/types/emailAutomation";
import { Switch } from "@/components/ui/switch";

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
  const [triggerType, setTriggerType] = useState<string>(
    sequenceFormData.triggers?.[0]?.type || "contact-added"
  );
  
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>(
    sequenceFormData.triggers?.[0]?.config?.scheduledDate 
      ? new Date(sequenceFormData.triggers[0].config.scheduledDate as Date) 
      : undefined
  );
  
  const [scheduledTime, setScheduledTime] = useState<string>(
    sequenceFormData.triggers?.[0]?.config?.scheduledTime || "09:00 AM"
  );
  
  const [actionType, setActionType] = useState<string>(
    sequenceFormData.actions?.[0]?.type || "send-email"
  );
  
  const [useSpecificDate, setUseSpecificDate] = useState<boolean>(
    !!sequenceFormData.actions?.[0]?.config?.specificDate
  );
  
  const [specificDate, setSpecificDate] = useState<Date | undefined>(
    sequenceFormData.actions?.[0]?.config?.specificDate 
      ? new Date(sequenceFormData.actions[0].config.specificDate as Date) 
      : undefined
  );
  
  const [sendTime, setSendTime] = useState<string>(
    sequenceFormData.actions?.[0]?.config?.sendTime || "09:00 AM"
  );

  // Handle trigger type change
  const handleTriggerTypeChange = (type: string) => {
    setTriggerType(type);
    
    const newTrigger: AutomationTrigger = {
      id: sequenceFormData.triggers?.[0]?.id || `trigger-${Date.now()}`,
      type: type as any,
      config: {}
    };
    
    // Add appropriate config based on trigger type
    if (type === "scheduled" && scheduledDate) {
      newTrigger.config.scheduledDate = scheduledDate;
      newTrigger.config.scheduledTime = scheduledTime;
    } else if (type === "deal-stage-changed") {
      newTrigger.config.dealStage = "qualified";
    } else if (type === "task-completed") {
      newTrigger.config.taskCategory = "follow-up";
    }
    
    handleSequenceFormChange('triggers', [newTrigger]);
  };

  // Handle scheduled date change
  const handleScheduledDateChange = (date: Date | undefined) => {
    setScheduledDate(date);
    
    if (date && triggerType === "scheduled") {
      const updatedTriggers = [...(sequenceFormData.triggers || [])];
      if (updatedTriggers[0]) {
        updatedTriggers[0].config = {
          ...updatedTriggers[0].config,
          scheduledDate: date,
          scheduledTime: scheduledTime
        };
        handleSequenceFormChange('triggers', updatedTriggers);
      }
    }
  };

  // Handle scheduled time change
  const handleScheduledTimeChange = (time: string) => {
    setScheduledTime(time);
    
    if (scheduledDate && triggerType === "scheduled") {
      const updatedTriggers = [...(sequenceFormData.triggers || [])];
      if (updatedTriggers[0]) {
        updatedTriggers[0].config = {
          ...updatedTriggers[0].config,
          scheduledDate: scheduledDate,
          scheduledTime: time
        };
        handleSequenceFormChange('triggers', updatedTriggers);
      }
    }
  };

  // Handle action type change
  const handleActionTypeChange = (type: string) => {
    setActionType(type);
    
    const newAction: AutomationAction = {
      id: sequenceFormData.actions?.[0]?.id || `action-${Date.now()}`,
      type: type as any,
      config: {
        delayDays: 0
      }
    };
    
    if (type === "send-email") {
      newAction.config.templateId = templates[0]?.id;
      
      if (useSpecificDate && specificDate) {
        newAction.config.specificDate = specificDate;
        newAction.config.sendTime = sendTime;
      }
    } else if (type === "create-task") {
      newAction.config.taskTitle = "Follow up";
      newAction.config.taskDescription = "Follow up with contact";
    }
    
    handleSequenceFormChange('actions', [newAction]);
  };

  // Handle template change
  const handleTemplateChange = (templateId: string) => {
    const updatedActions = [...(sequenceFormData.actions || [])];
    if (updatedActions[0]) {
      updatedActions[0].config = {
        ...updatedActions[0].config,
        templateId
      };
      handleSequenceFormChange('actions', updatedActions);
    }
  };

  // Handle delay days change
  const handleDelayDaysChange = (delayDays: string) => {
    const updatedActions = [...(sequenceFormData.actions || [])];
    if (updatedActions[0]) {
      updatedActions[0].config = {
        ...updatedActions[0].config,
        delayDays: parseInt(delayDays) || 0
      };
      handleSequenceFormChange('actions', updatedActions);
    }
  };

  // Handle specific date change
  const handleSpecificDateChange = (date: Date | undefined) => {
    setSpecificDate(date);
    
    if (date && actionType === "send-email") {
      const updatedActions = [...(sequenceFormData.actions || [])];
      if (updatedActions[0]) {
        updatedActions[0].config = {
          ...updatedActions[0].config,
          specificDate: date,
          sendTime: sendTime
        };
        handleSequenceFormChange('actions', updatedActions);
      }
    }
  };

  // Handle send time change
  const handleSendTimeChange = (time: string) => {
    setSendTime(time);
    
    if (specificDate && actionType === "send-email") {
      const updatedActions = [...(sequenceFormData.actions || [])];
      if (updatedActions[0]) {
        updatedActions[0].config = {
          ...updatedActions[0].config,
          specificDate: specificDate,
          sendTime: time
        };
        handleSequenceFormChange('actions', updatedActions);
      }
    }
  };

  // Handle use specific date toggle
  const handleUseSpecificDateToggle = (checked: boolean) => {
    setUseSpecificDate(checked);
    
    const updatedActions = [...(sequenceFormData.actions || [])];
    if (updatedActions[0]) {
      if (checked && specificDate) {
        updatedActions[0].config = {
          ...updatedActions[0].config,
          specificDate: specificDate,
          sendTime: sendTime
        };
      } else {
        // Remove specific date fields if toggled off
        const { specificDate, sendTime, ...restConfig } = updatedActions[0].config;
        updatedActions[0].config = restConfig;
      }
      handleSequenceFormChange('actions', updatedActions);
    }
  };

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
                  value={triggerType}
                  onValueChange={handleTriggerTypeChange}
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
                
                {triggerType === "scheduled" && (
                  <div className="mt-4 space-y-4">
                    <div className="grid gap-2">
                      <Label htmlFor="scheduled-date">Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="scheduled-date"
                            variant="outline"
                            className="justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {scheduledDate ? format(scheduledDate, "PPP") : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={scheduledDate}
                            onSelect={handleScheduledDateChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="scheduled-time">Time</Label>
                      <Select value={scheduledTime} onValueChange={handleScheduledTimeChange}>
                        <SelectTrigger id="scheduled-time">
                          <SelectValue placeholder="Select time" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }).map((_, i) => {
                            const hour = i;
                            const period = hour >= 12 ? "PM" : "AM";
                            const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                            
                            return (
                              <React.Fragment key={hour}>
                                <SelectItem value={`${displayHour}:00 ${period}`}>
                                  {`${displayHour}:00 ${period}`}
                                </SelectItem>
                                <SelectItem value={`${displayHour}:30 ${period}`}>
                                  {`${displayHour}:30 ${period}`}
                                </SelectItem>
                              </React.Fragment>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                )}
                
                {triggerType === "deal-stage-changed" && (
                  <div className="mt-4">
                    <Label htmlFor="deal-stage">Deal Stage</Label>
                    <Select 
                      defaultValue="qualified"
                      onValueChange={(value) => {
                        const updatedTriggers = [...(sequenceFormData.triggers || [])];
                        if (updatedTriggers[0]) {
                          updatedTriggers[0].config = {
                            ...updatedTriggers[0].config,
                            dealStage: value
                          };
                          handleSequenceFormChange('triggers', updatedTriggers);
                        }
                      }}
                    >
                      <SelectTrigger id="deal-stage" className="mt-2">
                        <SelectValue placeholder="Select deal stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New Lead</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="negotiation">Negotiation</SelectItem>
                        <SelectItem value="closed">Closed Won</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {triggerType === "task-completed" && (
                  <div className="mt-4">
                    <Label htmlFor="task-category">Task Category</Label>
                    <Select 
                      defaultValue="follow-up"
                      onValueChange={(value) => {
                        const updatedTriggers = [...(sequenceFormData.triggers || [])];
                        if (updatedTriggers[0]) {
                          updatedTriggers[0].config = {
                            ...updatedTriggers[0].config,
                            taskCategory: value
                          };
                          handleSequenceFormChange('triggers', updatedTriggers);
                        }
                      }}
                    >
                      <SelectTrigger id="task-category" className="mt-2">
                        <SelectValue placeholder="Select task category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="follow-up">Follow-up</SelectItem>
                        <SelectItem value="call">Call</SelectItem>
                        <SelectItem value="meeting">Meeting</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="any">Any Category</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {triggerType === "contact-added" && (
                  <div className="mt-4">
                    <Label htmlFor="contact-status">Contact Status</Label>
                    <Select 
                      defaultValue="lead"
                      onValueChange={(value) => {
                        const updatedTriggers = [...(sequenceFormData.triggers || [])];
                        if (updatedTriggers[0]) {
                          updatedTriggers[0].config = {
                            ...updatedTriggers[0].config,
                            contactStatus: value
                          };
                          handleSequenceFormChange('triggers', updatedTriggers);
                        }
                      }}
                    >
                      <SelectTrigger id="contact-status" className="mt-2">
                        <SelectValue placeholder="Select contact status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                        <SelectItem value="any">Any Status</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
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
                    value={actionType}
                    onValueChange={handleActionTypeChange}
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
                  
                  {actionType === 'send-email' && (
                    <>
                      <div className="grid grid-cols-4 gap-4">
                        <Label htmlFor="template-select" className="text-right">
                          Email Template
                        </Label>
                        <div className="col-span-3">
                          <Select 
                            defaultValue={sequenceFormData.actions?.[0]?.config?.templateId || templates[0]?.id} 
                            onValueChange={handleTemplateChange}
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
                      
                      <div className="grid grid-cols-4 gap-4">
                        <Label htmlFor="send-options" className="text-right">
                          Send Options
                        </Label>
                        <div className="col-span-3 flex items-center space-x-2">
                          <Switch 
                            id="use-specific-date"
                            checked={useSpecificDate}
                            onCheckedChange={handleUseSpecificDateToggle}
                          />
                          <Label htmlFor="use-specific-date">
                            Send at specific date and time
                          </Label>
                        </div>
                      </div>
                      
                      {useSpecificDate ? (
                        <>
                          <div className="grid grid-cols-4 gap-4">
                            <Label htmlFor="specific-date" className="text-right">
                              Date
                            </Label>
                            <div className="col-span-3">
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    id="specific-date"
                                    variant="outline"
                                    className="w-full justify-start text-left font-normal"
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {specificDate ? format(specificDate, "PPP") : "Select date"}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={specificDate}
                                    onSelect={handleSpecificDateChange}
                                    initialFocus
                                    className="p-3 pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-4 gap-4">
                            <Label htmlFor="send-time" className="text-right">
                              Time
                            </Label>
                            <div className="col-span-3">
                              <Select value={sendTime} onValueChange={handleSendTimeChange}>
                                <SelectTrigger id="send-time">
                                  <SelectValue placeholder="Select time" />
                                </SelectTrigger>
                                <SelectContent>
                                  {Array.from({ length: 24 }).map((_, i) => {
                                    const hour = i;
                                    const period = hour >= 12 ? "PM" : "AM";
                                    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
                                    
                                    return (
                                      <React.Fragment key={hour}>
                                        <SelectItem value={`${displayHour}:00 ${period}`}>
                                          {`${displayHour}:00 ${period}`}
                                        </SelectItem>
                                        <SelectItem value={`${displayHour}:30 ${period}`}>
                                          {`${displayHour}:30 ${period}`}
                                        </SelectItem>
                                      </React.Fragment>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="grid grid-cols-4 gap-4">
                          <Label htmlFor="delay-days" className="text-right">
                            Delay (Days)
                          </Label>
                          <Input
                            id="delay-days"
                            type="number"
                            min="0"
                            className="col-span-3"
                            defaultValue={sequenceFormData.actions?.[0]?.config?.delayDays || "0"}
                            onChange={(e) => handleDelayDaysChange(e.target.value)}
                          />
                        </div>
                      )}
                    </>
                  )}
                  
                  {actionType === 'create-task' && (
                    <>
                      <div className="grid grid-cols-4 gap-4">
                        <Label htmlFor="task-title" className="text-right">
                          Task Title
                        </Label>
                        <Input
                          id="task-title"
                          className="col-span-3"
                          defaultValue={sequenceFormData.actions?.[0]?.config?.taskTitle || "Follow up"}
                          onChange={(e) => {
                            const updatedActions = [...(sequenceFormData.actions || [])];
                            if (updatedActions[0]) {
                              updatedActions[0].config = {
                                ...updatedActions[0].config,
                                taskTitle: e.target.value
                              };
                              handleSequenceFormChange('actions', updatedActions);
                            }
                          }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <Label htmlFor="task-description" className="text-right">
                          Description
                        </Label>
                        <Textarea
                          id="task-description"
                          className="col-span-3"
                          defaultValue={sequenceFormData.actions?.[0]?.config?.taskDescription || "Follow up with contact"}
                          onChange={(e) => {
                            const updatedActions = [...(sequenceFormData.actions || [])];
                            if (updatedActions[0]) {
                              updatedActions[0].config = {
                                ...updatedActions[0].config,
                                taskDescription: e.target.value
                              };
                              handleSequenceFormChange('actions', updatedActions);
                            }
                          }}
                        />
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4">
                        <Label htmlFor="delay-days" className="text-right">
                          Delay (Days)
                        </Label>
                        <Input
                          id="delay-days"
                          type="number"
                          min="0"
                          className="col-span-3"
                          defaultValue={sequenceFormData.actions?.[0]?.config?.delayDays || "0"}
                          onChange={(e) => handleDelayDaysChange(e.target.value)}
                        />
                      </div>
                    </>
                  )}
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
