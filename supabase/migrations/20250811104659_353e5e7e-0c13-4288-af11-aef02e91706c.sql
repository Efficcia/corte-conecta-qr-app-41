-- Create templates table for message dispatch
CREATE TABLE public.templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;

-- Create policies for templates
CREATE POLICY "Anyone can view templates" 
ON public.templates 
FOR SELECT 
USING (true);

CREATE POLICY "Anyone can create templates" 
ON public.templates 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update templates" 
ON public.templates 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete templates" 
ON public.templates 
FOR DELETE 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_templates_updated_at
BEFORE UPDATE ON public.templates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default templates
INSERT INTO public.templates (name, description, content) VALUES
('Boas-vindas', 'Mensagem de boas-vindas para novos clientes', 'Bem-vindo à Barbearia B&G! Estamos felizes em tê-lo como cliente.'),
('Aniversário', 'Mensagem de parabéns pelo aniversário', 'Parabéns pelo seu aniversário! Que tal um corte especial para comemorar?'),
('Promoção', 'Divulgação de promoções especiais', 'Promoção especial na Barbearia B&G! Não perca esta oportunidade.'),
('Lembrete', 'Lembrete de agendamento ou retorno', 'Lembramos que está na hora de agendar seu próximo corte na B&G.'),
('Newsletter', 'Informações gerais da barbearia', 'Novidades da Barbearia B&G! Confira as últimas atualizações.');