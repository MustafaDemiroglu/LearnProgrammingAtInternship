// Write your function here:
const tipCalculator = (quality, total) => {
    if (quality==='bad') {
      return total*5/100;
    } else if (quality==='ok') {
      return total*15/100;
    } else if (quality==='good') {
      return total*20/100;
    } else if (quality==='excellent') {
      return total*30/100;
    } else {
      return total*18/100;
    }
  }
  
  // Uncomment the line below when you're ready to try out your function
  console.log(tipCalculator('good', 100)) //should return 20
  console.log(tipCalculator('ok', 100)) //should return 15
  console.log(tipCalculator('bad', 100)) //should return 5
  console.log(tipCalculator('excellent', 100)) //should return 30
  console.log(tipCalculator('goo', 100)) //should return 18
  // We encourage you to add more function calls of your own to test your code!
  