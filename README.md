# Campaign Management Mini-App

A full-stack web application built with Next.js, tRPC, Supabase, and Drizzle ORM for managing campaigns and influencer assignments.

## 🚀 Tech Stack

- **Frontend**: React 18, Next.js 15, TypeScript
- **Backend**: tRPC, Node.js
- **Database**: Supabase PostgreSQL
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth
- **UI**: Tailwind CSS, Radix UI components
- **State Management**: TanStack Query (React Query)

## 📋 Features

- ✅ **Authentication**: Sign up, login with Supabase Auth
- ✅ **Campaign Management**: Create, read, update, delete campaigns
- ✅ **Influencer Management**: View and manage influencers
- ✅ **Assignment System**: Assign/unassign influencers to campaigns
- ✅ **User Isolation**: Users can only see their own campaigns
- ✅ **Responsive Design**: Works on all device sizes

## 🗄️ Database Schema

The application uses Drizzle ORM with the following schema:

### Tables

1. **campaigns**
   - `id` (UUID, Primary Key)
   - `title` (Text, Required)
   - `description` (Text, Optional)
   - `budget` (Decimal)
   - `start_date` (Date)
   - `end_date` (Date)
   - `user_id` (UUID, Foreign Key to auth.users)
   - `created_at`, `updated_at` (Timestamps)

2. **influencers**
   - `id` (UUID, Primary Key)
   - `name` (Text, Required)
   - `follower_count` (Integer)
   - `engagement_rate` (Decimal)
   - `created_at`, `updated_at` (Timestamps)

3. **campaign_influencers** (Junction Table)
   - `id` (UUID, Primary Key)
   - `campaign_id` (UUID, Foreign Key)
   - `influencer_id` (UUID, Foreign Key)
   - `assigned_at` (Timestamp)
   - Unique constraint on (campaign_id, influencer_id)

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm/pnpm
- Supabase account and project

### 1. Clone and Install

```bash
git clone <repository-url>
cd campaign-management
npm install
```

### 2. Environment Variables

Create a `.env.local` file:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Database URL for Drizzle (from Supabase Settings > Database)
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### 3. Supabase Database Setup

#### Get Your Supabase Database URL
1. Go to your Supabase project dashboard
2. Navigate to **Settings > Database**
3. Copy the **Connection string** (URI format)
4. Replace `[YOUR-PASSWORD]` with your database password
5. Add it to your `.env.local` as `DATABASE_URL`

#### Apply Database Schema
Choose one of these methods:

**Option 1: Direct Push (Recommended for development)**
```bash
# Push schema directly to Supabase
npm run db:push
```

**Option 2: Generate and Run Migrations**
```bash
# Generate migration files
npm run db:generate

# Apply migrations to Supabase
npm run db:migrate
```

**Option 3: Database Explorer**
```bash
# Open Drizzle Studio to explore your Supabase database
npm run db:studio
```

### 4. Supabase Configuration

#### Enable Row Level Security (RLS)

The application relies on Supabase RLS for data security. Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable RLS on all tables
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaign_influencers ENABLE ROW LEVEL SECURITY;

-- Campaigns policies
CREATE POLICY "campaigns_select_own" ON public.campaigns FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "campaigns_insert_own" ON public.campaigns FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "campaigns_update_own" ON public.campaigns FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "campaigns_delete_own" ON public.campaigns FOR DELETE USING (auth.uid() = user_id);

-- Influencers policies (read-only for all authenticated users)
CREATE POLICY "influencers_select_authenticated" ON public.influencers FOR SELECT TO authenticated USING (true);

-- Campaign influencers policies
CREATE POLICY "campaign_influencers_select_own" ON public.campaign_influencers FOR SELECT 
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE campaigns.id = campaign_influencers.campaign_id AND campaigns.user_id = auth.uid()));

CREATE POLICY "campaign_influencers_insert_own" ON public.campaign_influencers FOR INSERT 
  WITH CHECK (EXISTS (SELECT 1 FROM public.campaigns WHERE campaigns.id = campaign_influencers.campaign_id AND campaigns.user_id = auth.uid()));

CREATE POLICY "campaign_influencers_delete_own" ON public.campaign_influencers FOR DELETE 
  USING (EXISTS (SELECT 1 FROM public.campaigns WHERE campaigns.id = campaign_influencers.campaign_id AND campaigns.user_id = auth.uid()));
```

### 5. Run the Application

```bash
# Development
npm run dev

# Production build
npm run build
npm start
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate migration files from schema
- `npm run db:migrate` - Apply migrations to Supabase database
- `npm run db:push` - Push schema changes directly to database
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:introspect` - Generate schema from existing database

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/trpc/          # tRPC API routes
│   ├── auth/              # Authentication pages
│   ├── campaigns/         # Campaign pages
│   └── dashboard/         # Dashboard page
├── components/            # React components
│   ├── campaigns/         # Campaign-related components
│   ├── influencers/       # Influencer-related components
│   ├── layout/            # Layout components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── db/                # Drizzle ORM setup
│   │   ├── schema/        # Database schema definitions
│   │   └── index.ts       # Database connection
│   ├── supabase/          # Supabase client setup
│   └── trpc/              # tRPC setup and routers
└── scripts/               # Legacy SQL scripts (reference)
```

## 🗄️ Schema-Based Database Management

This project uses Drizzle's **schema-first approach** instead of traditional migrations:

### How It Works
1. **Define schemas** in TypeScript files (`lib/db/schema/`)
2. **Push changes** directly to database with `npm run db:push`
3. **No migration files** - schema is the single source of truth
4. **Type safety** - automatic TypeScript types from schema

### Development Workflow
```bash
# 1. Modify schema files (e.g., add a new column)
# 2. Push changes to database
npm run db:push

# 3. Drizzle automatically:
#    - Compares your schema with database
#    - Applies necessary changes
#    - Updates TypeScript types
```

### Benefits
- ✅ **Supabase Integration** - Works seamlessly with Supabase PostgreSQL
- ✅ **Type safety** - Schema changes automatically update types
- ✅ **Flexible workflow** - Choose between push or migrations
- ✅ **RLS Support** - Compatible with Supabase Row Level Security
- ✅ **Version control** - Schema files are tracked in git

### Supabase + Drizzle Workflow

#### For Development (Quick Iteration)
```bash
# 1. Modify schema files
# 2. Push directly to Supabase
npm run db:push
```

#### For Production (Controlled Migrations)
```bash
# 1. Modify schema files
# 2. Generate migration
npm run db:generate

# 3. Review migration file
# 4. Apply to production Supabase
npm run db:migrate
```

## 🔐 Authentication Flow

1. Users sign up/login via Supabase Auth
2. JWT tokens are automatically managed by Supabase
3. tRPC middleware validates authentication
4. RLS policies ensure data isolation

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production

Ensure all environment variables are set in your deployment platform:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.