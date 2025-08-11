
export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  birth_date: string;
  unit: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface BarbershopConfig {
  name: string;
  logo?: string;
  primaryColor: string;
  secondaryColor: string;
  n8nWebhookUrl?: string;
}

export interface DashboardStats {
  totalCustomers: number;
  newCustomersThisMonth: number;
  birthdaysThisMonth: number;
  lastRegistrations: Customer[];
}
