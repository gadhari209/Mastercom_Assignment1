import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AvailableItems.css';
import ViewInvoice from './ViewInvoice'; // Import the ViewInvoice component

function AvailableItems() {
  const [items, setItems] = useState([]);
  const [selectedItems, setSelectedItems] = useState({});
  const [addedItems, setAddedItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [showCartSection, setShowCartSection] = useState(false); // State to show/hide cart section
  const [showInvoice, setShowInvoice] = useState(false); // State to show/hide invoice
  const [createdInvoice, setCreatedInvoice] = useState(null); // State to hold created invoice data
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/items');
      const availableItems = response.data.filter(item => item.status === 'Available');
      setItems(availableItems);
    } catch (error) {
      console.error('There was an error fetching the items!', error);
    }
  };

  const handleSelectChange = (itemCode, quantity) => {
    setSelectedItems(prevState => ({
      ...prevState,
      [itemCode]: Math.max(0, quantity) // Ensure quantity is non-negative
    }));
  };

  const handleQuantityChange = (itemCode, newQuantity, isFromCartTable = false) => {
    if (isFromCartTable) {
      if (newQuantity <= 0) {
        removeItemFromCart(itemCode);
      } else {
        setAddedItems(prevState =>
          prevState.map(item =>
            item.itemCode === itemCode ? { ...item, quantity: newQuantity, totalPrice: item.itemPrice * newQuantity } : item
          )
        );
      }
    } else {
      setSelectedItems(prevState => ({
        ...prevState,
        [itemCode]: newQuantity
      }));
    }
  };

  const addToCart = () => {
    const newAddedItems = items
      .filter(item => selectedItems[item.itemCode] > 0)
      .map(item => ({
        itemCode: item.itemCode,
        itemName: item.itemName,
        itemPrice: item.itemPrice,
        quantity: selectedItems[item.itemCode],
        totalPrice: item.itemPrice * selectedItems[item.itemCode]
      }));

    setAddedItems(newAddedItems);
    setShowCartSection(true); // Show cart section
    setSelectedItems({});
  };

  useEffect(() => {
    const total = addedItems.reduce((acc, item) => acc + item.totalPrice, 0);
    setTotalAmount(total);
  }, [addedItems]);

  const removeItemFromCart = (itemCode) => {
    setAddedItems(prevState => prevState.filter(item => item.itemCode !== itemCode));
  };

  const createInvoice = async () => {
    try {
      const formattedItems = addedItems.map(item => ({
        item: {
          itemName: item.itemName,
          itemCode: item.itemCode,
          itemPrice: item.itemPrice,
        },
        itemPrice: item.itemPrice,
        quantity: item.quantity.toString(),
      }));

      const invoicePayload = {
        invoiceDetailsList: formattedItems,
        totalAmount: totalAmount,
        date: new Date().toISOString(),
        billStatus: 'Unpaid',
      };

      const response = await axios.post('http://localhost:8080/invoices', invoicePayload);
      const responseInvoice = response.data;

      let calculatedTotalAmount = 0;
      responseInvoice.invoiceDetailsList.forEach(details => {
        calculatedTotalAmount += details.item.itemPrice * details.quantity;
      });

      setSuccessMessage(`Invoice created successfully with invoice number: ${responseInvoice.invoiceNo}`);
      setCreatedInvoice({
        ...responseInvoice,
        totalAmount: calculatedTotalAmount,
      });

      setAddedItems([]);
      setTotalAmount(0);
      setSelectedItems({});
      setShowCartSection(false); // Hide cart section
      setShowInvoice(true); // Show invoice view
    } catch (error) {
      console.error('There was an error creating the invoice!', error);
      setErrorMessage('Failed to create invoice. Please try again later.');
    }
  };

  const viewInvoice = () => {
    setShowInvoice(false); // Hide invoice view
    fetchItems(); // Refresh available items
    setShowCartSection(false); // Hide cart section
  };

  const refreshPage = () => {
    window.location.reload(); // Reloads the page to refresh available items
  };

  return (
    <div className="available-items-container">
      {!showInvoice && (
        <>
          {!showCartSection ? (
            <>
              <h2 className="available-items-heading">Available Items</h2>
              <table className="available-items-table">
                <thead>
                  <tr>
                    <th>Item Code</th>
                    <th>Item Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemCode}</td>
                      <td>{item.itemName}</td>
                      <td>Rs. {item.itemPrice}</td>
                      <td>
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.itemCode, (selectedItems[item.itemCode] || 0) - 1)}
                          disabled={!(selectedItems[item.itemCode] > 0)}
                        >
                          -
                        </button>
                        {selectedItems[item.itemCode] || 0}
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.itemCode, (selectedItems[item.itemCode] || 0) + 1)}
                        >
                          +
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="add-to-cart-btn" onClick={addToCart}>Add to Cart</button>
            </>
          ) : (
            <div>
              <h3 className="available-items-heading">Cart Items</h3>
              <table className="added-items-table">
                <thead>
                  <tr>
                    <th>Item Name</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total Price</th>
                  </tr>
                </thead>
                <tbody>
                  {addedItems.map((item, index) => (
                    <tr key={index}>
                      <td>{item.itemName}</td>
                      <td>
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.itemCode, item.quantity - 1, true)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        {item.quantity}
                        <button
                          className="quantity-btn"
                          onClick={() => handleQuantityChange(item.itemCode, item.quantity + 1, true)}
                        >
                          +
                        </button>
                      </td>
                      <td>Rs. {item.itemPrice}</td>
                      <td>Rs. {item.totalPrice}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="available-items-heading">Total: Rs. {totalAmount}</p>
              <button className="create-invoice-btn" onClick={createInvoice}>
                Create Invoice
              </button>
            </div>
          )}
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <button className="refresh-btn" onClick={refreshPage}>
            Reset
          </button>
        </>
      )}
      {showInvoice && createdInvoice && (
        <div>
           <button className="refresh-btn" onClick={refreshPage}>
            Refresh 
          </button>
          <ViewInvoice invoice={createdInvoice} />
          
          {successMessage && <p className="success-message">{successMessage}</p>}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      )}
    </div>
  );
}

export default AvailableItems;
