
import React from 'react';
import { Button } from '@/components/ui/button';
import { Users, QrCode, BarChart3, Settings } from 'lucide-react';

interface NavigationProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'register', label: 'Cadastro', icon: Users },
    { id: 'qr', label: 'QR Code', icon: QrCode }
  ];

  return (
    <nav className="bg-gradient-dark shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-gold rounded-lg flex items-center justify-center">
              <span className="text-barbershop-dark font-bold text-sm">B</span>
            </div>
            <h1 className="text-xl font-bold text-white">Barbershop Manager</h1>
          </div>
          
          <div className="flex space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "ghost"}
                  onClick={() => onPageChange(item.id)}
                  className={`flex items-center space-x-2 ${
                    currentPage === item.id 
                      ? 'bg-barbershop-gold text-barbershop-dark hover:bg-barbershop-gold/90' 
                      : 'text-white hover:bg-barbershop-dark-light'
                  }`}
                >
                  <Icon size={16} />
                  <span className="hidden md:inline">{item.label}</span>
                </Button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};
