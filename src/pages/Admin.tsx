import React, { useState, useEffect } from 'react';
import { CustomerProvider } from '@/contexts/CustomerContext';
import { Dashboard } from '@/components/Dashboard';
import { CustomerList } from '@/components/CustomerList';
import { MessageDispatch } from '@/components/MessageDispatch';
import { AdminLogin } from '@/components/AdminLogin';

const Admin = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Verificar se já está logado ao carregar a página
  useEffect(() => {
    const loggedIn = localStorage.getItem('admin-logged-in') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-logged-in');
    setIsLoggedIn(false);
    setCurrentPage('dashboard');
  };

  // Se não estiver logado, mostrar tela de login
  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />;
  }

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

        <AdminNavigation currentPage={currentPage} onPageChange={setCurrentPage} onLogout={handleLogout} />
        
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
const AdminNavigation: React.FC<{ currentPage: string; onPageChange: (page: string) => void; onLogout: () => void }> = ({ currentPage, onPageChange, onLogout }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3' },
    { id: 'customers', label: 'Clientes', icon: 'Users' },
    { id: 'dispatch', label: 'Disparos', icon: 'Send' }
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-md border-b border-barbershop-muted">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
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
          
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            Sair
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Admin;