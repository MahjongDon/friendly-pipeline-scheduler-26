
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { EmailTemplate } from "@/types/emailAutomation";
import { AlertCircle, Mail } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  to: z.string().email({ message: "Please enter a valid email address" }),
  subject: z.string().min(1, { message: "Subject is required" }),
  body: z.string().min(1, { message: "Email body is required" }),
});

interface ComposeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (data: z.infer<typeof formSchema>) => void;
  templates: EmailTemplate[];
  usingRealEmailService?: boolean;
}

const ComposeDialog: React.FC<ComposeDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onSend,
  templates,
  usingRealEmailService = false
}) => {
  const [activeTab, setActiveTab] = useState("compose");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      to: "",
      subject: "",
      body: "",
    },
  });
  
  const handleApplyTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      form.setValue("subject", template.subject);
      form.setValue("body", template.content);
      setSelectedTemplate(templateId);
      setActiveTab("compose");
    }
  };
  
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSending(true);
    try {
      await onSend(data);
      form.reset();
      setSelectedTemplate(null);
    } finally {
      setIsSending(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Compose New Email</DialogTitle>
          <DialogDescription>
            Create and send a new email message
          </DialogDescription>
        </DialogHeader>
        
        {!usingRealEmailService && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertDescription className="flex items-center">
              <AlertCircle className="h-4 w-4 text-amber-600 mr-2" />
              <span className="text-amber-800">
                Email service not configured - this will use simulated sending
              </span>
            </AlertDescription>
          </Alert>
        )}
        
        {usingRealEmailService && (
          <Alert className="bg-green-50 border-green-200">
            <AlertDescription className="flex items-center">
              <Mail className="h-4 w-4 text-green-600 mr-2" />
              <span className="text-green-800">
                Using configured email service for sending
              </span>
            </AlertDescription>
          </Alert>
        )}
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="compose">Compose</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
          </TabsList>
          
          <TabsContent value="compose">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <FormControl>
                        <Input placeholder="recipient@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Email subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write your message here..." 
                          rows={12}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => onOpenChange(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSending}>
                    {isSending ? "Sending..." : "Send Email"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="templates">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              {templates.map((template) => (
                <div 
                  key={template.id}
                  className={`border rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                    selectedTemplate === template.id ? "border-blue-500 bg-blue-50" : ""
                  }`}
                  onClick={() => handleApplyTemplate(template.id)}
                >
                  <h4 className="font-medium mb-1">{template.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">{template.subject}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {template.content.length > 100 
                      ? template.content.substring(0, 100) + "..." 
                      : template.content}
                  </p>
                </div>
              ))}
            </div>
            
            <DialogFooter className="flex justify-between">
              <div>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setActiveTab("compose")}
                  disabled={!selectedTemplate}
                >
                  Cancel
                </Button>
                <Button 
                  type="button"
                  className="ml-2"
                  onClick={() => selectedTemplate && handleApplyTemplate(selectedTemplate)}
                  disabled={!selectedTemplate}
                >
                  Use Selected Template
                </Button>
              </div>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ComposeDialog;
