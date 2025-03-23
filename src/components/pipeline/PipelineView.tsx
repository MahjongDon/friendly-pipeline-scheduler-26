
import React, { useState } from "react";
import { ChevronDown, ChevronUp, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Sample data types
interface Deal {
  id: string;
  name: string;
  company: string;
  value: number;
  probability: number;
  tags: string[];
}

interface Stage {
  id: string;
  name: string;
  deals: Deal[];
}

// Sample data
const samplePipeline: Stage[] = [
  {
    id: "lead",
    name: "Lead",
    deals: [
      {
        id: "deal-1",
        name: "Website Redesign",
        company: "Acme Corp",
        value: 12000,
        probability: 20,
        tags: ["design", "web"],
      },
      {
        id: "deal-2",
        name: "Marketing Campaign",
        company: "Globex",
        value: 8500,
        probability: 30,
        tags: ["marketing"],
      },
    ],
  },
  {
    id: "qualified",
    name: "Qualified",
    deals: [
      {
        id: "deal-3",
        name: "CRM Implementation",
        company: "Wayne Enterprises",
        value: 25000,
        probability: 50,
        tags: ["software", "integration"],
      },
    ],
  },
  {
    id: "proposal",
    name: "Proposal",
    deals: [
      {
        id: "deal-4",
        name: "Cloud Migration",
        company: "Stark Industries",
        value: 45000,
        probability: 70,
        tags: ["cloud", "infrastructure"],
      },
      {
        id: "deal-5",
        name: "Security Audit",
        company: "Daily Planet",
        value: 18000,
        probability: 65,
        tags: ["security"],
      },
    ],
  },
  {
    id: "negotiation",
    name: "Negotiation",
    deals: [
      {
        id: "deal-6",
        name: "Mobile App Development",
        company: "Oscorp",
        value: 36000,
        probability: 85,
        tags: ["mobile", "development"],
      },
    ],
  },
  {
    id: "closed",
    name: "Closed Won",
    deals: [
      {
        id: "deal-7",
        name: "Annual Support Contract",
        company: "LexCorp",
        value: 55000,
        probability: 100,
        tags: ["support", "annual"],
      },
    ],
  },
];

const DealCard: React.FC<{ deal: Deal }> = ({ deal }) => {
  return (
    <div className="bg-white rounded-md border p-3 mb-3 hover:shadow-subtle transition-all duration-200 cursor-pointer animate-scale-in">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-medium mb-1 truncate">{deal.name}</h4>
          <p className="text-sm text-muted-foreground mb-2">{deal.company}</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>Edit deal</DropdownMenuItem>
            <DropdownMenuItem>Move to stage</DropdownMenuItem>
            <DropdownMenuItem>Add note</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">Delete deal</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm font-medium">${deal.value.toLocaleString()}</span>
        <Badge variant="outline" className="text-xs bg-primary/10 hover:bg-primary/20">
          {deal.probability}%
        </Badge>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {deal.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs font-normal">
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
};

const StageColumn: React.FC<{ stage: Stage }> = ({ stage }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const totalValue = stage.deals.reduce((sum, deal) => sum + deal.value, 0);

  return (
    <div className="pipeline-stage">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="font-medium">{stage.name}</h3>
          <p className="text-sm text-muted-foreground">
            {stage.deals.length} {stage.deals.length === 1 ? "deal" : "deals"} · $
            {totalValue.toLocaleString()}
          </p>
        </div>
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>

      {!isCollapsed && (
        <>
          <div className="space-y-3">
            {stage.deals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
          <Button variant="ghost" size="sm" className="w-full mt-3 text-muted-foreground">
            <Plus className="h-4 w-4 mr-1" /> Add deal
          </Button>
        </>
      )}
    </div>
  );
};

const PipelineView: React.FC = () => {
  const [pipeline, setPipeline] = useState(samplePipeline);

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="flex gap-4 min-w-max p-1">
        {pipeline.map((stage) => (
          <StageColumn key={stage.id} stage={stage} />
        ))}
        <div className="w-[280px] h-[200px] border border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
          <Button variant="ghost">
            <Plus className="h-4 w-4 mr-2" /> Add Stage
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PipelineView;
