import React, { useState } from "react";

function FoodOrderForm() {
  
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [adress, setAdress] = useState('');
  const [order, setOrder] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Order Successful!\n\nYour order was: ${order}.\n\nPlease show your confirmation number for pickup.`);
  }  

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="name">Name</label>
      <input 
        id="name"
        name="name"
        type="text" 
        value={name} 
        onChange={(e) => setName(e.target.value)}/>
      <label htmlFor="phone">Phone</label>
      <input 
        id="phone" 
        name="phone"
        type="number"
        value={phone} 
        onChange={(e) => setPhone(e.target.value)}/>
      <label htmlFor="adress">Adress</label>
      <input 
        id="adress"
        name="adress"
        type="text" 
        value={adress} 
        onChange={(e) => setAdress(e.target.value)}/>
      <label htmlFor="order">Order</label>
      <input 
        id="order" 
        name="order"
        type="text"
        value={order} 
        onChange={(e) => setOrder(e.target.value)}/>
      <button type="submit" >Submit Order</button>
    </form>
  )
}

export default FoodOrderForm;