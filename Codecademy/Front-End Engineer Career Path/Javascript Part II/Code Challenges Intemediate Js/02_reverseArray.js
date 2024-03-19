function reverseArray(arr) {
    let reversedArray = [];
    for (let i = arr.length - 1; i >= 0; i--) {
      reversedArray.push(arr[i]);
    }
    return reversedArray;
  }
  
  // Test the function
  const sentence = ['sense.','make', 'all', 'will', 'This'];
  console.log(reverseArray(sentence));
  // Output should be ['This', 'will', 'all', 'make', 'sense.']