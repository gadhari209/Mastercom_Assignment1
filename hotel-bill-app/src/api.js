import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

export const getAllItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/items`);
    return response.data;
  } catch (error) {
    console.error('There was an error fetching the items!', error);
    throw error;
  }
};

export const createItem = async (item) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/items`, item);
    return response.data;
  } catch (error) {
    console.error('There was an error creating the item!', error);
    throw error;
  }
};

export const updateItem = async (itemCode, itemDetails) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/items/${itemCode}`, itemDetails);
    return response.data;
  } catch (error) {
    console.error('There was an error updating the item!', error);
    throw error;
  }
};


export const deleteItem = async (itemCode) => {
  try {
    await axios.delete(`${API_BASE_URL}/items/${itemCode}`);
  } catch (error) {
    console.error('There was an error deleting the item!', error);
    throw error;
  }
};

export const createInvoice = async (invoice) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/invoices`, invoice);
    return response.data;
  } catch (error) {
    console.error('There was an error creating the invoice!', error);
    throw error;
  }
};

export const getInvoiceByInvoiceNo = async (invoiceNo) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/invoices/${invoiceNo}`);
    return response.data;
  } catch (error) {
    console.error('There was an error fetching the invoice!', error);
    throw error;
  }
};

export const updateInvoiceStatus = async (invoiceId, newStatus) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/invoices/${invoiceId}/status`, { status: newStatus });
    return response.data;
  } catch (error) {
    console.error('There was an error updating the invoice status!', error);
    throw error;
  }
};
