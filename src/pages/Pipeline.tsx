
import React, { useState } from "react";
import { PlusCircle, Filter, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";
import PipelineView from "@/components/pipeline/PipelineView";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const Pipeline = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAddDealOpen, setIsAddDealOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleAddDeal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddDealOpen(false);
    toast.success("New deal added successfully");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      <div 
        className={cn(
          "flex-1 transition-all duration-300 ease-smooth",
          sidebarCollapsed ? "ml-16" : "ml-64",
          isMobile && "ml-0"
        )}
      >
        <Header />
        
        <main className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-2xl font-semibold mb-1">Sales Pipeline</h1>
              <p className="text-muted-foreground">Manage and track your deals across stages</p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" /> Filter
              </Button>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="h-4 w-4 mr-2" /> Customize
              </Button>
              <Button size="sm" onClick={() => setIsAddDealOpen(true)}>
                <PlusCircle className="h-4 w-4 mr-2" /> Add Deal
              </Button>
            </div>
          </div>
          
          <div className="mb-6 p-4 bg-white rounded-lg border">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">TOTAL DEALS</h3>
                <p className="text-2xl font-semibold mt-1">96</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">TOTAL VALUE</h3>
                <p className="text-2xl font-semibold mt-1">$1.24M</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">AVG DEAL SIZE</h3>
                <p className="text-2xl font-semibold mt-1">$12.9K</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">WIN RATE</h3>
                <p className="text-2xl font-semibold mt-1">42%</p>
              </div>
            </div>
          </div>
          
          <PipelineView />
          
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
                    <Label htmlFor="stage" className="text-right">
                      Stage
                    </Label>
                    <Select defaultValue="lead">
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select stage" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lead">Lead</SelectItem>
                        <SelectItem value="qualified">Qualified</SelectItem>
                        <SelectItem value="proposal">Proposal</SelectItem>
                        <SelectItem value="negotiation">Negotiation</SelectItem>
                        <SelectItem value="closed">Closed Won</SelectItem>
                      </SelectContent>
                    </Select>
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
        </main>
      </div>
    </div>
  );
};

export default Pipeline;
