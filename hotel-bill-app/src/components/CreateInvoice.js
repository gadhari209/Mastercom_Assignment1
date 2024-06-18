import React, { useState } from 'react';
import axios from 'axios';
import './CreateInvoice.css'; // Import the CSS file
import { format } from 'date-fns';
import Swal from 'sweetalert2'; // Import SweetAlert
import ViewInvoice from './ViewInvoice'; // Import the ViewInvoice component

const CreateInvoice = () => {
  const [invoice, setInvoice] = useState({
    invoiceDetailsList: [],
    totalAmount: 0,
    invoiceNo: null,
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm:ss.SSS"),  // Set local date and time
    billStatus: 'Unpaid'
  });
  const [item, setItem] = useState({
    itemQuantity: '',
    itemCode: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [viewInvoice, setViewInvoice] = useState(false); // State to control displaying ViewInvoice

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem({ ...item, [name]: value });
  };

  const fetchItemDetails = async (itemCode) => {
    try {
      const response = await axios.get(`http://localhost:8080/items/${itemCode}`);
      return response.data;
    } catch (error) {
      setErrorMessage('Error fetching item details');
      return null;
    }
  };

  const addItem = async () => {
    const itemDetails = await fetchItemDetails(item.itemCode);
    if (itemDetails) {
      if (itemDetails.status === 'Available') {
        const newItem = {
          item: {
            itemName: itemDetails.itemName,
            itemCode: item.itemCode,
            itemPrice: itemDetails.itemPrice,
          },
          itemPrice: itemDetails.itemPrice,
          quantity: item.itemQuantity,
        };
        setInvoice((prevInvoice) => ({
          ...prevInvoice,
          invoiceDetailsList: [...prevInvoice.invoiceDetailsList, newItem],
          totalAmount: prevInvoice.totalAmount + itemDetails.itemPrice * item.itemQuantity,
        }));
        setItem({ itemQuantity: '', itemCode: '' });
        setErrorMessage('');
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Item Not Available',
          text: 'The item you are trying to add is not available.',
        });
      }
    }
  };

  const deleteItem = (index) => {
    setInvoice((prevInvoice) => {
      const newInvoiceDetailsList = [...prevInvoice.invoiceDetailsList];
      const removedItem = newInvoiceDetailsList.splice(index, 1)[0];
      return {
        ...prevInvoice,
        invoiceDetailsList: newInvoiceDetailsList,
        totalAmount: prevInvoice.totalAmount - removedItem.itemPrice * removedItem.quantity,
      };
    });
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
      setErrorMessage('');
      setViewInvoice(true); // Display the ViewInvoice component
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
          name="itemCode"
          value={item.itemCode}
          onChange={handleChange}
          placeholder="Item Code"
        />
        <input
          type="number"
          name="itemQuantity"
          value={item.itemQuantity}
          onChange={handleChange}
          placeholder="Quantity"
        />
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoice.invoiceDetailsList.map((details, index) => (
              <tr key={index}>
                <td>{details.item.itemName}</td>
                <td>{details.quantity}</td>
                <td>{details.item.itemCode}</td>
                <td>{details.item.itemPrice}</td>
                <td>
                  <button onClick={() => deleteItem(index)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="total-amount">Total Amount: Rs. {invoice.totalAmount.toFixed(2)}</p>
      </div>
      <button className="create-invoice-btn" onClick={createInvoice}>Create Invoice</button>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      {viewInvoice && <ViewInvoice invoice={invoice} />}
      {!viewInvoice && successMessage && <a href="#" onClick={() => setViewInvoice(true)}>View Invoice</a>}
    </div>
  );
};

export default CreateInvoice;
