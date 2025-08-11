
import React, { useState, useEffect } from 'react';
import { CustomerProvider } from '@/contexts/CustomerContext';
import { Navigation } from '@/components/Navigation';
import { CustomerForm } from '@/components/CustomerForm';
import { QRCodeGenerator } from '@/components/QRCodeGenerator';
import { Dashboard } from '@/components/Dashboard';
import { Settings } from '@/components/Settings';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('register');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Verificar se é acesso mobile via QR Code
    const urlParams = new URLSearchParams(window.location.search);
    const mobileAccess = urlParams.get('mobile');
    
    if (mobileAccess === 'true') {
      setIsMobile(true);
      setCurrentPage('register');
    }
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'register':
        return <CustomerForm />;
      case 'qr':
        return <QRCodeGenerator />;
      default:
        return <CustomerForm />;
    }
  };

  return (
    <CustomerProvider>
      <div className="min-h-screen bg-gradient-subtle">
        {/* Header da Barbearia */}
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
            <h1 className="text-3xl font-bold text-barbershop-primary tracking-wide">Barbearia B&G</h1>
          </div>
          </div>
        </header>
        
        <main className="py-12">
          <div className="animate-fade-in">
            {renderPage()}
          </div>
        </main>
      </div>
    </CustomerProvider>
  );
};

export default Index;
