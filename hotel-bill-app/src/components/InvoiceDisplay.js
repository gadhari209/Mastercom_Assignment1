// src/components/InvoiceDisplay.js
import React from 'react';

function InvoiceDisplay({ invoice }) {
  const total = invoice.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Invoice</h2>
      <ul>
        {invoice.map((item, index) => (
          <li key={index}>
            {item.name} - ${item.price} x {item.quantity} = ${item.price * item.quantity}
          </li>
        ))}
      </ul>
      <h3>Total: ${total}</h3>
    </div>
  );
}

export default InvoiceDisplay;
