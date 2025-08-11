
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Customer, DashboardStats } from '@/types';
import { supabase } from '@/integrations/supabase/client';

interface CustomerContextType {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateCustomer: (id: string, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: string) => Promise<void>;
  getDashboardStats: () => DashboardStats;
  triggerN8nWebhook: (data: any) => Promise<void>;
  n8nWebhookUrl: string;
  setN8nWebhookUrl: (url: string) => void;
  loading: boolean;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const useCustomers = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error('useCustomers must be used within a CustomerProvider');
  }
  return context;
};

export const CustomerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [n8nWebhookUrl, setN8nWebhookUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // Carregar dados do Supabase e localStorage
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Carregar customers do Supabase
        const { data: customersData, error } = await supabase
          .from('customers')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading customers:', error);
        } else if (customersData) {
          setCustomers(customersData);
        }

        // Carregar webhook URL do localStorage
        const savedWebhookUrl = localStorage.getItem('barbershop-n8n-webhook');
        if (savedWebhookUrl) {
          setN8nWebhookUrl(savedWebhookUrl);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Salvar webhook URL no localStorage
  useEffect(() => {
    localStorage.setItem('barbershop-n8n-webhook', n8nWebhookUrl);
  }, [n8nWebhookUrl]);

  const addCustomer = async (customerData: Omit<Customer, 'id' | 'created_at' | 'updated_at'>) => {
    setLoading(true);
    try {
      const { data: newCustomer, error } = await supabase
        .from('customers')
        .insert([customerData])
        .select()
        .single();

      if (error) {
        console.error('Error adding customer:', error);
        throw error;
      }

      if (newCustomer) {
        setCustomers(prev => [newCustomer, ...prev]);

        // Disparar webhook do n8n se configurado
        if (n8nWebhookUrl) {
          triggerN8nWebhook({
            event: 'new_customer',
            customer: newCustomer,
            timestamp: new Date().toISOString()
          });
        }
      }
    } catch (error) {
      console.error('Error adding customer:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    setLoading(true);
    try {
      const { data: updatedCustomer, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating customer:', error);
        throw error;
      }

      if (updatedCustomer) {
        setCustomers(prev => 
          prev.map(customer => 
            customer.id === id ? updatedCustomer : customer
          )
        );
      }
    } catch (error) {
      console.error('Error updating customer:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting customer:', error);
        throw error;
      }

      setCustomers(prev => prev.filter(customer => customer.id !== id));
    } catch (error) {
      console.error('Error deleting customer:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getDashboardStats = (): DashboardStats => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    const newCustomersThisMonth = customers.filter(customer => {
      const registrationDate = new Date(customer.created_at);
      return registrationDate.getMonth() === thisMonth && 
             registrationDate.getFullYear() === thisYear;
    }).length;

    const birthdaysThisMonth = customers.filter(customer => {
      if (!customer.birth_date) return false;
      const birthDate = new Date(customer.birth_date);
      return birthDate.getMonth() === thisMonth;
    }).length;

    const lastRegistrations = customers
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);

    return {
      totalCustomers: customers.length,
      newCustomersThisMonth,
      birthdaysThisMonth,
      lastRegistrations
    };
  };

  const triggerN8nWebhook = async (data: any) => {
    if (!n8nWebhookUrl) return;

    try {
      await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        body: JSON.stringify(data),
      });
      console.log('N8N webhook triggered successfully');
    } catch (error) {
      console.error('Error triggering N8N webhook:', error);
    }
  };

  return (
    <CustomerContext.Provider value={{
      customers,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      getDashboardStats,
      triggerN8nWebhook,
      n8nWebhookUrl,
      setN8nWebhookUrl,
      loading
    }}>
      {children}
    </CustomerContext.Provider>
  );
};
