"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { trpc } from "@/lib/trpc/client"
import { Plus, Loader2 } from "lucide-react"

interface CampaignFormProps {
  campaign?: {
    id: string
    title: string
    description?: string
    budget?: number
    start_date?: string
    end_date?: string
  }
  onSuccess?: () => void
}

export function CampaignForm({ campaign, onSuccess }: CampaignFormProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: campaign?.title || "",
    description: campaign?.description || "",
    budget: campaign?.budget?.toString() || "",
    startDate: campaign?.start_date || "",
    endDate: campaign?.end_date || "",
  })

  const utils = trpc.useUtils()
  const createMutation = trpc.campaigns.create.useMutation({
    onSuccess: () => {
      utils.campaigns.getAll.invalidate()
      setOpen(false)
      onSuccess?.()
      setFormData({ title: "", description: "", budget: "", startDate: "", endDate: "" })
    },
  })

  const updateMutation = trpc.campaigns.update.useMutation({
    onSuccess: () => {
      utils.campaigns.getAll.invalidate()
      setOpen(false)
      onSuccess?.()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const data = {
      title: formData.title,
      description: formData.description || undefined,
      budget: formData.budget ? Number.parseFloat(formData.budget) : undefined,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
    }

    if (campaign) {
      updateMutation.mutate({ id: campaign.id, ...data })
    } else {
      createMutation.mutate(data)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {campaign ? (
          <Button variant="outline" size="sm">
            Edit
          </Button>
        ) : (
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" />
            Create Campaign
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {campaign ? "Edit Campaign" : "Create New Campaign"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Campaign Name</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter campaign name"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Enter campaign description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget ($)</Label>
            <Input
              id="budget"
              type="number"
              step="0.01"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
              placeholder="0.00"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {campaign ? "Update" : "Create"} Campaign
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
