import React, { useState } from 'react';
import axios from 'axios';
import './CreateInvoice.css'; // Import the CSS file

const CreateInvoice = () => {
  const [invoice, setInvoice] = useState({
    invoiceDetailsList: [],
    totalAmount: 0,
    invoiceNo: null,
  });
  const [item, setItem] = useState({
    itemName: '',
    itemQuantity: 0,
    itemCode: '',
    itemPrice: 10,
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const addItem = () => {
    const newItem = { ...item };
    setInvoice({
      ...invoice,
      invoiceDetailsList: [...invoice.invoiceDetailsList, { item: newItem, itemPrice: newItem.itemPrice, quantity: newItem.itemQuantity }],
      totalAmount: invoice.totalAmount + newItem.itemPrice * newItem.itemQuantity,
    });
    setItem({ itemName: '', itemQuantity: 0, itemCode: '', itemPrice: 0 });
  };

  const createInvoice = async () => {
    try {
      const response = await axios.post('http://localhost:8080/invoices', invoice);
      const responseInvoice = response.data;
      
      let calculatedTotalAmount = 0;
      responseInvoice.invoiceDetailsList.forEach(details => {
        calculatedTotalAmount += details.item.itemPrice * details.quantity;
      });

      setSuccessMessage(`Invoice created successfully with invoice number: ${responseInvoice.invoiceNo}`);
      setInvoice({
        invoiceDetailsList: responseInvoice.invoiceDetailsList,
        totalAmount: calculatedTotalAmount,
        invoiceNo: responseInvoice.invoiceNo,
      });
    } catch (error) {
      setErrorMessage('Error creating invoice');
    }
  };

  return (
    <div className="invoice-container">
      <h2>Create Invoice</h2>
      <div className="item-inputs">
        <input
          type="text"
          name="itemName"
          value={item.itemName}
          onChange={handleChange}
          placeholder="Item Name"
        />
        <input
          type="number"
          name="itemQuantity"
          value={item.itemQuantity}
          onChange={handleChange}
          placeholder="Quantity"
        />
        <input
          type="text"
          name="itemCode"
          value={item.itemCode}
          onChange={handleChange}
          placeholder="Item Code"
        />
        {/* <input
          type="number"
          name="itemPrice"
          value={item.itemPrice}
          onChange={handleChange}
          placeholder="Item Price"
        /> */}
        <button onClick={addItem}>Add Item</button>
      </div>
      <div className="invoice-details">
        <h3>Invoice Details</h3>
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Quantity</th>
              <th>Item Code</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            {invoice.invoiceDetailsList.map((details, index) => (
              <tr key={index}>
                <td>{details.item.itemName}</td>
                <td>{details.quantity}</td>
                <td>{details.item.itemCode}</td>
                <td>{details.item.itemPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="total-amount">Total Amount: Rs. {invoice.totalAmount.toFixed(2)}</p>
      </div>
      <button className="create-invoice-btn" onClick={createInvoice}>Create Invoice</button>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default CreateInvoice;
