import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCustomers } from '@/contexts/CustomerContext';
import { Search, Users, MapPin, Phone, Mail, Calendar, Trash2, Edit } from 'lucide-react';

const BARBERSHOP_UNITS = {
  'forte': 'Av. do Forte n° 1825',
  'guadalajara': 'Rua Guadalajara n° 350'
};

export const CustomerList: React.FC = () => {
  const { customers, deleteCustomer, loading } = useCustomers();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string>('all');

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.phone.includes(searchTerm) ||
                         (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesUnit = selectedUnit === 'all' || customer.unit === selectedUnit;
    
    return matchesSearch && matchesUnit;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Tem certeza que deseja excluir o cliente ${name}?`)) {
      try {
        await deleteCustomer(id);
      } catch (error) {
        console.error('Erro ao excluir cliente:', error);
      }
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">Carregando clientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-barbershop-dark mb-2">Lista de Clientes</h1>
        <p className="text-gray-600">Gerencie todos os clientes cadastrados</p>
      </div>

      {/* Filtros */}
      <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar por nome, telefone ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={selectedUnit}
              onChange={(e) => setSelectedUnit(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-md focus:border-barbershop-gold focus:outline-none"
            >
              <option value="all">Todas as unidades</option>
              <option value="forte">Av. do Forte n° 1825</option>
              <option value="guadalajara">Rua Guadalajara n° 350</option>
            </select>
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-4 w-4 mr-2" />
              {filteredCustomers.length} cliente(s) encontrado(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      {filteredCustomers.length === 0 ? (
        <Card className="shadow-lg border-0 bg-white/95 backdrop-blur-sm">
          <CardContent className="p-12">
            <div className="text-center text-gray-500">
              <Users size={64} className="mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold mb-2">Nenhum cliente encontrado</h3>
              <p>Ajuste os filtros ou cadastre novos clientes</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCustomers.map((customer) => (
            <Card key={customer.id} className="shadow-lg border-0 bg-white/95 backdrop-blur-sm hover:shadow-xl transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-bold text-barbershop-dark">{customer.name}</CardTitle>
                    <Badge variant="secondary" className="mt-1">
                      <MapPin className="h-3 w-3 mr-1" />
                      {BARBERSHOP_UNITS[customer.unit as keyof typeof BARBERSHOP_UNITS] || customer.unit}
                    </Badge>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => handleDelete(customer.id, customer.name)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  {customer.phone}
                </div>
                
                {customer.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="h-4 w-4 mr-2" />
                    {customer.email}
                  </div>
                )}
                
                {customer.birth_date && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    Nascimento: {formatDate(customer.birth_date)}
                  </div>
                )}
                
                <div className="pt-2 border-t">
                  <p className="text-xs text-gray-500">
                    Cadastrado em: {formatDate(customer.created_at)}
                  </p>
                </div>
                
                {customer.notes && (
                  <div className="pt-2">
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {customer.notes}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};