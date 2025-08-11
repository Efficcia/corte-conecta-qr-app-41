import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCustomers } from '@/contexts/CustomerContext';
import { useToast } from '@/hooks/use-toast';
import { User, Phone, Mail, Calendar, MessageSquare, MapPin } from 'lucide-react';

const BARBERSHOP_UNITS = [
  { value: 'forte', label: 'Av. do Forte n° 1825' },
  { value: 'guadalajara', label: 'Rua Guadalajara n° 350' }
];

export const CustomerForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    ddi: '+55',
    ddd: '',
    phone: '',
    email: '',
    birth_date: '',
    unit: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addCustomer } = useCustomers();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.ddd || !formData.phone || !formData.unit) {
      toast({
        title: "Erro",
        description: "Nome, telefone completo e unidade são obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await addCustomer({
        name: formData.name,
        phone: `${formData.ddi}${formData.ddd}${formData.phone}`,
        email: formData.email,
        birth_date: formData.birth_date,
        unit: formData.unit,
        notes: formData.notes
      });

      toast({
        title: "Sucesso!",
        description: "Cliente cadastrado com sucesso",
      });

      // Limpar formulário
      setFormData({
        name: '',
        ddi: '+55',
        ddd: '',
        phone: '',
        email: '',
        birth_date: '',
        unit: '',
        notes: ''
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao cadastrar cliente",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-sm overflow-hidden">
        <CardHeader className="bg-gradient-elegant text-white">
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center space-x-2">
            <User size={24} />
            <span>Cadastro</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">{/* Card content will continue... */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="unit" className="flex items-center space-x-2 text-barbershop-primary font-semibold">
                <MapPin size={16} />
                <span>Unidade da Barbearia *</span>
              </Label>
              <Select value={formData.unit} onValueChange={(value) => setFormData(prev => ({ ...prev, unit: value }))}>
                <SelectTrigger className="h-12 text-lg border-2 border-barbershop-muted focus:border-barbershop-secondary transition-colors">
                  <SelectValue placeholder="Selecione a unidade" />
                </SelectTrigger>
                <SelectContent>
                  {BARBERSHOP_UNITS.map((unit) => (
                    <SelectItem key={unit.value} value={unit.value}>
                      {unit.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center space-x-2 text-barbershop-primary font-semibold">
                  <User size={16} />
                  <span>Nome Completo *</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Digite o nome completo"
                  className="h-12 text-lg border-2 border-barbershop-muted focus:border-barbershop-secondary transition-colors"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="flex items-center space-x-2 text-barbershop-primary font-semibold">
                  <Phone size={16} />
                  <span>Telefone *</span>
                </Label>
                <div className="grid grid-cols-[80px_80px_1fr] gap-3">
                  <Input
                    name="ddi"
                    value={formData.ddi}
                    onChange={handleChange}
                    placeholder="DDI"
                    className="h-12 text-lg border-2 border-barbershop-muted focus:border-barbershop-secondary text-center transition-colors"
                    maxLength={4}
                  />
                  <Input
                    name="ddd"
                    value={formData.ddd}
                    onChange={handleChange}
                    placeholder="DDD"
                    className="h-12 text-lg border-2 border-barbershop-muted focus:border-barbershop-secondary text-center transition-colors"
                    maxLength={2}
                    required
                  />
                  <Input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Número do telefone"
                    className="h-12 text-lg border-2 border-barbershop-muted focus:border-barbershop-secondary transition-colors"
                    maxLength={9}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center space-x-2 text-barbershop-primary font-semibold">
                  <Mail size={16} />
                  <span>E-mail</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@exemplo.com"
                  className="h-12 text-lg border-2 border-barbershop-muted focus:border-barbershop-secondary transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="birth_date" className="flex items-center space-x-2 text-barbershop-primary font-semibold">
                  <Calendar size={16} />
                  <span>Data de Nascimento</span>
                </Label>
                <Input
                  id="birth_date"
                  name="birth_date"
                  type="date"
                  value={formData.birth_date}
                  onChange={handleChange}
                  className="h-12 text-lg border-2 border-barbershop-muted focus:border-barbershop-secondary transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="flex items-center space-x-2 text-barbershop-primary font-semibold">
                <MessageSquare size={16} />
                <span>Observações</span>
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Preferências do cliente, alergias, etc..."
                className="min-h-[100px] text-lg border-2 border-barbershop-muted focus:border-barbershop-secondary resize-none transition-colors"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-14 text-lg font-semibold bg-gradient-elegant text-white hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50"
            >
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};