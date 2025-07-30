
import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, GripVertical } from "lucide-react";
import TableStatusBadge from "./TableStatusBadge";

interface ProposalKanbanViewProps {
  proposals: any[];
  selectedRows: Set<string>;
  onRowSelect: (id: string, checked: boolean) => void;
  onCompanySelect: (company: string) => void;
  selectedCompany: string;
}

interface KanbanCardProps {
  proposal: any;
  selectedRows: Set<string>;
  onRowSelect: (id: string, checked: boolean) => void;
  onCompanySelect: (company: string) => void;
  selectedCompany: string;
  isDragOverlay?: boolean;
}

const KanbanCard: React.FC<KanbanCardProps> = ({
  proposal,
  selectedRows,
  onRowSelect,
  onCompanySelect,
  selectedCompany,
  isDragOverlay = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: proposal.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getRepColor = (repName: string) => {
    if (!repName) return "bg-gray-500";
    
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", "bg-yellow-500",
      "bg-purple-500", "bg-pink-500", "bg-indigo-500", "bg-teal-500",
      "bg-orange-500", "bg-cyan-500", "bg-lime-500", "bg-rose-500"
    ];
    
    const colorIndex = repName.charCodeAt(0) % colors.length;
    return colors[colorIndex];
  };

  const handleEditClick = (proposalId: string) => {
    // Edit proposal functionality
  };

  const handleCompanyClick = (e: React.MouseEvent, company: string) => {
    e.preventDefault();
    e.stopPropagation();
    onCompanySelect?.(company);
  };

  return (
    <Card 
      ref={setNodeRef} 
      style={style}
      className={`hover:shadow-md transition-all bg-white cursor-pointer ${isDragOverlay ? 'shadow-2xl scale-105' : ''} ${isDragging ? 'shadow-lg' : ''}`}
      {...attributes}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedRows.has(proposal.id.toString())}
              onCheckedChange={(checked) => onRowSelect(proposal.id.toString(), !!checked)}
            />
            <button 
              onClick={() => handleEditClick(proposal.id.toString())}
              className="hover:bg-gray-100 p-1 rounded"
            >
              <Pencil className="h-4 w-4 text-yellow-500 hover:text-yellow-600" />
            </button>
            <div 
              {...listeners}
              className="hover:bg-gray-100 p-1 rounded cursor-grab active:cursor-grabbing"
            >
              <GripVertical className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <TableStatusBadge status={proposal.status} />
        </div>
        <CardTitle className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
          {proposal.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        <div>
          <span className="text-xs text-gray-500">Company:</span>
          <div 
            className={`text-sm font-medium cursor-pointer hover:text-blue-600 ${
              selectedCompany === proposal.company ? 'font-bold text-blue-600' : ''
            }`}
            onClick={(e) => handleCompanyClick(e, proposal.company)}
          >
            {proposal.company}
          </div>
        </div>
        
        <div>
          <span className="text-xs text-gray-500">Amount:</span>
          <div className="text-sm font-medium">
            {typeof proposal.amount === 'number' ? `$${proposal.amount.toLocaleString()}.00` : proposal.amount}
          </div>
        </div>
        
        <div>
          <span className="text-xs text-gray-500">Created:</span>
          <div className="text-xs">{proposal.createdDate}</div>
        </div>
        
        <div>
          <span className="text-xs text-gray-500">Assigned Rep:</span>
          <div className="flex items-center gap-2 mt-1">
            <div className={`w-5 h-5 ${getRepColor(proposal.assignedRep)} rounded-full flex items-center justify-center text-white text-xs font-medium`}>
              {proposal.assignedRep?.substring(0, 2)?.toUpperCase() || 'CK'}
            </div>
            <span className="text-xs">{proposal.assignedRep}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const ProposalKanbanView: React.FC<ProposalKanbanViewProps> = ({
  proposals,
  selectedRows,
  onRowSelect,
  onCompanySelect,
  selectedCompany
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const [localProposals, setLocalProposals] = useState(proposals);

  // Update local state when props change
  React.useEffect(() => {
    setLocalProposals(proposals);
  }, [proposals]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const stages = ['Proposal', 'Negotiation', 'Closed Won', 'Closed Lost'];
  
  const proposalsByStage = stages.reduce((acc, stage) => {
    acc[stage] = localProposals.filter(proposal => proposal.stage === stage);
    return acc;
  }, {} as Record<string, any[]>);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Proposal':
        return 'border-blue-200 bg-blue-50';
      case 'Negotiation':
        return 'border-yellow-200 bg-yellow-50';
      case 'Closed Won':
        return 'border-green-200 bg-green-50';
      case 'Closed Lost':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    // Check if we're dropping on a different stage
    const activeProposal = localProposals.find(p => p.id.toString() === activeId);
    if (!activeProposal) return;

    const overStage = stages.find(stage => stage === overId) || 
                     localProposals.find(p => p.id.toString() === overId)?.stage;

    if (overStage && activeProposal.stage !== overStage) {
      setLocalProposals(prev => 
        prev.map(proposal => 
          proposal.id.toString() === activeId 
            ? { ...proposal, stage: overStage }
            : proposal
        )
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveId(null);

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const activeProposal = localProposals.find(p => p.id.toString() === activeId);
    if (!activeProposal) return;

    // Handle reordering within the same stage
    if (activeId !== overId) {
      const activeStage = activeProposal.stage;
      const stageProposals = proposalsByStage[activeStage];
      
      const oldIndex = stageProposals.findIndex(p => p.id.toString() === activeId);
      const newIndex = stageProposals.findIndex(p => p.id.toString() === overId);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(stageProposals, oldIndex, newIndex);
        
        setLocalProposals(prev => {
          const otherProposals = prev.filter(p => p.stage !== activeStage);
          return [...otherProposals, ...newOrder];
        });
      }
    }

    // Proposal moved to new stage
  };

  const activeProposal = activeId ? localProposals.find(p => p.id.toString() === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage) => (
            <div key={stage} className={`border-2 rounded-lg p-4 min-h-[500px] ${getStageColor(stage)}`}>
              <div className="mb-4">
                <h3 className="font-semibold text-lg text-gray-800">{stage}</h3>
                <p className="text-sm text-gray-600">{proposalsByStage[stage].length} proposals</p>
              </div>
              
              <SortableContext 
                items={proposalsByStage[stage].map(p => p.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  {proposalsByStage[stage].map((proposal) => (
                    <KanbanCard
                      key={proposal.id}
                      proposal={proposal}
                      selectedRows={selectedRows}
                      onRowSelect={onRowSelect}
                      onCompanySelect={onCompanySelect}
                      selectedCompany={selectedCompany}
                    />
                  ))}
                  
                  {proposalsByStage[stage].length === 0 && (
                    <div className="text-center text-gray-500 text-sm py-8 border-2 border-dashed border-gray-300 rounded-lg">
                      Drop proposals here
                    </div>
                  )}
                </div>
              </SortableContext>
            </div>
          ))}
        </div>
      </div>

      <DragOverlay>
        {activeProposal ? (
          <KanbanCard
            proposal={activeProposal}
            selectedRows={selectedRows}
            onRowSelect={onRowSelect}
            onCompanySelect={onCompanySelect}
            selectedCompany={selectedCompany}
            isDragOverlay={true}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default ProposalKanbanView;
