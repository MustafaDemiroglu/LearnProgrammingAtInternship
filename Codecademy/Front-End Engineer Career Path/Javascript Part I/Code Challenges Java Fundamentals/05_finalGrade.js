// Write your function here:
const finalGrade = (num1, num2, num3) => {
    if((num1<0 || num1>100) || (num2<0 || num2>100) || (num3<0 || num3>100)) {
      return 'You have entered an invalid grade';
    }
    let average = (num1+num2+num3)/3;
    if(average>=0 && average<=59){
        return 'F';
    } else if(average>=60 && average<=69){
        return 'D';
    } else if(average>=70 && average<=79){
        return 'C';
    } else if(average>=80 && average<=89){
        return 'B';
    } else if(average>=90 && average<=100){
        return 'A';
    } 
  }
  
  
  
  // Uncomment the line below when you're ready to try out your function
  console.log(finalGrade(99, 92, 95)) // Should print 'A'
  
  // We encourage you to add more function calls of your own to test your code!