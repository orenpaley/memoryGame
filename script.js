const gameContainer = document.getElementById("game");

// initiliaze varibale to determine if user wins
let finalPairs = [];

// create guess count element for display and game logics
let userGuessesSpan = document.createElement("span");
generateGuessCount();

// create updates element for displaying updates to user
let updates = document.querySelector(".updates");

// add home page rules
let rules = document.querySelector(".rules");
generateRules();

let colorCount;

let difficulty;
let difficultySetting = document.querySelectorAll(".difficulty");

// define colors for game
const easyCOLORS = ["red", "blue", "green", "orange", "purple", "grey"];
const mediumCOLORS = ["magenta", "pink", "brown"];
const hardCOLORS = ["yellow", "torquiose", "lightgreen"];
let mergedCOLORS = [];
let shuffledColors = shuffle(mergedCOLORS);

// define various card and click related variables
let firstCardSelect;
let secondCardSelect;
let clickCount = 0;
let numChecker = [];

let buttons = document.querySelector(".buttons");

buttons.addEventListener("click", function (e) {
  if (e.target.classList[0] === "start") {
    getDifficulty();
    startGame();
  }
  if (e.target.classList[0] === "home") {
    goHome();
  }
});

//********  FUNCTIONS ************

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  // snapshot for game board state
  // boardColors = array;
  // console.log(boardColors);
  return array;
}

function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // add a unique class to identify for when player loses
    newDiv.classList.add("gameCard");

    // add a class to toggle board on and off
    newDiv.classList.add("hidden");

    // toggle hidden display
    newDiv.classList.toggle("hidden");

    // give each card a back color
    newDiv.classList.add("back");

    // add pairNum to data attr. to differentiate same tile clicks
    if (numChecker.includes(newDiv.classList[0])) {
      newDiv.dataset.pairNum = "2";
    } else {
      newDiv.dataset.pairNum = "1";
    }

    // push each value to num checker
    numChecker.push(newDiv.classList[0]);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

function handleCardClick(e) {
  clickCount++;

  // if player selects one card...
  if (clickCount === 1) {
    firstCardSelect = e.target;
    firstCardSelect.style.backgroundColor = e.target.classList[0];
    firstCardSelect.classList.toggle("back");
    //update user
    updates.innerText = `1st pick: ${firstCardSelect.classList[0]}`;
    // when players selects second card...
  } else if (clickCount === 2) {
    secondCardSelect = e.target;
    secondCardSelect.classList.toggle("back");
    secondCardSelect.style.backgroundColor = e.target.classList[0];
    // update user
    updates.innerText = `2nd pick: ${firstCardSelect.classList[0]}`;

    clickCount++;
    // check if selections are same tile
    if (firstCardSelect.classList[0] === secondCardSelect.classList[0]) {
      if (
        firstCardSelect.dataset.pairNum === secondCardSelect.dataset.pairNum
      ) {
        clickCount = 1;
        // update user
        updates.innerText = `Those are the same tile silly.`;
        firstCardSelect.classList.toggle("back");
        // check if selections werent a match, take a guess away if so, hide cards
      } else if (
        firstCardSelect.dataset.pairNum !== secondCardSelect.dataset.pairNum
      ) {
        clickCount = 0;
        userGuesses++;
        userGuessesSpan.innerText = userGuesses;
        // update win condition
        finalPairs.push(firstCardSelect.classList[0]);
        // add class of open to card
        firstCardSelect.classList.add("open");
        secondCardSelect.classList.add("open");
        // update user
        updates.innerText = `That was a match (take an extra guess!)`;
        // check if player selected the same tile
      }
    } else if (firstCardSelect.classList !== secondCardSelect.classList) {
      userGuesses--;
      userGuesses >= 0
        ? (userGuessesSpan.innerText = userGuesses)
        : (userGuessesSpan.innerText = "X");
      // update user
      updates.innerText = `2nd pick: ${secondCardSelect.classList[0]}`;
      // hides cards again after two seconds
      setTimeout(function () {
        firstCardSelect.classList.toggle("back");
        secondCardSelect.classList.toggle("back");
        clickCount = 0;
      }, 2000);
    }
    // check if more than two tiles clicked
  } else if (clickCount > 2) {
    //update user
    updates.innerText = "only two tiles at a time!";
  }

  let body = document.querySelector("body");
  // check if game is over - win or loss
  if (userGuesses >= 0 && finalPairs.length >= colorCount) {
    finalPairs = [];
    updates.innerText = "YOU WIN!!!!";
  } else if (userGuesses < 0) {
    finalPairs = [];
    // reveals all remaining non open cards when player loses
    let cards = document.querySelectorAll(".gameCard");
    for (let card of cards) {
      if (!card.classList.contains("open")) {
        card.classList.toggle("back");
        card.style.backgroundColor = card.classList[0];
      }
    }
    //update user
    updates.innerText = "You are out of guesses. /:";
  }
}

