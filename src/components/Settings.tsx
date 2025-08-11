
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCustomers } from '@/contexts/CustomerContext';
import { useToast } from '@/hooks/use-toast';
import { Settings as SettingsIcon, Webhook, Trash2, Download, Upload } from 'lucide-react';

export const Settings: React.FC = () => {
  const { customers, n8nWebhookUrl, setN8nWebhookUrl } = useCustomers();
  const [webhookInput, setWebhookInput] = useState(n8nWebhookUrl);
  const { toast } = useToast();

  const handleSaveWebhook = () => {
    setN8nWebhookUrl(webhookInput);
    toast({
      title: "Sucesso",
      description: "URL do webhook N8N salva com sucesso!",
    });
  };

  const handleExportData = () => {
    const dataStr = JSON.stringify(customers, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `clientes-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Sucesso",
      description: "Dados exportados com sucesso!",
    });
  };

  const handleClearData = () => {
    if (window.confirm('Tem certeza que deseja apagar todos os dados? Esta ação não pode ser desfeita.')) {
      localStorage.removeItem('barbershop-customers');
      window.location.reload();
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-barbershop-dark mb-2">Configurações</h1>
        <p className="text-gray-600">Gerencie as configurações do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Configurações do N8N */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-blue text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center space-x-2">
              <Webhook size={20} />
              <span>Integração N8N</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="webhook-url" className="text-sm font-medium text-barbershop-dark">
                URL do Webhook N8N
              </Label>
              <Input
                id="webhook-url"
                value={webhookInput}
                onChange={(e) => setWebhookInput(e.target.value)}
                placeholder="https://seu-n8n.com/webhook/..."
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Configure seu webhook do N8N para receber notificações de novos cadastros
              </p>
            </div>
            
            <Button 
              onClick={handleSaveWebhook}
              className="w-full bg-barbershop-blue hover:bg-barbershop-blue/90"
            >
              Salvar Webhook
            </Button>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-semibold text-barbershop-blue mb-2">Como configurar:</h4>
              <ol className="text-sm text-gray-700 space-y-1">
                <li>1. Crie um workflow no N8N</li>
                <li>2. Adicione um nó "Webhook"</li>
                <li>3. Copie a URL do webhook</li>
                <li>4. Cole a URL acima e salve</li>
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* Gerenciamento de Dados */}
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-gold text-barbershop-dark rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center space-x-2">
              <SettingsIcon size={20} />
              <span>Gerenciar Dados</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="text-center">
              <p className="text-lg font-semibold text-barbershop-dark mb-1">
                {customers.length}
              </p>
              <p className="text-sm text-gray-600 mb-4">Clientes cadastrados</p>
            </div>

            <Button 
              onClick={handleExportData}
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={customers.length === 0}
            >
              <Download className="mr-2" size={16} />
              Exportar Dados
            </Button>

            <Button 
              onClick={handleClearData}
              variant="destructive"
              className="w-full"
              disabled={customers.length === 0}
            >
              <Trash2 className="mr-2" size={16} />
              Limpar Dados
            </Button>

            <div className="bg-yellow-50 p-4 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-2">⚠️ Importante:</h4>
              <p className="text-sm text-yellow-700">
                Os dados são armazenados localmente no dispositivo. Faça backup regularmente exportando os dados.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Informações do Sistema */}
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-dark text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold">Informações do Sistema</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-barbershop-gold">{customers.length}</p>
              <p className="text-sm text-gray-600">Total de Clientes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-barbershop-blue">{n8nWebhookUrl ? 'Ativo' : 'Inativo'}</p>
              <p className="text-sm text-gray-600">Status N8N</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">Online</p>
              <p className="text-sm text-gray-600">Status do Sistema</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
