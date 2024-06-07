import React, { useState } from 'react';
import { createItem } from '../api';
import Swal from 'sweetalert2';
import './ItemForm.css';

function ItemForm({ addItem }) {
  const [item, setItem] = useState({ itemName: '', itemCode: '', itemPrice: '', status: 'Available' });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createItem(item)
      .then((newItem) => {
        addItem(newItem);
        setItem({ itemName: '', itemCode: '', itemPrice: '', status: 'Available' });
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Item added successfully!',
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error creating the item!',
        });
        console.error('There was an error creating the item!', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="itemName"
        value={item.itemName}
        onChange={handleChange}
        placeholder="Item Name"
        required
      />
      <input
        type="text"
        name="itemCode"
        value={item.itemCode}
        onChange={handleChange}
        placeholder="Item Code"
        required
      />
      <input
        type="number"
        name="itemPrice"
        value={item.itemPrice}
        onChange={handleChange}
        placeholder="Item Price"
        required
      />
      <button type="submit" className="add-item-button">Add Item</button>
    </form>
  );
}

export default ItemForm;
