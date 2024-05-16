function blooming() {
    var image = document.getElementById('myImage');
    if (image.src.match("normal")) {
      image.src = "flower.png";
    } else {
      image.src = "normal.png";
    } 
  }   