let element = document.querySelector('button');
element.onclick = function() { 
  element.style.backgroundColor = 'blue' 
};

let element = document.querySelector('button');
function turnBlue() {
   element.style.backgroundColor = 'blue';
}
element.onclick = turnBlue;

let element = document.querySelector('button');
function turnButtonRed(){
  // Add code to turn button red
  element.style.backgroundColor = 'red';
  element.style.color = 'white';
  element.innerHTML = 'Red Button';
}
element.onclick = turnButtonRed;
