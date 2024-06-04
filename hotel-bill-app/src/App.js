import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ItemForm from './components/ItemForm';
import ItemList from './components/ItemList';
import CreateInvoice from './components/CreateInvoice';
import InvoiceDisplay from './components/InvoiceDisplay';
import EditItemForm from './components/EditItemForm'; // Import EditItemForm component
import { getAllItems, createItem, updateItem } from './api'; // Assuming you have updateItem function in api.js
import './App.css';

function App() {
  const [items, setItems] = useState([]);
  const [invoice, setInvoice] = useState(null);

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
  

  const createInvoiceCallback = (invoice) => {
    setInvoice(invoice);
  };

  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Hotel Bill</h1>
          <nav>
            <ul className="nav-list">
              <li className="nav-item">
                <Link to="/">Home</Link>
              </li>
              <li className="nav-item">
                <Link to="/add-item">Add Item</Link>
              </li>
              <li className="nav-item">
                <Link to="/items">Item List</Link>
              </li>
              <li className="nav-item">
                <Link to="/create-invoice">Create Invoice</Link>
              </li>
              {invoice && (
                <li className="nav-item">
                  <Link to="/invoice">View Invoice</Link>
                </li>
              )}
              {/* Add link for editing items */}
              <li className="nav-item">
                <Link to="/edit-item">Edit Item</Link>
              </li>
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
                  <CreateInvoice />
                ) : (
                  <p>Please add items first.</p>
                )
              }
            />
            <Route
              path="/invoice"
              element={invoice ? <InvoiceDisplay invoice={invoice} /> : <p>No invoice created yet.</p>}
            />
            <Route
              path="/"
              element={
                <div className="home">
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
