import React, { useState } from 'react';
import { CustomerProvider } from '@/contexts/CustomerContext';
import { Dashboard } from '@/components/Dashboard';
import { CustomerList } from '@/components/CustomerList';
import { MessageDispatch } from '@/components/MessageDispatch';

const Admin = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'customers':
        return <CustomerList />;
      case 'dispatch':
        return <MessageDispatch />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <CustomerProvider>
      <div className="min-h-screen bg-gradient-subtle">
        {/* Header da Barbearia - igual ao inicial */}
        <header className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-barbershop-muted py-6">
          <div className="max-w-7xl mx-auto px-4 flex items-center justify-center space-x-4">
            <div className="w-20 h-20 bg-white rounded-full p-2 shadow-lg">
              <img 
                src="/lovable-uploads/8cf25deb-54d0-4e38-a3aa-0b67525d63ad.png" 
                alt="Logo Barbearia B&G" 
                className="w-full h-full object-contain"
              />
            </div>
            <div className="text-center">
              <h1 className="text-3xl font-bold text-barbershop-primary tracking-wide">B&G Admin</h1>
            </div>
          </div>
        </header>

        <AdminNavigation currentPage={currentPage} onPageChange={setCurrentPage} />
        
        <main className="pt-4 pb-8">
          <div className="animate-fade-in">
            {renderPage()}
          </div>
        </main>
      </div>
    </CustomerProvider>
  );
};

// Navegação específica para área admin
const AdminNavigation: React.FC<{ currentPage: string; onPageChange: (page: string) => void }> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { id: 'customers', label: 'Clientes', icon: 'Users' },
    { id: 'dispatch', label: 'Disparos', icon: 'Send' }
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-md border-b border-barbershop-muted">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-center items-center h-16">
          <div className="flex space-x-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === item.id 
                    ? 'bg-barbershop-primary text-white' 
                    : 'text-barbershop-primary hover:bg-barbershop-accent'
                }`}
              >
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Admin;