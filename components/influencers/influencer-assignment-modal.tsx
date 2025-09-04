"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc/client";
import { InfluencerCard } from "./influencer-card";
import { Users, Search, Loader2, UserPlus } from "lucide-react";
import { RenderIf } from "@/components/ui/render-if";
import { AddInfluencerForm } from "./add-influencer-form";

interface InfluencerAssignmentModalProps {
  campaignId: string;
  campaignTitle: string;
}

export function InfluencerAssignmentModal({
  campaignId,
  campaignTitle,
}: InfluencerAssignmentModalProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [assigningId, setAssigningId] = useState<string | null>(null);
  const [unassigningId, setUnassigningId] = useState<string | null>(null);

  const { data: allInfluencers, isLoading: loadingInfluencers } =
    trpc.influencers.getAll.useQuery();
  const { data: assignedInfluencers, isLoading: loadingAssigned } =
    trpc.influencers.getByCampaign.useQuery({
      campaignId,
    });

  const utils = trpc.useUtils();

  const assignMutation = trpc.assignments.assign.useMutation({
    onSuccess: () => {
      utils.influencers.getByCampaign.invalidate({ campaignId });
      utils.campaigns.getAll.invalidate();
      setAssigningId(null);
    },
    onError: () => {
      setAssigningId(null);
    },
  });

  const unassignMutation = trpc.assignments.unassign.useMutation({
    onSuccess: () => {
      utils.influencers.getByCampaign.invalidate({ campaignId });
      utils.campaigns.getAll.invalidate();
      setUnassigningId(null);
    },
    onError: () => {
      setUnassigningId(null);
    },
  });

  const handleAssign = (influencerId: string) => {
    setAssigningId(influencerId);
    assignMutation.mutate({ campaignId, influencerId });
  };

  const handleUnassign = (influencerId: string) => {
    setUnassigningId(influencerId);
    unassignMutation.mutate({ campaignId, influencerId });
  };

  const assignedIds = new Set(assignedInfluencers?.map((inf) => inf.id) || []);

  const filteredInfluencers = allInfluencers?.filter((influencer) =>
    influencer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm" className="w-full sm:w-auto">
          <Users className="w-4 h-4 mr-2" />
          <span className="hidden sm:inline">Manage Influencers</span>
          <span className="sm:hidden">Influencers</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90vw] lg:max-w-[800px] max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-balance">
            Manage Influencers - {campaignTitle}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search influencers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <RenderIf condition={loadingInfluencers || loadingAssigned}>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          </RenderIf>

          <RenderIf condition={!loadingInfluencers && !loadingAssigned}>
            <div className="flex-1 overflow-y-auto">
              <RenderIf condition={!allInfluencers?.length}>
                <div className="flex flex-col items-center justify-center py-12 space-y-4">
                  <UserPlus className="w-12 h-12 text-muted-foreground" />
                  <p className="text-muted-foreground text-center">
                    No influencers found. Add your first influencer to get
                    started!
                  </p>
                  <AddInfluencerForm />
                </div>
              </RenderIf>

              <RenderIf condition={!!allInfluencers?.length}>
                <div className="grid gap-4 sm:grid-cols-2">
                  {filteredInfluencers?.map((influencer, index) => {
                    const isAssigned = assignedIds.has(influencer.id);
                    const isLoading =
                      assigningId === influencer.id ||
                      unassigningId === influencer.id;

                    return (
                      <div
                        key={influencer.id}
                        className="animate-in fade-in-50 slide-in-from-bottom-2"
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <InfluencerCard
                          influencer={influencer}
                          isAssigned={isAssigned}
                          onAssign={() => handleAssign(influencer.id)}
                          onUnassign={() => handleUnassign(influencer.id)}
                          isLoading={isLoading}
                        />
                      </div>
                    );
                  })}
                </div>

                <RenderIf
                  condition={!!searchTerm && filteredInfluencers?.length === 0}
                >
                  <div className="text-center py-8 space-y-4">
                    <p className="text-muted-foreground">
                      No influencers found matching your searc
                    </p>
                    <AddInfluencerForm />
                  </div>
                </RenderIf>
              </RenderIf>
            </div>
          </RenderIf>
        </div>
      </DialogContent>
    </Dialog>
  );
}
