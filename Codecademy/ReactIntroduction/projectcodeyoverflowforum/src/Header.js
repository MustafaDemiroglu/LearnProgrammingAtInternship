import React from 'react';

function Header (props) {
  return (
    <div>
    <img src={props.profileImg}/>
    <h1>{props.userName}</h1>
    </div>
  );
}

export default Header;