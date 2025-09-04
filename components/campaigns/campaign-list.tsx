"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { trpc } from "@/lib/trpc/client"
import { CampaignForm } from "./campaign-form"
import { InfluencerAssignmentModal } from "../influencers/influencer-assignment-modal"
import { Trash2, Calendar, DollarSign, Users, Loader2, MoreVertical } from "lucide-react"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function CampaignList() {
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const { data: campaigns, isLoading } = trpc.campaigns.getAll.useQuery()
  const utils = trpc.useUtils()

  const deleteMutation = trpc.campaigns.delete.useMutation({
    onSuccess: () => {
      utils.campaigns.getAll.invalidate()
      setDeletingId(null)
    },
  })

  const handleDelete = (id: string) => {
    setDeletingId(id)
    deleteMutation.mutate({ id })
  }

  const formatCurrency = (amount?: number) => {
    if (!amount) return "Not set"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not set"
    return format(new Date(dateString), "MMM dd, yyyy")
  }

  const getCampaignStatus = (startDate?: string, endDate?: string) => {
    const now = new Date()
    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate) : null

    if (end && end < now) return { label: "Completed", variant: "secondary" as const }
    if (start && start > now) return { label: "Scheduled", variant: "outline" as const }
    return { label: "Active", variant: "default" as const }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">My Campaigns</h2>
          <p className="text-muted-foreground">Manage your marketing campaigns</p>
        </div>
        <CampaignForm />
      </div>

      {campaigns?.length === 0 ? (
        <Card className="animate-in fade-in-50 duration-500">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">No campaigns yet</h3>
              <p className="text-muted-foreground">Create your first campaign to get started</p>
              <div className="pt-4">
                <CampaignForm />
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {campaigns?.map((campaign, index) => {
            const status = getCampaignStatus(campaign.start_date, campaign.end_date)
            return (
              <Card
                key={campaign.id}
                className="hover:shadow-lg transition-all duration-200 animate-in fade-in-50 slide-in-from-bottom-4"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-lg font-semibold text-balance pr-2">{campaign.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={status.variant}>{status.label}</Badge>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 md:hidden">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <div className="w-full">
                              <InfluencerAssignmentModal campaignId={campaign.id} campaignTitle={campaign.title} />
                            </div>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild>
                            <div className="w-full">
                              <CampaignForm campaign={campaign} />
                            </div>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {campaign.description && (
                    <p className="text-sm text-muted-foreground text-pretty line-clamp-2">{campaign.description}</p>
                  )}
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Budget:</span>
                      </div>
                      <span className="font-medium">{formatCurrency(campaign.budget)}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Start:</span>
                      </div>
                      <span className="font-medium">{formatDate(campaign.start_date)}</span>
                    </div>

                    <div className="flex items-center justify-between sm:col-span-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">End:</span>
                      </div>
                      <span className="font-medium">{formatDate(campaign.end_date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>Influencers</span>
                    </div>
                    <div className="hidden md:flex items-center gap-2">
                      <InfluencerAssignmentModal campaignId={campaign.id} campaignTitle={campaign.title} />
                      <CampaignForm campaign={campaign} />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={deletingId === campaign.id}>
                            {deletingId === campaign.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{campaign.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(campaign.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                    <div className="md:hidden">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm" disabled={deletingId === campaign.id}>
                            {deletingId === campaign.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{campaign.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(campaign.id)}
                              className="bg-destructive hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
