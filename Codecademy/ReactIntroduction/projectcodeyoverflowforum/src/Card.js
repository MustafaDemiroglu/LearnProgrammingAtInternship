import React from 'react';
import Body from './Body';
import Header from './Header';

function Card(props){
  return (
    <div>
      <Header profileImg ={props.commentObject.profileImg} username= {props.commentObject.username}/>
      <Body comment = {props.commentObject.comment}/>
    </div>
  );
};

export default Card;