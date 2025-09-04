"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, TrendingUp, UserPlus, UserMinus } from "lucide-react"

interface InfluencerCardProps {
  influencer: {
    id: string
    name: string
    follower_count: number
    engagement_rate: number
  }
  isAssigned?: boolean
  onAssign?: () => void
  onUnassign?: () => void
  isLoading?: boolean
}

export function InfluencerCard({ influencer, isAssigned, onAssign, onUnassign, isLoading }: InfluencerCardProps) {
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

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold text-balance">{influencer.name}</CardTitle>
          {isAssigned && <Badge variant="secondary">Assigned</Badge>}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Followers:</span>
          </div>
          <span className="font-medium">{formatFollowers(influencer.follower_count)}</span>

          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Engagement:</span>
          </div>
          <Badge variant="outline" className={getEngagementColor(influencer.engagement_rate)}>
            {influencer.engagement_rate}%
          </Badge>
        </div>

        <div className="pt-2 border-t">
          {isAssigned ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onUnassign}
              disabled={isLoading}
              className="w-full text-destructive hover:text-destructive bg-transparent"
            >
              <UserMinus className="w-4 h-4 mr-2" />
              Remove from Campaign
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onAssign}
              disabled={isLoading}
              className="w-full bg-transparent"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Assign to Campaign
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
