var x = 0, y = 0;
var stepSize = 50.0;
var fontSizeMin = 30;
var fontSizeMax = 100;
var proximityThreshold = 100;
var letters = "Manifiesto del Poeta del Lenguaje de Programacion: la poesia es codigo"; 
var counter = 0;
var angleDistortion = 0.0;
var pastPositions = [];
var isWalking = false;
var currentFont = 0;
var currentColor = 0;
var fonts = [];
var colors = [
  ['#000000', '#FFFFFF'],
  ['#FF0619', '#8C1251'],
  ['#4E109B', '#00EAE4'],
  ['#74180D', '#FF0506'],
  ['#FC1D00', '#FFAF01'],
  ['#62D172', '#FF2C67'],
  ['#42FFEA', '#F90D00'],
  ['#EF8100', '#F2C400'],
  ['#9DF000', '#FF1720'],
  ['#FFFFFF', '#000000']
];

function preload() {
  fonts.push(loadFont("Ferrari-Regular.ttf"));
  fonts.push(loadFont("Cairo.ttf"));
  fonts.push(loadFont("Garamond.ttf"));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(colors[currentColor][0]);
  smooth();
  cursor(CROSS);

  textAlign(LEFT);
  fill(colors[currentColor][1]);
  textFont(fonts[2]);
  textSize(30);
  text("La poesía es código.",100,100);
  text("poesía",128,130);
  text("código",218,130);  
  text("poesía",128,160);
  text("código",238,160);    
  text("poesía",128,190);
  text("código",258,190);  
  text("poesía",128,220);
  text("código",278,220);  
  text("poesía",128,250);
  text("código",298,250);  
  text("poesía",128,280);
  text("=",243,280);
  text("código",318,280);  
  
}

function draw() {
  if (!isWalking) return;

  var d = dist(x, y, x + random(-stepSize, stepSize), y + random(-stepSize, stepSize));

  textFont(fonts[currentFont]);
  fill(colors[currentColor][1]); // Actualizar el color del texto
  var proximity = dist(x, y, mouseX, mouseY);
  if (proximity < proximityThreshold) {
    textSize(fontSizeMax);
  } else {
    textSize(fontSizeMin + d / 2);
  }

  var newLetter = letters.charAt(counter);
  stepSize = textWidth(newLetter);

  var angle = atan2(random(-1, 1), random(-1, 1));
  var proposedX = x + cos(angle) * stepSize;
  var proposedY = y + sin(angle) * stepSize;

  if (proposedX > width) {
    proposedX = 0;
  } else if (proposedX < 0) {
    proposedX = width;
  }

  if (proposedY > height) {
    proposedY = 0;
  } else if (proposedY < 0) {
    proposedY = height;
  }

  var attempts = 0;
  while (collidesWithPast(proposedX, proposedY) && attempts < 1000) {
    angle = atan2(random(-1, 1), random(-1, 1));
    proposedX = x + cos(angle) * stepSize;
    proposedY = y + sin(angle) * stepSize;
    attempts++;
  }

  if (attempts == 1000) {
    x = random(width);
    y = random(height);
    pastPositions = [];
  } else {
    x = proposedX;
    y = proposedY;
  }

  push();
  translate(x, y);
  rotate(angle + random(angleDistortion));
  text(newLetter, 0, 0);
  pop();

  pastPositions.push({x: x, y: y});

  counter++;
  if (counter > letters.length-1) counter = 0;
}

function collidesWithPast(px, py) {
  for (let pos of pastPositions) {
    if (dist(px, py, pos.x, pos.y) < stepSize) {
      return true;
    }
  }
  return false;
}

function keyPressed() {
  if (keyCode == DELETE || keyCode == BACKSPACE) background(colors[currentColor][0]);
  if (keyCode == UP_ARROW) angleDistortion += 0.1;
  if (keyCode == DOWN_ARROW) angleDistortion -= 0.1;
  if (keyCode == ENTER) {
    //currentFont = (currentFont + 1) % 3; // Rotar entre 0 y 7
    //currentColor = (currentColor + 1) % 9;
    background(colors[currentColor][0]); // Actualizar el color de fondo
  }
  if (keyCode == RIGHT_ARROW) {
    currentFont = (currentFont + 1) % 3;
  }
}

function mousePressed() {
  x = mouseX;
  y = mouseY;
  pastPositions = [{x: x, y: y}];
  isWalking = true;
  currentFont = int(random(0,3));
  currentColor = int(random(0,10));
  background(colors[currentColor][0]);
}
