import {tetrominoes, step} from "./Tetrominoes.js";

/* Dark mode implementation */
let darkModeBtn = document.getElementById("dark-mode-btn");
darkModeBtn.addEventListener("click",toggleDarkMode);

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}


// let playButton = document.getElementById("play-btn");
// playButton.addEventListener("click",handlePlay);

/* Game logic */
const board = document.getElementById("board-game");
// Create 200 divs to form the game board
for(let i = 0; i < 210; i++) {
  let div = document.createElement("div");
  if (i < 200) {
    div.classList.add("node");
  } else {
    // add 20 div at the bottom for detecting collision
    div.classList.add("touched");
  }
  board.appendChild(div);
}

const grid = Array.from(document.querySelectorAll("#board-game div"))
console.log(grid);

const startPosition = 4;
let currentPosition = startPosition;

let current = tetrominoes[Math.floor((Math.random()*tetrominoes.length))][0];

const draw = () => {
  current.forEach((element, index) => {
    grid[currentPosition + element].classList.add("tetromino");
    console.log(element);
  })
}

const undraw = () => {
  current.forEach((element, index) => {
    grid[currentPosition + element - step].classList.remove("tetromino");
  })
}

let x;
const test = () => {
  x = setInterval(() => {
    if(currentPosition > step) {
      undraw();
    }
    draw();
    currentPosition += step;
    detectCollision();
  },500);
}

const detectCollision = () => {
  if (current.some((element, index) =>
                                  grid[currentPosition + element].classList.contains("touched"))) {
    current.forEach((element, index) => {
      grid[currentPosition + element - step].classList.add("touched");
    })
    currentPosition = 4;
    let temp = current;
    current = tetrominoes[Math.floor((Math.random()*tetrominoes.length))][0];
    while (current === temp) {
      current = tetrominoes[Math.floor((Math.random()*tetrominoes.length))][0];
    }
  }
}
//test();

  /*
    left: 37
    right: 39
    up: 38
    down: 40
    space: 32
  */
const handleKeyDown = (event) => {
  if (event.keyCode === 37) {

  }
  else if (event.keyCode === 39) {
    console.log("right");
  }
  else if (event.keyCode === 40) {
    clearInterval(x);
    if(currentPosition > step) {
      undraw();
    }
    draw();
    currentPosition += step;
    detectCollision();
    test();
  }
  console.log(currentPosition);
}
window.addEventListener("keydown", handleKeyDown);
