// Fine in HTML with a slash:
<br />

// Also fine, without the slash:
<br>

// Fine in JSX:
<br />

// NOT FINE AT ALL in JSX:
<br></br>



const profile = (
  <div>
    <h1>John Smith</h1>
    <img src="images/john.png"/>
    <article>
      My name is John Smith.
      <br/>
      I am a software developer.
      <br/>
      I specialize in creating React applications.
    </article>
  </div>
);