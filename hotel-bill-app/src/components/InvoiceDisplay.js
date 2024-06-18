import React from 'react';
import './InvoiceDisplay.css';

function InvoiceDisplay({ invoice }) {
  return (
    <div className="invoice-display-container">
      <h2 className="invoice-heading">Invoice Details</h2>
      {invoice ? (
        <div>
          <p><strong>Invoice Number:</strong> {invoice.invoiceNo}</p>
          <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {invoice.billStatus}</p>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Item Code</th>
                <th>Item Name</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total Price</th>
              </tr>
            </thead>
            <tbody>
              {invoice.invoiceDetailsList.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.item.itemCode}</td>
                  <td>{detail.item.itemName}</td>
                  <td>Rs. {detail.item.itemPrice}</td>
                  <td>{detail.quantity}</td>
                  <td>Rs. {detail.item.itemPrice * detail.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="invoice-total"><strong>Total Amount:</strong> Rs. {invoice.totalAmount}</p>
        </div>
      ) : (
        <p>No invoice data available</p>
      )}
    </div>
  );
}

export default InvoiceDisplay;
