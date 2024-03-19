// Write your code here:
function convertToBaby(arr){
  let newArr = [];
  for(const word of arr){
    newArr.push(`baby ${word}`);
  }
  return newArr;
}

// When you're ready to test your code, uncomment the below and run:

const animals = ['panda', 'turtle', 'giraffe', 'hippo', 'sloth', 'human'];

console.log(convertToBaby(animals)) 