# Setup Instructions
# Portfolio website deployed on Vercel

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your URL and keys
3. Add the environment variables above
4. Run the SQL setup script in Supabase SQL Editor to create required tables

## Database Tables

Run this SQL in your Supabase SQL Editor:

```sql
-- Contact submissions table
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert contact submissions
CREATE POLICY "Anyone can insert contact submissions" 
ON contact_submissions FOR INSERT 
WITH CHECK (true);

-- Allow authenticated users to view submissions
CREATE POLICY "Authenticated users can view submissions" 
ON contact_submissions FOR SELECT 
TO authenticated 
USING (true);

-- Photos table for the photography vault
CREATE TABLE photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  client TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view photos" 
ON photos FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage photos" 
ON photos FOR ALL 
TO authenticated 
USING (true);

-- Career timeline table
CREATE TABLE career_timeline (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  start_date TEXT NOT NULL,
  end_date TEXT,
  description TEXT[],
  current_position BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE career_timeline ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view career timeline" 
ON career_timeline FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage career timeline" 
ON career_timeline FOR ALL 
TO authenticated 
USING (true);
```

## Development

```bash
npm run dev
```

The application will be available at `http://localhost:3000`