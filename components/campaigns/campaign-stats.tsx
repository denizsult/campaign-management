"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Campaign } from "@/lib/db/schema";
import { trpc } from "@/lib/trpc/client";
import { BarChart3, Calendar, DollarSign, TrendingUp } from "lucide-react";

const calculateStats = (campaigns?: Campaign[]) => {
  if (!campaigns) return { total: 0, active: 0, totalBudget: 0, avgBudget: 0 };

  return {
    total: campaigns.length,
    active: campaigns.filter((c) => {
      const now = new Date();
      const start = c.startDate ? new Date(c.startDate) : null;
      const end = c.endDate ? new Date(c.endDate) : null;
      return (!start || start <= now) && (!end || end >= now);
    }).length,
    totalBudget: campaigns.reduce(
      (sum: number, campaign: Campaign) => sum + (Number(campaign.budget) || 0),
      0
    ),
    avgBudget:
      campaigns.length > 0
        ? campaigns.reduce(
            (sum: number, campaign: Campaign) =>
              sum + (Number(campaign.budget) || 0),
            0
          ) / campaigns.length
        : 0,
  };
};

export function CampaignStats() {
  const { data: campaigns } = trpc.campaigns.getAll.useQuery();

  const stats = calculateStats(campaigns);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      <Card className="hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Campaigns</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">All time campaigns</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Active Campaigns
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.active}</div>
          <p className="text-xs text-muted-foreground">Currently running</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.totalBudget)}
          </div>
          <p className="text-xs text-muted-foreground">Across all campaigns</p>
        </CardContent>
      </Card>

      <Card className="hover:shadow-md transition-all duration-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Budget</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(stats.avgBudget)}
          </div>
          <p className="text-xs text-muted-foreground">Per campaign</p>
        </CardContent>
      </Card>
    </div>
  );
}
