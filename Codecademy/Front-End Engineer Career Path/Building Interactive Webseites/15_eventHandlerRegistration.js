let evetTarget = document.getElementById('targetElement');
EventTarget.addEventListener('click', function() {
    // this block of code willl run when click event happens on eventTarget element
});

function eventHandlerFunction() {
    // this block code will run when click event happens
}
EventTarget.addEventListener('click', eventHandlerFunction);

let readMore = document.getElementById('read-more');
let moreInfo = document.getElementById('more-info');
// Write your code here:
function showInfo() {
  moreInfo.style.display = 'block';
}
readMore.addEventListener('click', showInfo);