import React from 'react';
import styles from './TitleScreen.module.css'

function TitleScreen() {
  return (
    <>
      <div className={styles.menuWrapper}>
        <div className={styles.menuTop}>
          <div>
            <h1>Bread First Search</h1>
          </div>
        </div>
        <div className={styles.menuBottom}>
          <p>
            Think you've got a great eye? Challenge yourself to hunt down slices of bread hidden in a maze!
          </p>
          <button className={styles.btn}>Play</button>
        </div>
      </div>          
    </>
  )
}

export default TitleScreen;
