// App.js sould be imported
import './App.css'
// file Name 
fileName.module.css
// how to import style im  App
import styles from './fileName.module.css'
// 
<div className={styles.divStyle}></div>


// AttentionGrabber.js
import React from 'react';

import styles from './styles/AttentionGrabber.module.css';

function AttentionGrabber() {
  return (
    <>
      <h1 className={styles.h1}>Hi! Welcome to my portfolio.</h1>
      <p>I'm a developer who likes designing user-friendly websites.</p>
    </>
  )
}

export default AttentionGrabber

// Home.js
import React from 'react';

import  AttentionGrabber from './AttentionGrabber';
import styles from './styles/Home.module.css';

function Home() {
  return (
    <div className={styles.div}>
      <AttentionGrabber />
      <footer>Codey Cademy: Full-Stack Developer</footer>
    </div>
  );
}

// export default Home