import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AssignedInfluencers } from "@/components/influencers/assigned-influencers"
import { InfluencerAssignmentModal } from "@/components/influencers/influencer-assignment-modal"
import { PageHeader } from "@/components/layout/page-header"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

interface CampaignDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function CampaignDetailPage({ params }: CampaignDetailPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  // Get campaign details
  const { data: campaign } = await supabase
    .from("campaigns")
    .select("*")
    .eq("id", id)
    .eq("user_id", data.user.id)
    .single()

  if (!campaign) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader title={campaign.title} description="Campaign Details" />

      <main className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Button variant="ghost" size="sm" asChild className="self-start">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <h2 className="text-xl font-semibold">Influencer Management</h2>
            <InfluencerAssignmentModal campaignId={campaign.id} campaignTitle={campaign.title} />
          </div>
        </div>

        <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
          <AssignedInfluencers campaignId={campaign.id} />
        </div>
      </main>
    </div>
  )
}
