let humanScore = 0;
let computerScore = 0;
let currentRoundNumber = 1;

// Write your code below:
function generateTarget() {
   return Math.floor(Math.random()*9)+1;
}

function makeGuess(userGuess) {
  // Check is user guess is within range
  if (userGuess < 0 || userGuess > 9) {
    alert("Your guess is out of range. Please enter a number between 0 and 9.");
  }
}

function getAbsoluteDistance(num1, num2) {
  return Math.abs(num1-num2);
}

function compareGuesses(human, computer, secret) {
  makeGuess(human);
  let humanDiff = getAbsoluteDistance(secret, human);
  let computerDiff = getAbsoluteDistance(secret, computer);

  if(humanDiff <= computerDiff) {
    return true;
  } else {
    return false;
  }
}

function updateScore (winner) {
  if(winner === 'human') {
    humanScore++
  } else if (winner === 'computer') {
    computerScore++
  }
}

function advanceRound() {
  currentRoundNumber++;
}