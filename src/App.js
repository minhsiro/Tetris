import {tetrominoes, step} from "./Tetrominoes.js";

/* Dark mode implementation */
let darkModeBtn = document.getElementById("dark-mode-btn");
darkModeBtn.addEventListener("click",toggleDarkMode);

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}


let playButton = document.getElementById("play-btn");
let isRunning = false;
const handlePlay = () => {
  isRunning = !isRunning;
  game();
}
playButton.addEventListener("click",handlePlay);



/* Game logic */
const board = document.getElementById("board-game");
// Create 200 divs to form the game board
for(let i = 0; i < 210; i++) {
  let div = document.createElement("div");
  if (i < 200) {
    div.classList.add("node");
  } else {
    // add 10 div at the bottom for detecting collision
    div.classList.add("touched");
  }
  board.appendChild(div);
}

const grid = Array.from(document.querySelectorAll("#board-game div"))
// console.log(grid);

const startPosition = 4;
let currentPosition = startPosition;
let currentRotation = 0;
let random = Math.floor(Math.random()*tetrominoes.length);
let current = tetrominoes[random][currentRotation];
let gameUpdate;
let isMoveLeft = false;
let isMoveRight = false;
let colors = ["cyan", "purple", "red", "yellow", "green", "blue", "orange"];

const draw = () => {
  current.forEach((element, index) => {
    grid[currentPosition + element].classList.add("tetromino");
    grid[currentPosition + element].style.backgroundColor = colors[random];
  })
}

const undraw = () => {
  current.forEach((element, index) => {
    grid[currentPosition + element].classList.remove("tetromino");
    grid[currentPosition + element].style.backgroundColor = "";
  })
}

const game = () => {
  draw();
  if(isRunning === true) {
    gameUpdate = setInterval(() => {
      undraw();
      currentPosition += step;
      draw();
      detectCollision();
      //detectCollision();
    },400);
  } else if (isRunning === false) {
    clearInterval(gameUpdate);
  }
}

// detect collision, if detected, delay 0.3s for users to change their mind
const detectCollision = () => {
  if (current.some((element, index) =>
                                  grid[currentPosition + element + step].classList.contains("touched"))) {
      setTimeout(() => {
        if(isMoveRight === true || isMoveLeft === true) {
          if (current.some((element, index) =>
          grid[currentPosition + element + step].classList.contains("touched"))) {
            current.forEach((element, index) => {
              grid[currentPosition + element].classList.add("touched");
            })
            currentPosition = 4;
            let temp = random;
            currentRotation = 0;
            random = Math.floor(Math.random()*tetrominoes.length);
            current = tetrominoes[Math.floor(random)][currentRotation];
            while (random === temp) {
              random = Math.floor(Math.random()*tetrominoes.length);
              current = tetrominoes[Math.floor(random)][currentRotation];
            }
            draw();
          } else {

          }

        } else {
          current.forEach((element, index) => {
            grid[currentPosition + element].classList.add("touched");
          })
          currentPosition = 4;
          let temp = random;
          currentRotation = 0;
          random = Math.floor(Math.random()*tetrominoes.length);
          current = tetrominoes[Math.floor(random)][currentRotation];
          while (random === temp) {
            random = Math.floor(Math.random()*tetrominoes.length);
            current = tetrominoes[Math.floor(random)][currentRotation];
          }
          draw();
        }
      },200)
  }
}

  /*
    left: 37 --- right: 39 --- up: 38 --- down: 40 --- space: 32
  */
/* Handle key press by user */
 const handleKeyDown = (event) => {
  if (event.keyCode === 37) {
    moveLeft();
  }
  else if (event.keyCode === 39) {
    moveRight();
  }
  else if (event.keyCode === 40) {
    moveDown();
  } else if (event.keyCode === 38) {
    rotate();
  }
}
document.addEventListener("keydown", handleKeyDown);


const moveLeft = () => {
  isMoveLeft = true;
  undraw();
  const isAtLeft = current.some((element,index) =>(currentPosition + element) % step === 0);
  if (!isAtLeft) currentPosition -= 1;
  if (current.some((element, index) => grid[currentPosition + element].classList.contains("touched"))) {
    currentPosition += 1;
  }
  draw();
  detectCollision();
}

const moveRight = () => {
  isMoveRight = true;
  undraw();
  const isAtRight = current.some((element,index) =>(currentPosition + element) % step === step - 1);
  if (!isAtRight) currentPosition += 1;
  if (current.some((element, index) =>
                grid[currentPosition + element].classList.contains("touched"))) {
    currentPosition -= 1;
  }
  draw();
  detectCollision();
}

const moveDown = () => {
    clearInterval(gameUpdate);
    undraw();
    currentPosition += step;
    draw();
    instantDetectCollision();
    game();
  }

const rotate = () => {
  undraw();

  currentRotation += 1;
  if (currentRotation > 3) {
    currentRotation = 0;
  } else if (currentRotation < 0){
    currentRotation = 3;
  }
  current = tetrominoes[random][currentRotation];
  if(current.some((element, index) =>
  grid[currentPosition + element].classList.contains("touched"))) {
    currentRotation -=1;
    if (currentRotation < 0) {
      currentRotation = 3;
    }
  }
  const isAtLeft = current.some((element,index) =>(currentPosition + element) % step === 0);
  const isAtRight = current.some((element,index) =>(currentPosition + element) % step === step - 1);
  if (isAtLeft  && isAtRight ) {
    currentRotation -= 1;
    if (currentRotation < 0) {
      currentRotation = 3;
    }
  }
  current = tetrominoes[random][currentRotation];
  draw();
  instantDetectCollision();
}

const instantDetectCollision = () => {
  if(current.some((element, index) =>
  grid[currentPosition + element + step].classList.contains("touched"))) {
    current.forEach((element, index) => {
    grid[currentPosition + element].classList.add("touched");
    })
    currentPosition = 4;
    let temp = random;
    currentRotation = 0;
    random = Math.floor(Math.random()*tetrominoes.length);
    current = tetrominoes[Math.floor(random)][currentRotation];
    while (random === temp) {
    random = Math.floor(Math.random()*tetrominoes.length);
    current = tetrominoes[Math.floor(random)][currentRotation];
    }
    draw();
  }
}



/* Next Piece */
// create a matrix 4x4 for mini tetrominoes
const miniTetroes = [[1, 5, 9, 13], // I
                    [1,4,5,6], // T
                    [0,1,5,6], // Z
                    [5,6,9,10], // O
                    [1,2,4,5], // S
                    [1,5,8,9], // J
                    [0,4,8,9]]; // L

const miniGrid = document.getElementById("hint");
for (let i = 0; i < 16; i++) {
  let div = document.createElement("div");
  div.classList.add("mini-node");
  miniGrid.appendChild(div);
}


const drawHint = () => {

}

const undrawHint = () => {

}

