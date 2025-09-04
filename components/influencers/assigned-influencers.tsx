"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { trpc } from "@/lib/trpc/client"
import { Users, TrendingUp, Loader2 } from "lucide-react"

interface AssignedInfluencersProps {
  campaignId: string
}

export function AssignedInfluencers({ campaignId }: AssignedInfluencersProps) {
  const { data: assignedInfluencers, isLoading } = trpc.influencers.getByCampaign.useQuery({
    campaignId,
  })

  const formatFollowers = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`
    }
    return count.toString()
  }

  const getEngagementColor = (rate: number) => {
    if (rate >= 6) return "bg-green-100 text-green-800"
    if (rate >= 3) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="w-5 h-5 animate-spin" />
        </CardContent>
      </Card>
    )
  }

  if (!assignedInfluencers || assignedInfluencers.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Assigned Influencers</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-center py-4">No influencers assigned to this campaign yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Assigned Influencers ({assignedInfluencers.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {assignedInfluencers.map((influencer) => (
            <div key={influencer.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium">{influencer.name}</h4>
                <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {formatFollowers(influencer.follower_count)}
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    <Badge variant="outline" className={getEngagementColor(influencer.engagement_rate)}>
                      {influencer.engagement_rate}%
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
