import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { CampaignStats } from "@/components/campaigns/campaign-stats"
import { CampaignList } from "@/components/campaigns/campaign-list"
import { PageHeader } from "@/components/layout/page-header"

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  if (error || !data?.user) {
    redirect("/auth/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <PageHeader
        title="Campaign Manager"
        description={`Welcome back, ${data.user.email}`}
        userEmail={data.user.email}
      />

      <main className="container mx-auto px-4 py-6 md:py-8 space-y-6 md:space-y-8">
        <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
          <CampaignStats />
        </div>

        <div className="animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-200">
          <CampaignList />
        </div>
      </main>
    </div>
  )
}
