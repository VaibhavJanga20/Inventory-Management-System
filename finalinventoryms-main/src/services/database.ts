import { supabase } from '../lib/supabase';

// Products
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*');
  if (error) throw error;
  return data;
};

export const addProduct = async (product: any) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product]);
  if (error) throw error;
  return data;
};

// Categories
export const getCategories = async () => {
  const { data, error } = await supabase
    .from('categories')
    .select('*');
  if (error) throw error;
  return data;
};

// Customers
export const getCustomers = async () => {
  const { data, error } = await supabase
    .from('customers')
    .select('*');
  if (error) throw error;
  return data;
};

// Orders
export const getOrders = async () => {
  const { data, error } = await supabase
    .from('orders')
    .select(`
      *,
      customer:customers(*),
      order_details:order_details(*)
    `);
  if (error) throw error;
  return data;
};

// Employees
export const getEmployees = async () => {
  const { data, error } = await supabase
    .from('employees')
    .select('*');
  if (error) throw error;
  return data;
};

// Warehouses
export const getWarehouses = async () => {
  const { data, error } = await supabase
    .from('warehouses')
    .select('*');
  if (error) throw error;
  return data;
}; 