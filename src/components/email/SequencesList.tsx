
import React from "react";
import { PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import SequenceCard from "./SequenceCard";
import { AutomationSequence } from "@/types/emailAutomation";

interface SequencesListProps {
  sequences: AutomationSequence[];
  onAddSequence: () => void;
  onEditSequence: (sequence: AutomationSequence) => void;
  onToggleSequence: (id: string, active: boolean) => void;
  onDeleteSequence: (id: string) => void;
}

const SequencesList: React.FC<SequencesListProps> = ({
  sequences,
  onAddSequence,
  onEditSequence,
  onToggleSequence,
  onDeleteSequence
}) => {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {sequences.map(sequence => (
        <SequenceCard 
          key={sequence.id}
          sequence={sequence}
          onEdit={onEditSequence}
          onToggleActive={onToggleSequence}
          onDelete={onDeleteSequence}
        />
      ))}
      
      <Card 
        className="border-dashed flex flex-col items-center justify-center p-6 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onAddSequence}
      >
        <PlusCircle className="h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground font-medium">Add New Automation Sequence</p>
      </Card>
    </div>
  );
};

export default SequencesList;
