import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCustomers } from '@/contexts/CustomerContext';
import { Send, Users, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface DispatchTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
}

export const MessageDispatch: React.FC = () => {
  const { customers } = useCustomers();
  const { toast } = useToast();
  const [templates, setTemplates] = useState<DispatchTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [dispatchResults, setDispatchResults] = useState<{ success: number; total: number } | null>(null);
  const [showNewTemplate, setShowNewTemplate] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', description: '', content: '' });

  const webhookUrl = 'https://webhook.efficia.shop/webhook/abbc5da4-136b-4762-b5af-cdc5ff3c91c6';

  // Filtrar clientes por unidade
  const filteredCustomers = selectedUnit === 'all' 
    ? customers 
    : customers.filter(customer => customer.unit === selectedUnit);

  // Obter lista única de unidades
  const availableUnits = Array.from(new Set(customers.map(customer => customer.unit).filter(Boolean)));

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error('Erro ao buscar templates:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os templates.",
        variant: "destructive"
      });
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do template é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('templates')
        .insert([newTemplate]);

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Template criado com sucesso.",
      });

      setNewTemplate({ name: '', description: '', content: '' });
      setShowNewTemplate(false);
      fetchTemplates();
    } catch (error) {
      console.error('Erro ao criar template:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar o template.",
        variant: "destructive"
      });
    }
  };

  const handleDispatch = async () => {
    if (!selectedTemplate) {
      toast({
        title: "Erro",
        description: "Selecione um template antes de realizar o disparo.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    let successCount = 0;

    try {
      for (const customer of filteredCustomers) {
        try {
          const payload = {
            template: selectedTemplate,
            customer: {
              id: customer.id,
              name: customer.name,
              phone: customer.phone,
              email: customer.email,
              birth_date: customer.birth_date,
              unit: customer.unit
            },
            timestamp: new Date().toISOString(),
            source: 'barbershop-admin'
          };

          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            successCount++;
          }
        } catch (error) {
          console.error(`Erro ao enviar para ${customer.name}:`, error);
        }
      }

      setDispatchResults({
        success: successCount,
        total: filteredCustomers.length
      });

      toast({
        title: "Disparo realizado",
        description: `${successCount} de ${filteredCustomers.length} mensagens enviadas com sucesso.`,
        variant: successCount === filteredCustomers.length ? "default" : "destructive"
      });

    } catch (error) {
      console.error('Erro durante o disparo:', error);
      toast({
        title: "Erro no disparo",
        description: "Ocorreu um erro durante o envio das mensagens.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-barbershop-dark mb-2">Disparos de Mensagens</h1>
        <p className="text-muted-foreground">Envie mensagens para clientes por unidade</p>
      </div>

      {/* Card de Configuração do Disparo */}
      <Card className="shadow-xl border-0 bg-card">
        <CardHeader className="bg-gradient-dark text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold flex items-center space-x-2">
            <Send size={20} />
            <span>Configurar Disparo</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Selecione o Template</label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowNewTemplate(!showNewTemplate)}
                  className="text-xs"
                >
                  <Plus size={14} className="mr-1" />
                  Novo Template
                </Button>
              </div>
              
              {showNewTemplate && (
                <Card className="mb-4 p-4 bg-muted/20">
                  <div className="space-y-3">
                    <Input
                      placeholder="Nome do template"
                      value={newTemplate.name}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    />
                    <Input
                      placeholder="Descrição"
                      value={newTemplate.description}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <Textarea
                      placeholder="Conteúdo da mensagem"
                      value={newTemplate.content}
                      onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                      rows={3}
                    />
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleCreateTemplate}>
                        Criar Template
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowNewTemplate(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </Card>
              )}
              
              <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Escolha um template de mensagem" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  {templates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-muted-foreground">{template.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Selecione a Unidade</label>
              <Select value={selectedUnit} onValueChange={setSelectedUnit}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Escolha a unidade para o disparo" />
                </SelectTrigger>
                <SelectContent className="bg-white z-50">
                  <SelectItem value="all">
                    <div>
                      <div className="font-medium">Todas as Unidades</div>
                      <div className="text-sm text-muted-foreground">Enviar para todos os clientes</div>
                    </div>
                  </SelectItem>
                  {availableUnits.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      <div>
                        <div className="font-medium">{unit}</div>
                        <div className="text-sm text-muted-foreground">
                          {customers.filter(c => c.unit === unit).length} clientes
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Users size={16} className="text-barbershop-dark" />
                <span className="font-medium">Destinatários</span>
              </div>
              <p className="text-sm text-muted-foreground">
                O disparo será enviado para <strong>{filteredCustomers.length} clientes</strong> 
                {selectedUnit === 'all' ? ' de todas as unidades' : ` da unidade ${selectedUnit}`}.
              </p>
            </div>

            <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <AlertCircle size={16} className="text-amber-600" />
                <span className="font-medium text-amber-800">Importante</span>
              </div>
              <p className="text-sm text-amber-700">
                Certifique-se de que o template selecionado é apropriado para todos os clientes. 
                O disparo não pode ser desfeito após ser iniciado.
              </p>
            </div>
          </div>

          <Button 
            onClick={handleDispatch} 
            disabled={!selectedTemplate || isLoading || filteredCustomers.length === 0}
            className="w-full bg-barbershop-dark hover:bg-barbershop-dark-light text-white"
            size="lg"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Enviando...
              </>
            ) : (
              <>
                <Send size={16} className="mr-2" />
                Realizar Disparo
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Resultados do Último Disparo */}
      {dispatchResults && (
        <Card className="shadow-lg border-0 bg-card">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center space-x-2">
              <CheckCircle size={18} className="text-green-600" />
              <span>Resultado do Último Disparo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{dispatchResults.success}</div>
                <div className="text-sm text-green-700">Enviadas</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{dispatchResults.total - dispatchResults.success}</div>
                <div className="text-sm text-red-700">Falharam</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{dispatchResults.total}</div>
                <div className="text-sm text-blue-700">Total</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};