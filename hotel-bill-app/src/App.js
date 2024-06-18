import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import axios from 'axios'; // Import axios
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import CreateInvoice from './components/CreateInvoice';
import InvoiceDisplay from './components/InvoiceDisplay';
import EditItemForm from './components/EditItemForm';
import AvailableItems from './components/AvailableItems';
import Cart from './components/Cart';
import { getAllItems, createItem, updateItem } from './api';
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [invoice, setInvoice] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    getAllItems()
      .then((items) => {
        setItems(items);
      })
      .catch((error) => {
        console.error('There was an error fetching the items!', error);
      });
  }, []);

  const addItem = (item) => {
    createItem(item)
      .then((newItem) => {
        setItems([...items, newItem]);
      })
      .catch((error) => {
        console.error('There was an error creating the item!', error);
      });
  };

  const updateItemHandler = (updatedItem) => {
    updateItem(updatedItem.itemCode, updatedItem)
      .then((response) => {
        const updatedItems = items.map((item) =>
          item.itemCode === updatedItem.itemCode ? response : item
        );
        setItems(updatedItems);
      })
      .catch((error) => {
        console.error('There was an error updating the item!', error);
      });
  };

  const addToCart = (newItems) => {
    setCartItems([...cartItems, ...newItems]);
  };

  const createInvoiceCallback = async () => {
    try {
      const totalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);
      const formattedItems = cartItems.map((item) => ({
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

      const response = await axios.post('http://localhost:8080/invoices', invoicePayload); // Use axios to make HTTP POST request
      const responseInvoice = response.data;

      let calculatedTotalAmount = 0;
      responseInvoice.invoiceDetailsList.forEach((details) => {
        calculatedTotalAmount += details.item.itemPrice * details.quantity;
      });

      setSuccessMessage(`Invoice created successfully with invoice number: ${responseInvoice.invoiceNo}`);
      setInvoice({
        ...responseInvoice,
        totalAmount: calculatedTotalAmount,
      });

      setCartItems([]);
    } catch (error) {
      console.error('There was an error creating the invoice!', error);
      setErrorMessage('Failed to create invoice. Please try again later.');
    }
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Hotel Bill</h1>
          <nav>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/add-item">Add New Item</Link>
              </li>
              <li className="nav-item">
                <Link to="/items">Item List</Link>
              </li>
              <li className="nav-item">
                <Link to="/create-invoice">Create Invoice</Link>
              </li>
              <li className="nav-item">
                <Link to="/available-items">User View</Link>
              </li>
              {invoice && (
                <li className="nav-item">
                  <Link to="/invoice">View Invoice</Link>
                </li>
              )}
            </ul>
          </nav>
        </header>
        <main>
          <Routes>
            <Route path="/add-item" element={<ItemForm addItem={addItem} />} />
            <Route path="/items" element={<ItemList items={items} />} />
            <Route
              path="/edit-item"
              element={<EditItemForm onUpdate={updateItemHandler} />}
            />
            <Route
              path="/create-invoice"
              element={
                items.length > 0 ? (
                  <CreateInvoice createInvoice={createInvoiceCallback} />
                ) : (
                  <p>Please add items first.</p>
                )
              }
            />
            <Route
              path="/available-items"
              element={<AvailableItems addToCart={addToCart} />}
            />
            <Route
              path="/cart"
              element={<Cart cartItems={cartItems} />}
            />
            <Route
              path="/invoice"
              element={invoice ? <InvoiceDisplay invoice={invoice} /> : <p>No invoice created yet.</p>}
            />
            <Route
              path="/"
              element={
                <div className="home">
                  <h2>Welcome to the Hotel Billing System</h2>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
