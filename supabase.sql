-- Users table definition
CREATE TABLE IF NOT EXISTS public.users (
  uid UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  display_name TEXT,
  photo_url TEXT
);

-- Enable RLS for users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own profile" ON public.users FOR SELECT USING (auth.uid() = uid);
CREATE POLICY "Admins can read all profiles" ON public.users FOR SELECT USING (EXISTS (SELECT 1 FROM public.users WHERE uid = auth.uid() AND role IN ('admin', 'staff')));
CREATE POLICY "Users can insert their own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = uid);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = uid);

-- Shipments table definition
CREATE TABLE IF NOT EXISTS public.shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_number TEXT UNIQUE NOT NULL,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_name TEXT NOT NULL,
  receiver_email TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT NOT NULL CHECK(status IN ('Active', 'On Hold', 'Out for Delivery', 'Delivered', 'Cancelled')),
  current_location JSONB NOT NULL,
  history JSONB NOT NULL DEFAULT '[]',
  estimated_delivery TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Turn on Realtime for shipments
alter publication supabase_realtime add table shipments;

-- Enable RLS for shipments
ALTER TABLE public.shipments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Everyone can read shipments by tracking" ON public.shipments FOR SELECT USING (true);
CREATE POLICY "Staff can do everything" ON public.shipments FOR ALL USING (
  EXISTS (SELECT 1 FROM public.users WHERE uid = auth.uid() AND role IN ('admin', 'staff'))
);

-- Set up a function and trigger to handle auth user creation
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (uid, email, role, display_name)
  VALUES (
    new.id, 
    new.email, 
    'customer',
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
