 
"use client"
import { RenderIf } from "@/components/ui/render-if"
import { trpc } from "@/lib/trpc/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AddInfluencerForm } from "@/components/influencers/add-influencer-form"
import { InfluencerList } from "@/components/influencers/influencer-list"


export default function InfluencersPage() {
  const { data: influencers = [] } = trpc.influencers.getAll.useQuery()

  return (
    <div className="container mx-auto py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Influencers</CardTitle>
          <RenderIf condition={influencers.length > 0}>
            <AddInfluencerForm />
          </RenderIf>
        </CardHeader>
        <CardContent>
          <InfluencerList influencers={influencers} />
        </CardContent>
      </Card>
    </div>
  )
}
