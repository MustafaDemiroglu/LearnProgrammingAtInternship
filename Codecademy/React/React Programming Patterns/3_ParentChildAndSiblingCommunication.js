function Presentational(props) {
    const buttonClickHandler = () => {
      props.isActive = !props.isActive
    }
    // rest of code
}


// For Example
function Container() {
    const [isActive, setIsActive] = useState(false);                              
                                  
    return (
      <>
        <Presentational active={isActive} toggle={setIsActive}/>
        <OtherPresentational active={isActive}/>
      </>
      );                          
    }
                          
  function Presentational(props) {
    return (
      <h1>Engines are {props.active}</h1>
      <button onClick={() => props.toggle(!props.active)}>Engine Toggle</button>
    );
  }
                              
  function OtherPresentational(props) {
    // render...
}