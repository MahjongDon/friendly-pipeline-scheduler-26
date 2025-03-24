
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
import { EmailTemplate } from "@/types/emailAutomation";

interface TemplateDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  currentTemplate: EmailTemplate | null;
  onSave: (e: React.FormEvent) => void;
}

const TemplateDialog: React.FC<TemplateDialogProps> = ({
  isOpen,
  onOpenChange,
  currentTemplate,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{currentTemplate ? "Edit Email Template" : "Create Email Template"}</DialogTitle>
          <DialogDescription>
            Design your email template with variables that will be automatically filled in.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSave}>
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
  );
};

export default TemplateDialog;
