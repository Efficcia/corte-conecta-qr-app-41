import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Verificar se a senha é 100001
    if (password === '100001') {
      // Salvar no localStorage que está logado
      localStorage.setItem('admin-logged-in', 'true');
      onLogin();
      toast({
        title: "Acesso liberado",
        description: "Bem-vindo ao painel administrativo.",
      });
    } else {
      toast({
        title: "Senha incorreta",
        description: "Digite a senha correta para acessar o admin.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header da Barbearia */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full p-2 shadow-lg mx-auto mb-4">
            <img 
              src="/lovable-uploads/8cf25deb-54d0-4e38-a3aa-0b67525d63ad.png" 
              alt="Logo Barbearia B&G" 
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl font-bold text-barbershop-primary tracking-wide">B&G Admin</h1>
          <p className="text-muted-foreground mt-2">Área Restrita</p>
        </div>

        <Card className="shadow-xl border-0 bg-card">
          <CardHeader className="bg-gradient-dark text-white rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center justify-center space-x-2">
              <Lock size={20} />
              <span>Acesso Administrativo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Senha de Acesso</label>
                <Input
                  type="password"
                  placeholder="Digite a senha (6 dígitos)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  autoFocus
                />
              </div>
              
              <Button 
                type="submit"
                disabled={password.length !== 6 || isLoading}
                className="w-full bg-barbershop-dark hover:bg-barbershop-dark-light text-white"
                size="lg"
              >
                {isLoading ? 'Verificando...' : 'Entrar no Admin'}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Digite a senha de 6 dígitos para acessar o painel administrativo
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};