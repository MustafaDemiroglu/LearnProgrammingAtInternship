import React, { useState } from 'react';

export default function EmailTextInput() {
  const [email, setEmail] = useState('');
  const handleChange = (event) => {
    const updatedEmail = event.target.value;
    setEmail(updatedEmail);
  }

  return (
    <input value={email} onChange={handleChange} />
  );
}

// this is simplified 
const handleChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);
}

// to this
const handleChange2 = (event) => setEmail(event.target.value);

// or, using object destructuring, this:
const handleChange3 = ({target}) => setEmail(target.value);



  