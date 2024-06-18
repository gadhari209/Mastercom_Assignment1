import React from 'react';
import './Cart.css';

function Cart({ cartItems, setCartItems, createInvoice }) {
  const handleQuantityChange = (itemCode, delta) => {
    setCartItems(prevState =>
      prevState.map(item =>
        item.itemCode === itemCode
          ? { ...item, quantity: item.quantity + delta, totalPrice: (item.quantity + delta) * item.itemPrice }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const totalAmount = cartItems.reduce((acc, item) => acc + item.totalPrice, 0);

  return (
    <div className="cart-container">
      <h2 className="cart-heading">Cart Items</h2>
      {cartItems.length > 0 ? (
        <div>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Item Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index}>
                  <td>{item.itemName}</td>
                  <td>{item.quantity}</td>
                  <td>Rs. {item.itemPrice}</td>
                  <td>Rs. {item.totalPrice}</td>
                  <td>
                    <button onClick={() => handleQuantityChange(item.itemCode, -1)}>-</button>
                    <button onClick={() => handleQuantityChange(item.itemCode, 1)}>+</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="cart-total">Total: Rs. {totalAmount}</p>
          <button className="create-invoice-btn" onClick={createInvoice}>Create Invoice</button>
        </div>
      ) : (
        <p>No items in the cart</p>
      )}
    </div>
  );
}

export default Cart;
