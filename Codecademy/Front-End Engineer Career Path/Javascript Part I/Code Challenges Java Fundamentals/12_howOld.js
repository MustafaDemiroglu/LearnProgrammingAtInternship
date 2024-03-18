// Write your function her

const howOld = (age, year) => {
    if (year>2024) {
      let calculatedYear = age + (year-2024);
      return `You will be ${calculatedYear} in the year ${year}`;
    } else if (year<(2024-age)) {
      let calculatedYear = (2024-year) - age;
      return `The year ${year} was ${calculatedYear} years before you were born`;
    } else if (year>(2024-age)) {
      let calculatedYear = age - (2024-year);
      return `You were ${calculatedYear} in the year ${year}`;
    }
  }
  
  
  // Once your function is written, write function calls to test your code!
  
  console.log(howOld(41,1981)); // The year 1981 was 2 years before you were born
  console.log(howOld(41,2002)); // You were 19 in the year 2002
  console.log(howOld(41,2083)); // You will be 100 in the year 2083