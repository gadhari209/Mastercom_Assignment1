import React, { useState, useEffect } from 'react';
import { updateItem } from '../api'; // Ensure you import updateItem function

function EditItemForm({ item, onUpdate }) {
  const [editedItem, setEditedItem] = useState({ ...item });

  useEffect(() => {
    setEditedItem({ ...item });
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleStatusChange = (e) => {
    setEditedItem((prevItem) => ({
      ...prevItem,
      status: e.target.checked ? 'Available' : 'Not Available',
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editedItem.itemCode) {
      updateItem(editedItem.itemCode, editedItem) // Pass itemCode and itemDetails separately
        .then((updatedItem) => {
          onUpdate(updatedItem);
        })
        .catch((error) => {
          console.error('There was an error updating the item!', error);
        });
    } else {
      console.error('Item code is undefined!');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="itemName"
        value={editedItem.itemName}
        onChange={handleChange}
        placeholder="Item Name"
        required
      />
      <input
        type="text"
        name="itemCode"
        value={editedItem.itemCode}
        onChange={handleChange}
        placeholder="Item Code"
        required
      />
      <input
        type="number"
        name="itemPrice"
        value={editedItem.itemPrice}
        onChange={handleChange}
        placeholder="Item Price"
        required
      />
      <label>
        Available:
        <input
          type="checkbox"
          name="status"
          checked={editedItem.status === 'Available'}
          onChange={handleStatusChange}
        />
      </label>
      <button type="submit">Update Item</button>
    </form>
  );
}

export default EditItemForm;
