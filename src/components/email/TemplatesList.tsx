
import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import TemplateCard from "./TemplateCard";
import { EmailTemplate } from "@/types/emailAutomation";

interface TemplatesListProps {
  templates: EmailTemplate[];
  onAddTemplate: () => void;
  onEditTemplate: (template: EmailTemplate) => void;
  onDeleteTemplate: (id: string) => void;
}

const TemplatesList: React.FC<TemplatesListProps> = ({
  templates,
  onAddTemplate,
  onEditTemplate,
  onDeleteTemplate
}) => {
  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={onAddTemplate}>
          <PlusCircle className="h-4 w-4 mr-2" /> Add Template
        </Button>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {templates.map(template => (
          <TemplateCard
            key={template.id}
            template={template}
            onEdit={onEditTemplate}
            onDelete={onDeleteTemplate}
          />
        ))}
      </div>
    </>
  );
};

export default TemplatesList;
