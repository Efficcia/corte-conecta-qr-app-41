
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useCustomers } from '@/contexts/CustomerContext';
import { BarChart3, Users, Calendar, TrendingUp, UserPlus } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { getDashboardStats } = useCustomers();
  const stats = getDashboardStats();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-barbershop-dark mb-2">Dashboard Administrativo</h1>
        <p className="text-gray-600">Visão geral dos clientes cadastrados</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-lg border-0 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium">Total de Clientes</p>
                <p className="text-3xl font-bold">{stats.totalCustomers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium">Novos Este Mês</p>
                <p className="text-3xl font-bold">{stats.newCustomersThisMonth}</p>
              </div>
              <UserPlus className="h-8 w-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium">Aniversários Este Mês</p>
                <p className="text-3xl font-bold">{stats.birthdaysThisMonth}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-0 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm font-medium">Taxa de Crescimento</p>
                <p className="text-3xl font-bold">+{stats.totalCustomers > 0 ? Math.round((stats.newCustomersThisMonth / stats.totalCustomers) * 100) : 0}%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Últimos Cadastros */}
      <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
        <CardHeader className="bg-gradient-dark text-white rounded-t-lg">
          <CardTitle className="text-xl font-bold flex items-center space-x-2">
            <BarChart3 size={20} />
            <span>Últimos Cadastros</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {stats.lastRegistrations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p>Nenhum cliente cadastrado ainda</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.lastRegistrations.map((customer) => (
                <div key={customer.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex-1">
                    <h3 className="font-semibold text-barbershop-dark">{customer.name}</h3>
                    <p className="text-sm text-gray-600">{customer.phone}</p>
                    {customer.email && <p className="text-sm text-gray-600">{customer.email}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Cadastrado em</p>
                    <p className="font-medium text-barbershop-dark">{formatDate(customer.created_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
