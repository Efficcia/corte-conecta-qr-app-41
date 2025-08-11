-- Create customers table
CREATE TABLE public.customers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT NOT NULL,
  birth_date DATE,
  unit TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (since this is a customer registration system)
CREATE POLICY "Anyone can insert customers" 
ON public.customers 
FOR INSERT 
TO anon
WITH CHECK (true);

CREATE POLICY "Anyone can view customers" 
ON public.customers 
FOR SELECT 
TO anon
USING (true);

CREATE POLICY "Anyone can update customers" 
ON public.customers 
FOR UPDATE 
TO anon
USING (true);

CREATE POLICY "Anyone can delete customers" 
ON public.customers 
FOR DELETE 
TO anon
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();