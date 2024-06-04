// src/components/ItemList.js
import React, { useEffect, useState } from 'react';
import { getAllItems } from '../api';
import './ItemList.css'; // Import the CSS file for styling

function ItemList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    getAllItems()
      .then((items) => {
        setItems(items);
      })
      .catch((error) => {
        console.error('There was an error fetching the items!', error);
      });
  }, []);

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
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr key={index}>
              <td>{item.itemName}</td>
              <td>{item.itemCode}</td>
              <td>Rs. {item.itemPrice}</td>
              <td>{item.status === 'Available' ? 'Available' : 'Not Available'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ItemList;
