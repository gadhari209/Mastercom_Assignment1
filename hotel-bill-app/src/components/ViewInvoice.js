import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './print_.css';


const ViewInvoice = ({ invoice }) => {
  const { invoiceNo, totalAmount, invoiceDetailsList } = invoice;
  const [billStatus, setBillStatus] = useState(invoice.billStatus || 'Unpaid');

  useEffect(() => {
    console.log('Invoice received:', invoice);
    console.log('Bill Status:', billStatus);
  }, [invoice, billStatus]);

  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const currentTime = new Date().toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  const handlePayInvoice = async () => {
    try {
      const response = await axios.put(`http://localhost:8080/invoices/${invoiceNo}/status`, { billStatus: 'Paid' });
      console.log('Invoice status updated to Paid');
      console.log('API Response:', response.data);
      const newBillStatus = typeof response.data.billStatus === 'string' ? JSON.parse(response.data.billStatus).billStatus : response.data.billStatus;
      setBillStatus(newBillStatus);
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="invoice-container">
      <div className="store-info">
        <h1 style={{ textAlign: 'center' }}>Rameshwar Caffe</h1>
        <p style={{ textAlign: 'center' }}>R-10 apt, Shop No 1, Station Road</p>
        <p style={{ textAlign: 'center' }}>Kolsewadi, Kalyan (East) 421306</p>
        <p style={{ textAlign: 'center' }}>________________________________________</p>
      </div>
      <div className="invoice-header">
        <h2>Invoice</h2>
        <div className="date-time">
          <p style={{ float: 'left' }}>{currentDate}</p>
          <p style={{ float: 'right' }}>{currentTime}</p>
        </div>
        <div style={{ clear: 'both' }}></div>
        <p>Invoice Number: {invoiceNo}</p>
        <p>Status: <strong>{billStatus}</strong></p>
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
            {invoiceDetailsList.map((details, index) => (
              <tr key={index}>
                <td>{details.item.itemName}</td>
                <td>{details.quantity}</td>
                <td>{details.item.itemCode}</td>
                <td>Rs. {details.item.itemPrice.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Total Amount: Rs. {totalAmount.toFixed(2)}</h2>
      </div>
      {billStatus === 'Unpaid' && (
        <div className="pay-button-container">
          <button onClick={handlePayInvoice}>Pay Invoice</button>
        </div>
      )}
      <div className="print-button-container">
        <button onClick={handlePrintInvoice}>Print Invoice</button>
      </div>
    </div>
  );
};

export default ViewInvoice;
