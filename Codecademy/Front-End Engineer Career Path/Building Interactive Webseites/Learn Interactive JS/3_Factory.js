const monsterFactory = (name, age, energySource, catchPhrase) => {
    return { 
      name: name,
      age: age, 
      energySource: energySource,
      scare() {
        console.log(catchPhrase);
      } 
    }
};


const robotFactory = (model, mobile) => {
    return { 
      model: model, 
      mobile: mobile,
      beep() {
        console.log('Beep Boop');
      } 
    }
  };
  const tinCan = robotFactory('P-500', true);
  tinCan.beep();
  
  const ghost = monsterFactory('Ghouly', 251, 'ectoplasm', 'BOO!');
  ghost.scare(); // 'BOO!'
  