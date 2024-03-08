import React, { useState } from 'react';

function Contact() {
  const password = 'swordfish';
  const [authorized, setAuthorized] = useState(false);

  function handleSubmit(e) {
    e.preventDefault(); // Prevents the default form submission behavior
    const enteredPassword = e.target.querySelector('input[type="password"]').value;
    const auth = enteredPassword === password; // Use === for strict equality comparison
    setAuthorized(auth);
  }
  
  const login = (
    <form onSubmit={handleSubmit}> {/* Corrected onSubmit attribute */}
      <input type="password" placeholder="Password" />
      <input type="submit" /> {/* Removed onSubmit from here */}
    </form>
  );

  const contactInfo = (
    <ul>
      <li>client@example.com</li>
      <li>555.555.5555</li>
    </ul>
  );

  return (
    <div id="authorization">
      <h1>Contact</h1>
      {authorized ? contactInfo : login}
    </div>
  );
}

export default Contact;
