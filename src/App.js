import {tetrominoes, step} from "./Tetrominoes.js";

/* Dark mode implementation */
let darkModeBtn = document.getElementById("dark-mode-btn");
let score = document.getElementById("score");
let playButton = document.getElementById("play-btn");
let isRunning = false;
let resetButton = document.getElementById("reset-btn");

// Dark Mode
darkModeBtn.addEventListener("click",toggleDarkMode);
function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

// score
score.innerHTML = "0"; // initialize score.innerHTML value

// handle play/pause, reset
const handlePlay = () => {
  isRunning = !isRunning;
  game();
}
playButton.addEventListener("click",handlePlay);

const handleReset = () => {
  isRunning = false;
  clearTimeout(delayCollision);
  clearInterval(gameUpdate);
  undrawHint();
  for(let i = 20; i < 220; i++) {
    if(grid[i].classList.contains("touched")) {
      grid[i].classList.remove("touched");
    }
    if(grid[i].classList.contains("tetromino")) {
      grid[i].classList.remove("tetromino");
    }
    grid[i].style.backgroundColor = "black";
  }
  score.innerHTML = "0";
}
resetButton.addEventListener("click",handleReset);

/*
  Game logic
*/
const board = document.getElementById("board-game");
// Create 200 divs to form the game board
for(let i = 0; i < 230; i++) {
  let div = document.createElement("div");
  if (i < 20) {
    div.classList.add("start-node");
  }
  else if (i >= 20 && i < 220) {
    div.classList.add("node");
  } else if (i >= 220){
    // add 10 div at the bottom for detecting collision
    div.classList.add("touched");
  }
  board.appendChild(div);
}

let grid = Array.from(document.querySelectorAll("#board-game div"))
// console.log(grid);
const startPosition = 4;
let currentPosition = startPosition;
let currentRotation = 0;
let random = Math.floor(Math.random()*tetrominoes.length);
let temp;
temp = random; // needed for handling rotation
let current = tetrominoes[random][currentRotation];
random = Math.floor(Math.random()*tetrominoes.length);
let next = tetrominoes[random][currentRotation];
let gameUpdate;
let isMoveLeft = false;
let isMoveRight = false;
let colors = ["cyan", "purple", "red", "yellow", "green", "blue", "orange", "cyan"];
let timeInterval = 300;
let detectInterval = 250;


/*
  Game loop
*/
const game = () => {
  draw();
  drawHint();
  if (isRunning === true) {
    gameUpdate = setInterval(() => {
      undraw();
      currentPosition += step;
      draw();
      drawHint();
      detectCollision();
      detectTetris();
      detectGameover();
    },timeInterval);
  }
  else if (isRunning === false) {
    clearInterval(gameUpdate);
  }
}

/*
  Draw & Undraw pieces
*/
const draw = () => {
  let color;
  tetrominoes.forEach((element, index) => {
    if (element.includes(current)) {
      color = index;
    }
  })
  current.forEach((element, index) => {
    grid[currentPosition + element].classList.add("tetromino");
    grid[currentPosition + element].style.backgroundColor = colors[color];
  })
}

const undraw = () => {
  current.forEach((element, index) => {
    grid[currentPosition + element].classList.remove("tetromino");
    grid[currentPosition + element].style.backgroundColor = "";
  })
}

// detect collision, if detected, delay 0.3s for users to change their mind
let delayCollision;
const detectCollision = () => {
  if (current.some((element, index) =>
                                  grid[currentPosition + element + step].classList.contains("touched"))) {
      delayCollision = setTimeout(() => {
        if(isMoveRight === true || isMoveLeft === true) {
            // this will cause number 2 bug.
            if (current.some((element, index) =>
            grid[currentPosition + element + step].classList.contains("touched"))) {
              current.forEach((element, index) => {
                grid[currentPosition + element].classList.add("touched");
              })
              currentPosition = 4;
              temp = random;
              currentRotation = 0;
              current = next;
              while (random === temp) {
                random = Math.floor(Math.random()*tetrominoes.length);
              }
              next = tetrominoes[random][currentRotation];
              draw();
            }
            else {
              // do nothing
            }
        }
        else {
          current.forEach((element, index) => {
            grid[currentPosition + element].classList.add("touched");
          })
          currentPosition = 4;
          temp = random;
          currentRotation = 0;
          current = next;
          while (random === temp) {
            random = Math.floor(Math.random()*tetrominoes.length);
          }
          next = tetrominoes[random][currentRotation];
          draw();
          undrawHint();
          drawHint();
        }
      },detectInterval);
    //detectTetris(); dont put detectGameover or detect tetris inside both detectCollision
  }
  isMoveLeft = false;
  isMoveRight = false;
}

