// Write your function here:
const calculateWeight = (eartWeight, planet) => {
    let weight;
    if (planet === 'Mercury') {
      return eartWeight * 0.378;
    } else if (planet === 'Venus') {
      return eartWeight * 0.907;
    } else if (planet === 'Mars') {
      return eartWeight * 0.377;
    } else if (planet === 'Jupiter') {
      return eartWeight * 2.36;
    } else if(planet === 'Saturn') {
      return eartWeight * 0.916;
    } else {
      return 'Invalid Planet Entry. Try: Mercury, Venus, Mars, Jupiter, or Saturn.';
    }
  }
  
  
  // Uncomment the line below when you're ready to try out your function
  console.log(calculateWeight(100, 'Jupiter')) // Should print 236
  
  // We encourage you to add more function calls of your own to test your code!