
-- Create the investments table to store user investment data
CREATE TABLE IF NOT EXISTS public.investments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users NOT NULL,
  eth_amount NUMERIC(20, 8) NOT NULL,
  eur_value NUMERIC(20, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies to restrict access
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own investments
CREATE POLICY "Users can view their own investments"
  ON public.investments
  FOR SELECT
  USING (auth.uid() = user_id);

-- Allow users to insert their own investments
CREATE POLICY "Users can insert their own investments"
  ON public.investments
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Add index for faster queries on user_id
CREATE INDEX IF NOT EXISTS investments_user_id_idx ON public.investments (user_id);

-- Create function to update timestamp on row update
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update timestamp automatically
CREATE TRIGGER update_investments_modtime
BEFORE UPDATE ON public.investments
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
