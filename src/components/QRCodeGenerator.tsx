
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { QrCode, Smartphone, Share2 } from 'lucide-react';

export const QRCodeGenerator: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    const url = window.location.origin + '/?mobile=true';
    setCurrentUrl(url);
    
    // Gerar QR Code usando uma API gratuita
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}`;
    setQrCodeUrl(qrUrl);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Cadastro - Barbershop',
          text: 'Faça seu cadastro na nossa barbearia',
          url: currentUrl,
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback para copiar para clipboard
      navigator.clipboard.writeText(currentUrl);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-blue text-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center space-x-2">
              <QrCode size={24} />
              <span>QR Code para Cadastro</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-inner mb-6">
              {qrCodeUrl && (
                <img
                  src={qrCodeUrl}
                  alt="QR Code para cadastro"
                  className="mx-auto max-w-full h-auto"
                />
              )}
            </div>
            
            <div className="space-y-4">
              <p className="text-barbershop-dark text-lg">
                Escaneie o QR Code acima para fazer o cadastro pelo celular
              </p>
              
              <Button
                onClick={handleShare}
                className="w-full h-12 bg-gradient-blue text-white hover:opacity-90 transition-all duration-300"
              >
                <Share2 className="mr-2" size={16} />
                Compartilhar Link
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-xl border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="bg-gradient-gold text-barbershop-dark rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center flex items-center justify-center space-x-2">
              <Smartphone size={24} />
              <span>Instruções</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-barbershop-gold rounded-full flex items-center justify-center text-barbershop-dark font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-barbershop-dark">Posicione o Tablet</h3>
                  <p className="text-gray-600">Coloque o tablet em um local visível e de fácil acesso para os clientes.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-barbershop-gold rounded-full flex items-center justify-center text-barbershop-dark font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-barbershop-dark">QR Code</h3>
                  <p className="text-gray-600">Os clientes podem escanear o QR Code para fazer o cadastro pelo próprio celular.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-barbershop-gold rounded-full flex items-center justify-center text-barbershop-dark font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-barbershop-dark">Cadastro Direto</h3>
                  <p className="text-gray-600">Ou podem usar diretamente o tablet para fazer o cadastro na tela de registro.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-barbershop-gold rounded-full flex items-center justify-center text-barbershop-dark font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold text-barbershop-dark">Automação</h3>
                  <p className="text-gray-600">Todos os cadastros são automaticamente enviados para o N8N para campanhas de aniversário e promoções.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
