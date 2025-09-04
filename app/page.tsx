import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Users, TrendingUp } from "lucide-react"

export default async function HomePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is logged in, redirect to dashboard
  if (user) {
    redirect("/dashboard")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground text-balance">Campaign Manager</h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Streamline your marketing campaigns and manage influencer partnerships with our comprehensive platform
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-200">
          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Campaign Management</h3>
              <p className="text-sm text-muted-foreground">
                Create, track, and optimize your marketing campaigns with powerful analytics
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mx-auto">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold">Influencer Network</h3>
              <p className="text-sm text-muted-foreground">
                Connect with top influencers and manage partnerships seamlessly
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all duration-200">
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mx-auto">
                <TrendingUp className="w-6 h-6 text-chart-3" />
              </div>
              <h3 className="text-lg font-semibold">Performance Insights</h3>
              <p className="text-sm text-muted-foreground">
                Get detailed analytics and insights to maximize your campaign ROI
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="text-center space-y-4 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-400">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
              <Link href="/auth/sign-up">Get Started Free</Link>
            </Button>

            <Button asChild variant="outline" size="lg" className="bg-transparent">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">Join thousands of marketers already using Campaign Manager</p>
        </div>
      </div>
    </div>
  )
}
