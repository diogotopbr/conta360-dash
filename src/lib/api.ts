import { supabase } from './supabase';

const EDGE_FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

// Helper to get auth token
const getAuthToken = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.access_token;
};

// Dashboard API
export const dashboardAPI = {
  getSummary: async (startDate?: string, endDate?: string) => {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const params = new URLSearchParams();
    if (startDate) params.append('start', startDate);
    if (endDate) params.append('end', endDate);

    const response = await fetch(`${EDGE_FUNCTIONS_URL}/dashboard-summary?${params}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard summary');
    }

    return response.json();
  },
};

// Import API
export const importAPI = {
  parseFile: async (file: File) => {
    const token = await getAuthToken();
    if (!token) throw new Error('Not authenticated');

    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${EDGE_FUNCTIONS_URL}/import-parse`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to parse file');
    }

    return response.json();
  },
};

// Transactions API (using Supabase direct)
export const transactionsAPI = {
  getAll: async (filters?: {
    startDate?: string;
    endDate?: string;
    categoryId?: string;
  }) => {
    let query = supabase
      .from('transactions')
      .select('*, categories(name)')
      .order('date', { ascending: false });

    if (filters?.startDate) {
      query = query.gte('date', filters.startDate);
    }
    if (filters?.endDate) {
      query = query.lte('date', filters.endDate);
    }
    if (filters?.categoryId) {
      query = query.eq('category_id', filters.categoryId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data;
  },

  create: async (transaction: {
    date: string;
    description: string;
    amount_cents: number;
    category_id?: string;
    account_id?: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('transactions')
      .insert([{ ...transaction, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  createBatch: async (transactions: Array<{
    date: string;
    description: string;
    amount_cents: number;
    external_id?: string;
  }>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const transactionsWithUserId = transactions.map(t => ({
      ...t,
      user_id: user.id,
    }));

    const { data, error } = await supabase
      .from('transactions')
      .insert(transactionsWithUserId)
      .select();

    if (error) throw error;
    return data;
  },

  update: async (id: string, updates: Partial<{
    date: string;
    description: string;
    amount_cents: number;
    category_id: string;
  }>) => {
    const { data, error } = await supabase
      .from('transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },
};

// Bills API
export const billsAPI = {
  getPayable: async () => {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('type', 'payable')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  getReceivable: async () => {
    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .eq('type', 'receivable')
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  create: async (bill: {
    title: string;
    due_date: string;
    amount_cents: number;
    type: 'payable' | 'receivable';
    status?: string;
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('bills')
      .insert([{ ...bill, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  markAsPaid: async (id: string) => {
    const { data, error } = await supabase
      .from('bills')
      .update({ status: 'paid' })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};

// Categories API
export const categoriesAPI = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    return data;
  },

  create: async (category: {
    name: string;
    type: 'income' | 'expense' | 'transfer';
  }) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .from('categories')
      .insert([{ ...category, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
