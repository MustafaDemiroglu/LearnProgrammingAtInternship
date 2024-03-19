/ Write your code here:
function greetAliens(arr) {
  for(const word of arr) {
    console.log(`Oh powerful ${word}, we humans offer our unconditional surrender!`);
  }
}


// When you're ready to test your code, uncomment the below and run:

const aliens = ["Blorgous", "Glamyx", "Wegord", "SpaceKing"];

greetAliens(aliens);