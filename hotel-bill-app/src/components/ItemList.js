import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ItemList.css'; // Import the CSS file for styling

function ItemList() {
  const [items, setItems] = useState([]);
  const [editItem, setEditItem] = useState(null);
  const [editedPrice, setEditedPrice] = useState('');
  const [editedStatus, setEditedStatus] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('http://localhost:8080/items');
      setItems(response.data);
    } catch (error) {
      console.error('There was an error fetching the items!', error);
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setEditedPrice(item.itemPrice);
    setEditedStatus(item.status);
  };

  const handleDelete = async (itemCode) => {
    try {
      await axios.delete(`http://localhost:8080/items/${itemCode}`);
      fetchItems(); // Refresh the item list
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert('Cannot delete item. It is referenced in invoice details.');
      } else {
        console.error('There was an error deleting the item!', error);
      }
    }
  };
  

  const handleSave = async () => {
    try {
      const updatedItem = {
        ...editItem,
        itemPrice: editedPrice,
        status: editedStatus,
      };
      await axios.put(`http://localhost:8080/items/${editItem.itemCode}`, updatedItem);
      fetchItems(); // Refresh the item list
      setEditItem(null);
    } catch (error) {
      console.error('There was an error updating the item!', error);
    }
  };

  return (
    <div className="item-list-container"> {/* Apply a container class */}
      <h2 className="item-list-heading">Item List</h2> {/* Apply a heading class */}
      <table className="item-table"> {/* Apply a table class */}
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.itemName}</td>
              <td>{item.itemCode}</td>
              <td>
                {editItem && editItem.itemCode === item.itemCode ? (
                  <input
                    type="number"
                    value={editedPrice}
                    onChange={(e) => setEditedPrice(e.target.value)}
                  />
                ) : (
                  `Rs. ${item.itemPrice}`
                )}
              </td>
              <td>
                {editItem && editItem.itemCode === item.itemCode ? (
                  <select
                    value={editedStatus}
                    onChange={(e) => setEditedStatus(e.target.value)}
                  >
                    <option value="Available">Available</option>
                    <option value="Not Available">Not Available</option>
                  </select>
                ) : (
                  item.status === 'Available' ? 'Available' : 'Not Available'
                )}
              </td>
              <td>
  {editItem && editItem.itemCode === item.itemCode ? (
    <>
      <button className="save-btn" onClick={handleSave}>Save</button>
      <button className="cancel-btn" onClick={() => setEditItem(null)}>Cancel</button>
    </>
  ) : (
    <>
      <button className="edit-btn" onClick={() => handleEdit(item)}>Edit</button>
      <button className="delete-btn" onClick={() => handleDelete(item.itemCode)}>Delete</button>
    </>
  )}
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ItemList;