/*
  left: 37 --- right: 39 --- up: 38 --- down: 40 --- space: 32
*/
/* Handle key press by user */
 const handleKeyDown = (event) => {
  if (event.keyCode === 37) {
    if (isRunning) {
      moveLeft();
    }
  }
  else if (event.keyCode === 39) {
    if (isRunning) {
      moveRight();
    }
  }
  else if (event.keyCode === 40) {
    if (isRunning) {
      moveDown();
    }
  }
  else if (event.keyCode === 38) {
    if (isRunning) {
      rotate();
    }
  } else if (event.keyCode === 17) { // control
    if(isRunning) {
      moveToBottom();
    }
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
  instantDetectCollision(); // important
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
    instantDetectCollision(); // important

}

const moveDown = () => {
  // check if user move left or right and down immediately and there is a collision
    instantDetectCollision();
    clearTimeout(delayCollision);
    clearInterval(gameUpdate);
    undraw();
    currentPosition += step;
    draw();
    instantDetectCollision();
    //detectTetris(); dont put detectGameover or detect tetris inside both detectCollision
    console.log(isRunning);
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
  current = tetrominoes[temp][currentRotation];
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
  current = tetrominoes[temp][currentRotation];
  draw();
  instantDetectCollision();
}

// after click play btn, window will lose focus => bug, user has to click back into the board
const moveToBottom = () => {
  let check = false;
  undraw();
  while(check === false) {
    if(current.some((element, index) =>
    grid[currentPosition + element + step].classList.contains("touched"))) {
      current.forEach((element, index) => {
        grid[currentPosition + element].classList.add("touched");
        })
        draw();
        clearTimeout(delayCollision);
        currentPosition = 4;
        temp = random;
        console.log(temp, random);
        currentRotation = 0;
        current = next;
        while (random === temp) {
          random = Math.floor(Math.random()*tetrominoes.length);
        }
        next = tetrominoes[random][currentRotation];
        console.log(temp, random);
        // draw();
        check = true;
        undrawHint();
    } else {
      currentPosition += step;
    }
  }
}

const instantDetectCollision = () => {
  if(current.some((element, index) =>
  grid[currentPosition + element + step].classList.contains("touched"))) {
    current.forEach((element, index) => {
    grid[currentPosition + element].classList.add("touched");
    })
    currentPosition = 4;
    temp = random;
    currentRotation = 0;
    current = next;
    while (random === temp) {
      random = Math.floor(Math.random()*tetrominoes.length);
    }
    next = tetrominoes[random][currentRotation];
    draw();
    //detectTetris(); // put it or detectgameover here will cause a nasty bug
    clearInterval(delayCollision);
    isMoveLeft = false;
    isMoveRight = false;
    undrawHint();
    drawHint();
  }
}

/*
  Handle Tetris: detection & clear, gameOver
*/
const detectTetris = () => {
  let countTetris = 0;
  let lines = 0;
  let isTetris = false;

  for (let i = 0; i < 219; i+= 10) {
    const row = [i,i+1,i+2,i+3, i+4, i+5,i+6,i+7,i+8,i+9];
    // bug, but still works (inside collision => in tetris => out => in tetris => tetris, it is blocking program)
    // put this inside instantDetectCollision and detectCollision instead of inside gameUpdate after detect collision to remove the blocking bug
    // what if we put in before detectCollision ??????????????????????
    // this is not a bug, the program is not being blocked, the second in tetris is from the next gameUpdate.
    if(row.every((element) => grid[element].classList.contains("touched","tetromino"))){
      clearInterval(gameUpdate);
      isTetris = true;
      lines +=1;
      row.forEach((element) => {
        grid[element].classList.remove("touched", "tetromino");
        grid[element].style.backgroundColor = "black";
      })
      for(let j = i+9; j > 9; j--) {
        let temp = grid[j-10].style.backgroundColor;
        if(grid[j-10].classList.contains("touched")) {
          grid[j].classList.add("touched");
          grid[j-10].classList.remove("touched");
        }
        if(grid[j-10].classList.contains("tetromino")) {
          grid[j].classList.add("tetromino");
          grid[j-10].classList.remove("tetromino");
        }
        grid[j].style.backgroundColor = temp;
        grid[j-10].style.backgroundColor = "black";
      }
      // clear next position of piece while shifting
      current.forEach((element, index) => {
        grid[currentPosition + element + step*lines].classList.remove("tetromino");
        grid[currentPosition + element + step*lines].style.backgroundColor = "";
      })
    }
    }
    if (lines === 1) {
      countTetris = 100;
    } else if (lines === 2) {
      countTetris = 200;
    } else if (lines === 3) {
      countTetris = 400;
    } else if (lines === 4) {
      countTetris = 800;
    } else {

    }
    score.innerHTML = (parseInt(score.innerHTML) + countTetris).toString();
    lines = 0;
    countTetris = 0;
    if (isTetris) {
      game();
    }
}

const detectGameover = () => {
  const row = [10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29];
  if(currentPosition < 30 && current.some((element, index) =>
  grid[currentPosition + element + step].classList.contains("touched"))) {
    current.forEach((element, index) => {
    grid[currentPosition + element].classList.add("touched");
    })
    console.log("clear timeout");
    isRunning = false;
    clearInterval(gameUpdate);
    clearTimeout(delayCollision);
    //isGameOver = true;
    console.log("over");
  }
}

/*
  Next Piece
*/
// create a matrix 4x4 for mini tetrominoes
const miniTetroes = [[7, 12, 17], // I
                    [7,11,12,13], // T
                    [6,7,12,13], // Z
                    [6,7,8,11,12,13,16,17,18], // O
                    [7,8,11,12], // S
                    [7,12,16,17], // J
                    [7,12,17,18], // L
                    [7, 12, 17]]; // I

const miniBoard = document.getElementById("hint");
for (let i = 0; i < 25; i++) {
  let div = document.createElement("div");
  div.classList.add("mini-node");
  miniBoard.appendChild(div);
}
const miniGrid = Array.from(document.querySelectorAll("#hint div"));

let miniCurrent = miniTetroes[random];
const drawHint = () => {
  miniCurrent = miniTetroes[random]
  miniCurrent.forEach((element) => {
    miniGrid[element].classList.add("miniTetro");

  })
}

const undrawHint = () => {
  //miniCurrent = miniTetroes[random]
  miniCurrent.forEach((element) => {
    miniGrid[element].classList.remove("miniTetro");
    miniGrid[element].style.backgroundColor = "";
  })
}
