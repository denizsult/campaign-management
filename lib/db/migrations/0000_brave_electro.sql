CREATE TABLE "campaign_influencers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"campaign_id" uuid NOT NULL,
	"influencer_id" uuid NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "campaign_influencers_campaign_id_influencer_id_unique" UNIQUE("campaign_id","influencer_id")
);
--> statement-breakpoint
CREATE TABLE "campaigns" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"budget" numeric(10, 2),
	"start_date" date,
	"end_date" date,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "influencers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"follower_count" integer DEFAULT 0 NOT NULL,
	"engagement_rate" numeric(5, 2) DEFAULT '0.00' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "campaign_influencers" ADD CONSTRAINT "campaign_influencers_campaign_id_campaigns_id_fk" FOREIGN KEY ("campaign_id") REFERENCES "public"."campaigns"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "campaign_influencers" ADD CONSTRAINT "campaign_influencers_influencer_id_influencers_id_fk" FOREIGN KEY ("influencer_id") REFERENCES "public"."influencers"("id") ON DELETE cascade ON UPDATE no action;