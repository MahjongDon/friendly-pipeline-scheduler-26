
import React, { useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
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
import { EmailTemplate } from "@/types/emailAutomation";

interface ComposeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (email: {
    to: string;
    subject: string;
    body: string;
  }) => void;
  templates?: EmailTemplate[];
}

const ComposeDialog: React.FC<ComposeDialogProps> = ({
  isOpen,
  onOpenChange,
  onSend,
  templates = [],
}) => {
  const [to, setTo] = useState<string>("");
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [useTemplate, setUseTemplate] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!to) {
      toast.error("Please enter a recipient email address");
      return;
    }

    if (!subject) {
      toast.error("Please enter a subject");
      return;
    }

    if (!body) {
      toast.error("Please enter a message");
      return;
    }

    onSend({ to, subject, body });
    resetForm();
    onOpenChange(false);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId);
    if (template) {
      setSubject(template.subject);
      setBody(template.body);
    }
  };

  const resetForm = () => {
    setTo("");
    setSubject("");
    setBody("");
    setUseTemplate(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) resetForm();
      onOpenChange(open);
    }}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Compose New Email</DialogTitle>
          <DialogDescription>
            Create and send a new email message
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="use-template" className="shrink-0">
                Use Template:
              </Label>
              <Select
                disabled={templates.length === 0}
                onValueChange={handleTemplateSelect}
              >
                <SelectTrigger id="use-template" className="flex-1">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="to">To:</Label>
              <Input
                id="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="recipient@example.com"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="subject">Subject:</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Email subject"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="body">Message:</Label>
              <Textarea
                id="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your message here..."
                rows={10}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeDialog;
