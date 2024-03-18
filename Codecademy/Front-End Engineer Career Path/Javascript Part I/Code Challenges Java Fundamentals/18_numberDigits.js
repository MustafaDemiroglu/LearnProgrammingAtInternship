// Create function here 
const numberDigits = x => {
    if(x>=0 && x<=9) {
      return `One digit: ${x}`
    } else if (x>=10 && x<=99) {
      return `Two digit: ${x}`
    } else if (x>=100 && x<=999) {
      return `Three digit: ${x}`
    } else if (x<0) {
      return `The Number: ${x}`
    }
  }
  
  console.log(numberDigits(5))
  console.log(numberDigits(12))
  console.log(numberDigits(202))
  console.log(numberDigits(-202))