function colorCounter(merged) {
  return merged.length / 2;
}

// initiate game board
function startGame() {
  // set number of cards in game based on difficulty value
  if (difficulty === "medium") {
    mergedCOLORS = [];
    mergedCOLORS = [
      ...easyCOLORS,
      ...easyCOLORS,
      ...mediumCOLORS,
      ...mediumCOLORS,
    ];
    colorCount = colorCounter(mergedCOLORS);
    gameContainer.style.gridTemplateColumns = "repeat(6,1fr)";
  } else if (difficulty === "hard") {
    mergedCOLORS = [];
    mergedCOLORS = [
      ...easyCOLORS,
      ...easyCOLORS,
      ...mediumCOLORS,
      ...mediumCOLORS,
      ...hardCOLORS,
      ...hardCOLORS,
    ];
    colorCount = colorCounter(mergedCOLORS);
    gameContainer.style.gridTemplateColumns = "repeat(6,1fr)";
  } else {
    mergedCOLORS = [];
    mergedCOLORS = [...easyCOLORS, ...easyCOLORS];
    colorCount = colorCounter(mergedCOLORS);
    gameContainer.style.gridTemplateColumns = "repeat(4,1fr)";
  }
  // change interface
  for (let i = 0; i < difficultySetting.length; i++) {
    difficultySetting[i].classList.add("hidden");
  }
  buttons.style.flexDirection = "row";
  buttons.style.alignItems = "center";
  gameContainer.classList.add("hidden");
  gameContainer.classList.toggle("hidden");
  gameContainer.replaceChildren();
  shuffledColors = shuffle(mergedCOLORS);
  userGuesses = 5;
  userGuessesSpan.innerText = "5";
  numChecker = [];
  clickCount = 0;
  //update user
  updates.innerText = "You started a new game!";
  createDivsForColors(shuffledColors);
  rules.style.display = "none";
  // change name of start to reset when game starts
  let homeButton = document.querySelector(".home");
  // toggle home button on
  if (homeButton.classList[1]) {
    homeButton.classList.toggle("hidden");
  }
}

function goHome() {
  for (let i = 0; i < difficultySetting.length; i++) {
    difficultySetting[i].classList.toggle("hidden");
  }
  buttons.style.flexDirection = "column";
  let homeButton = document.querySelector(".home");
  // toggle home button off
  homeButton.classList.toggle("hidden");
  rules.style.display = "block";
  gameContainer.classList.toggle("hidden");
  //update user
  updates.innerText = "";
  userGuesses.innerText = "5";
  let start = document.querySelector(".start");
  start.innerText = "start";
}

function generateRules() {
  let instructionText = document.createElement("h3");
  instructionText.innerText = "Welcome to Memory Game.";

  let instructionText2 = document.createElement("h4");
  instructionText2.innerText = "If you find a match, you gain a guess,";

  let instructionText3 = document.createElement("h4");
  instructionText3.innerText = "If you miss, you lose a guess.";

  let instructionText4 = document.createElement("h4");
  instructionText4.innerText = "Good luck.";

  rules.append(instructionText);
  rules.append(instructionText2);
  rules.append(instructionText3);
  rules.append(instructionText4);
}

function generateGuessCount() {
  let guessCount = document.querySelector(".guesses");
  let userGuesses = 5;
  userGuessesSpan.innerText = userGuesses;
  guessCount.append(userGuessesSpan);
}

function getDifficulty() {
  let difficultySetting = document.querySelectorAll("input[name='difficulty']");
  for (let i = 0; i < difficultySetting.length; i++) {
    difficultySetting[i].addEventListener("change", function () {
      console.log(this.value);
      difficulty = this.value;
    });
  }
}
