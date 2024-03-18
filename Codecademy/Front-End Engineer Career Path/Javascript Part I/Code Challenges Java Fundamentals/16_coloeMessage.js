// Create function below
function colorMessage(favoriteColor, shirtColor) {
    if(favoriteColor === shirtColor) {
      return 'The shirt is your favorite color!';
    } else {
      return 'That is a nice color.';
    }
  }
  
  console.log(colorMessage('white', 'white')),
  
  console.log(colorMessage('white', 'blue'));