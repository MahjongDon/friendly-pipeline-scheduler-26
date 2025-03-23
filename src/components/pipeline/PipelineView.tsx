
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

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

interface DealCardProps {
  deal: Deal;
  onEdit: (id: string, updatedDeal: Partial<Deal>) => void;
  onDelete: (id: string) => void;
}

const DealCard: React.FC<DealCardProps> = ({ deal, onEdit, onDelete }) => {
  const [isEditDealOpen, setIsEditDealOpen] = useState(false);

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get form data
    const form = e.target as HTMLFormElement;
    const dealName = (form.querySelector('#edit-deal-name') as HTMLInputElement).value;
    const company = (form.querySelector('#edit-company') as HTMLInputElement).value;
    const value = Number((form.querySelector('#edit-value') as HTMLInputElement).value);
    const probability = Number((form.querySelector('#edit-probability') as HTMLInputElement).value);
    
    // Create updated deal
    const updatedDeal: Partial<Deal> = {
      name: dealName,
      company,
      value,
      probability,
    };
    
    onEdit(deal.id, updatedDeal);
    setIsEditDealOpen(false);
  };

  return (
    <>
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
              <DropdownMenuItem onClick={() => setIsEditDealOpen(true)}>Edit deal</DropdownMenuItem>
              <DropdownMenuItem>Move to stage</DropdownMenuItem>
              <DropdownMenuItem>Add note</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive"
                onClick={() => {
                  onDelete(deal.id);
                }}
              >
                Delete deal
              </DropdownMenuItem>
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

      <Dialog open={isEditDealOpen} onOpenChange={setIsEditDealOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Deal</DialogTitle>
            <DialogDescription>
              Make changes to the deal information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEdit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-deal-name" className="text-right">
                  Deal Name
                </Label>
                <Input
                  id="edit-deal-name"
                  defaultValue={deal.name}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-company" className="text-right">
                  Company
                </Label>
                <Input
                  id="edit-company"
                  defaultValue={deal.company}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-value" className="text-right">
                  Value ($)
                </Label>
                <Input
                  id="edit-value"
                  type="number"
                  defaultValue={deal.value}
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-probability" className="text-right">
                  Probability (%)
                </Label>
                <Input
                  id="edit-probability"
                  type="number"
                  min="0"
                  max="100"
                  defaultValue={deal.probability}
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface StageColumnProps {
  stage: Stage;
  onAddDeal: (stageId: string) => void;
  onEditDeal: (dealId: string, updatedDeal: Partial<Deal>) => void;
  onDeleteDeal: (dealId: string) => void;
}

const StageColumn: React.FC<StageColumnProps> = ({ stage, onAddDeal, onEditDeal, onDeleteDeal }) => {
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
              <DealCard 
                key={deal.id} 
                deal={deal} 
                onEdit={onEditDeal}
                onDelete={onDeleteDeal} 
              />
            ))}
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full mt-3 text-muted-foreground"
            onClick={() => onAddDeal(stage.id)}
          >
            <Plus className="h-4 w-4 mr-1" /> Add deal
          </Button>
        </>
      )}
    </div>
  );
};

const PipelineView: React.FC = () => {
  const [pipeline, setPipeline] = useState(samplePipeline);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const [selectedStageId, setSelectedStageId] = useState("");
  const [isAddStageOpen, setIsAddStageOpen] = useState(false);

  const handleAddDealClick = (stageId: string) => {
    setSelectedStageId(stageId);
    setIsAddDealOpen(true);
  };

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get form data
    const form = e.target as HTMLFormElement;
    const dealName = (form.querySelector('#deal-name') as HTMLInputElement).value;
    const company = (form.querySelector('#company') as HTMLInputElement).value;
    const value = Number((form.querySelector('#value') as HTMLInputElement).value);
    const probability = Number((form.querySelector('#probability') as HTMLInputElement).value);
    
    // Create new deal
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      name: dealName,
      company,
      value,
      probability,
      tags: ["new"],
    };
    
    // Add to pipeline
    setPipeline(pipeline.map(stage => 
      stage.id === selectedStageId
        ? { ...stage, deals: [...stage.deals, newDeal] }
        : stage
    ));
    
    setIsAddDealOpen(false);
    toast.success("Deal added successfully");
  };

  const handleEditDeal = (dealId: string, updatedDeal: Partial<Deal>) => {
    setPipeline(pipeline.map(stage => ({
      ...stage,
      deals: stage.deals.map(deal => 
        deal.id === dealId
          ? { ...deal, ...updatedDeal }
          : deal
      )
    })));
    
    toast.success("Deal updated successfully");
  };

  const handleDeleteDeal = (dealId: string) => {
    setPipeline(pipeline.map(stage => ({
      ...stage,
      deals: stage.deals.filter(deal => deal.id !== dealId)
    })));
    
    toast.success("Deal deleted successfully");
  };

  const handleAddStage = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Get form data
    const form = e.target as HTMLFormElement;
    const stageName = (form.querySelector('#stage-name') as HTMLInputElement).value;
    
    // Create new stage
    const newStage: Stage = {
      id: `stage-${Date.now()}`,
      name: stageName,
      deals: [],
    };
    
    // Add to pipeline
    setPipeline([...pipeline, newStage]);
    
    setIsAddStageOpen(false);
    toast.success("Stage added successfully");
  };

  return (
    <>
      <div className="w-full overflow-x-auto pb-6">
        <div className="flex gap-4 min-w-max p-1">
          {pipeline.map((stage) => (
            <div key={stage.id} className="w-[280px] bg-gray-50 rounded-lg p-4">
              <StageColumn 
                stage={stage} 
                onAddDeal={handleAddDealClick}
                onEditDeal={handleEditDeal}
                onDeleteDeal={handleDeleteDeal}
              />
            </div>
          ))}
          <div className="w-[280px] h-[200px] border border-dashed border-border rounded-lg flex items-center justify-center text-muted-foreground">
            <Button variant="ghost" onClick={() => setIsAddStageOpen(true)}>
              <Plus className="h-4 w-4 mr-2" /> Add Stage
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={isAddDealOpen} onOpenChange={setIsAddDealOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Add New Deal</DialogTitle>
            <DialogDescription>
              Enter the details for the new deal you want to add to your pipeline.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddDeal}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deal-name" className="text-right">
                  Deal Name
                </Label>
                <Input
                  id="deal-name"
                  placeholder="Enter deal name"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="company" className="text-right">
                  Company
                </Label>
                <Input
                  id="company"
                  placeholder="Enter company name"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="value" className="text-right">
                  Value ($)
                </Label>
                <Input
                  id="value"
                  type="number"
                  placeholder="Enter deal value"
                  className="col-span-3"
                  required
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="probability" className="text-right">
                  Probability (%)
                </Label>
                <Input
                  id="probability"
                  type="number"
                  min="0"
                  max="100"
                  placeholder="Enter probability"
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Deal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isAddStageOpen} onOpenChange={setIsAddStageOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Stage</DialogTitle>
            <DialogDescription>
              Create a new stage for your pipeline.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStage}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="stage-name" className="text-right">
                  Stage Name
                </Label>
                <Input
                  id="stage-name"
                  placeholder="Enter stage name"
                  className="col-span-3"
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Add Stage</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PipelineView;
