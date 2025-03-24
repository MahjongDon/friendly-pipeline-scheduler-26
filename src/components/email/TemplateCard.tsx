
import React from "react";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmailTemplate } from "@/types/emailAutomation";

interface TemplateCardProps {
  template: EmailTemplate;
  onEdit: (template: EmailTemplate) => void;
  onDelete: (id: string) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ template, onEdit, onDelete }) => {
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

export default TemplateCard;
