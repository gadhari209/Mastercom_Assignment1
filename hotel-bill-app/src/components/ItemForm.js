  import React, { useState } from 'react';
  import { createItem } from '../api';

  function ItemForm({ addItem }) {
    const [item, setItem] = useState({ itemName: '', itemCode: '', itemPrice: '', status: 'Available' });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setItem((prevItem) => ({
        ...prevItem,
        [name]: value,
      }));
    };

    const handleStatusChange = (e) => {
      setItem((prevItem) => ({
        ...prevItem,
        status: e.target.checked ? 'Available' : 'Not Available',
      }));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      createItem(item)
        .then((newItem) => {
          addItem(newItem);
          setItem({ itemName: '', itemCode: '', itemPrice: '', status: 'Available' });
        })
        .catch((error) => {
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
        <label>
          Available:
          <input
            type="checkbox"
            name="status"
            checked={item.status === 'Available'}
            onChange={handleStatusChange}
          />
        </label>
        <button type="submit">Add Item</button>
      </form>
    );
  }

  export default ItemForm;
