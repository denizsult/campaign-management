import { type Influencer } from "@/lib/db/schema/influencers"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RenderIf } from "@/components/ui/render-if"
import { AddInfluencerForm } from "./add-influencer-form"

interface InfluencerListProps {
  influencers: Influencer[]
}

export function InfluencerList({ influencers }: InfluencerListProps) {
  return (
    <>
      <RenderIf condition={influencers.length === 0}>
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <p className="text-muted-foreground text-center">
            No influencers found yet. Add your first influencer to get started!
          </p>
          <AddInfluencerForm />
        </div>
      </RenderIf>

      <RenderIf condition={influencers.length > 0}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Followers</TableHead>
              <TableHead className="text-right">Engagement Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {influencers.map((influencer) => (
              <TableRow key={influencer.id}>
                <TableCell>{influencer.name}</TableCell>
                <TableCell className="text-right">
                  {new Intl.NumberFormat().format(influencer.followerCount)}
                </TableCell>
                <TableCell className="text-right">
                  {Number(influencer.engagementRate).toFixed(2)}%
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </RenderIf>
    </>
  )
}
