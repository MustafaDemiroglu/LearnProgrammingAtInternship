// The keys and notes variables store the piano keys
const keys = ['c-key', 'd-key', 'e-key', 'f-key', 'g-key', 'a-key', 'b-key', 'high-c-key', 'c-sharp-key', 'd-sharp-key', 'f-sharp-key', 'g-sharp-key', 'a-sharp-key'];
const notes = [];
keys.forEach(function(key){
  notes.push(document.getElementById(key));
})

// Write named functions that change the color of the keys below
function keyPlay(event) { 
  event.target.style.backgroundCoor = 'green';
}

function keyReturn(event) { 
  event.target.style.backgroundColor = '';
}
// Write a named function with event handler properties
function assignEventHandlers(note) {
  note.addEventListener('mousedown', keyPlay);
  note.addEventListener('mouseup', keyReturn);
}

// Write a loop that runs the array elements through the function
notes.forEach(assignEventHandlers);

// These variables store the buttons that progress the user through the lyrics
const nextOne = document.getElementById('first-next-line');
const nextTwo = document.getElementById('second-next-line');
const nextThree = document.getElementById('third-next-line');
const startOver = document.getElementById('fourth-next-line');

// This variable stores the '-END' lyric element
const lastLyric = document.getElementById('column-optional');

// These statements are "hiding" all the progress buttons, but the first one
nextTwo.hidden = true;
nextThree.hidden = true;
startOver.hidden= true;

// Write anonymous event handler property and function for the first progress button

nextOne.onclick = function() {
  // Show nextTwo button and hide other buttons
  nextTwo.hidden = false;
  nextOne.hidden = true; 
  nextThree.hidden = true;
  startOver.hidden = true;

  // Change the content of letter-note-five to 'D'
  document.getElementById('letter-note-five').textContent = 'D';

  // Change the content of letter-note-six to 'C'
  document.getElementById('letter-note-six').textContent = 'C';
}

// Write anonymous event handler property and function for the second progress button
nextTwo.onclick = function() {
  // Show nextThree button and hide nextTwo button
  nextThree.hidden = false;
  nextTwo.hidden = true; 

  // Hide nextOne button and startOver button
  nextOne.hidden = true;
  startOver.hidden = true;

  // Change the content of word-five to "DEAR"
  document.getElementById('word-five').textContent = 'DEAR';

  // Change the content of word-six to "FRI-"
  document.getElementById('word-six').textContent = 'FRI-';

  // Show the lastLyric element
  lastLyric.style.display = 'inline-block';

  // Change the music notes
  document.getElementById('letter-note-three').textContent = 'G';
  document.getElementById('letter-note-four').textContent = 'E';
  document.getElementById('letter-note-five').textContent = 'C';
  document.getElementById('letter-note-six').textContent = 'B';
}

// Write anonymous event handler property and function for the third progress button
nextThree.onclick = function() {
  // Hide nextTwo button and nextOne button
  nextTwo.hidden = true;
  nextOne.hidden = true; 

  // Hide nextThree button
  nextThree.hidden = true;

  // Show startOver button
  startOver.hidden = false;

  // Change the content of word-one to "HAP-"
  document.getElementById('word-one').textContent = 'HAP-';

  // Change the content of word-two to "PY"
  document.getElementById('word-two').textContent = 'PY';

  // Change the content of word-three to "BIRTH"
  document.getElementById('word-three').textContent = 'BIRTH';

  // Change the content of word-four to "DAY"
  document.getElementById('word-four').textContent = 'DAY';

  // Change the content of word-five to "TO"
  document.getElementById('word-five').textContent = 'TO';

  // Change the content of word-six to "YOU!"
  document.getElementById('word-six').textContent = 'YOU!';

  // Change the content of letter-note-one to "F"
  document.getElementById('letter-note-one').textContent = 'F';

  // Change the content of letter-note-two to "F"
  document.getElementById('letter-note-two').textContent = 'F';

  // Change the content of letter-note-three to "E"
  document.getElementById('letter-note-three').textContent = 'E';

  // Change the content of letter-note-four to "C"
  document.getElementById('letter-note-four').textContent = 'C';

  // Change the content of letter-note-five to "D"
  document.getElementById('letter-note-five').textContent = 'D';

  // Change the content of letter-note-six to "C"
  document.getElementById('letter-note-six').textContent = 'C';

  // Hide the lastLyric element
  lastLyric.style.display = 'none';
}

// This is the event handler property and function for the startOver button
startOver.onclick = function() {
  nextOne.hidden = false;
  startOver.hidden = true;
   document.getElementById('word-one').innerHTML = 'HAP-';
  document.getElementById('letter-note-one').innerHTML = 'G';
  document.getElementById('word-two').innerHTML = 'PY';
  document.getElementById('letter-note-two').innerHTML = 'G';
  document.getElementById('word-three').innerHTML = 'BIRTH-';
  document.getElementById('letter-note-three').innerHTML = 'A';
  document.getElementById('word-four').innerHTML = 'DAY';
  document.getElementById('letter-note-four').innerHTML = 'G';
  document.getElementById('word-five').innerHTML = 'TO';
  document.getElementById('letter-note-five').innerHTML = 'C';
  document.getElementById('word-six').innerHTML = 'YOU!';
  document.getElementById('letter-note-six').innerHTML = 'B';
}