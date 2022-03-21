const gameContainer = document.getElementById("game");

// initiliaze varibale to determine if user wins
const finalPairs = [];

// create guess count element for display and game logic
let guessCount = document.querySelector(".guesses");
let userGuessesSpan = document.createElement("span");
let userGuesses = 5;
userGuessesSpan.innerText = userGuesses;
guessCount.append(userGuessesSpan);

// create updates element for displaying updates to user
let updates = document.querySelector(".updates");

let rules = document.querySelector(".rules");

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

// colors can be added in pairs dynamically
// as long as they are named identically!
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "magenta",
  "magenta",
  "grey",
  "grey",
  "pink",
  "pink",
  "brown",
  "brown",
];

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

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
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

let firstClick;
let secondClick;
let clickCount = 0;
let numChecker = [];

function handleCardClick(e) {
  clickCount++;

  // if player selects one card...
  if (clickCount === 1) {
    firstClick = e.target;
    firstClick.style.backgroundColor = e.target.classList[0];
    firstClick.classList.toggle("back");
    //update user
    updates.innerText = `1st pick: ${firstClick.classList[0]}`;
    // when players selects second card...
  } else if (clickCount === 2) {
    secondClick = e.target;
    secondClick.classList.toggle("back");
    secondClick.style.backgroundColor = e.target.classList[0];
    // update user
    updates.innerText = `2nd pick: ${firstClick.classList[0]}`;

    clickCount++;
    // check if selections are same tile
    if (
      firstClick.classList[0] === secondClick.classList[0] &&
      firstClick.dataset.pairNum === secondClick.dataset.pairNum
    ) {
      clickCount = 1;
      // update user
      updates.innerText = `Those are the same tile silly.`;
      firstClick.classList.toggle("back");
      // check if selections werent a match, take a guess away if so, hide cards
    } else if (
      firstClick.dataset.pairNum !== secondClick.dataset.pairNum &&
      firstClick.classList[0] === secondClick.classList[0]
    ) {
      clickCount = 0;
      userGuesses++;
      userGuessesSpan.innerText = userGuesses;
      // update win condition
      finalPairs.push(firstClick.classList[0]);
      // add class of open to card
      firstClick.classList.add("open");
      secondClick.classList.add("open");
      // update user
      updates.innerText = `That was a match (take an extra guess!)`;
      // check if player selected the same tile
    } else if (firstClick.classList !== secondClick.classList) {
      userGuesses--;
      userGuesses >= 0
        ? (userGuessesSpan.innerText = userGuesses)
        : (userGuessesSpan.innerText = "X");
      // update user
      updates.innerText = `2nd pick: ${secondClick.classList[0]}`;
      // hides cards again after two seconds
      setTimeout(function () {
        firstClick.classList.toggle("back");
        secondClick.classList.toggle("back");
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
  if (userGuesses >= 0 && finalPairs.length >= COLORS.length / 2) {
    updates.innerText = "YOU WIN!!!!";
  } else if (userGuesses < 0) {
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

// BUTTONS below game
let buttons = document.querySelector(".buttons");

buttons.addEventListener("click", function (e) {
  // start button that initialializes/reinitializes game
  if (e.target.classList[0] === "start") {
    console.log(e.target.innerText);
    gameContainer.classList.add("hidden");
    gameContainer.classList.toggle("hidden");
    gameContainer.replaceChildren();
    shuffledColors = shuffle(COLORS);
    userGuesses = 5;
    userGuessesSpan.innerText = "5";
    numChecker = [];
    clickCount = 0;
    //update user
    updates.innerText = "You started a new game!";
    createDivsForColors(shuffledColors);
    rules.style.display = "none";
    // change name of start to reset when game starts
    e.target.innerText = "reset";
    // toggle home button on
    let homeButton = document.querySelector(".home");
    // toggle home button on
    homeButton.classList.toggle("hidden");
  } else if (e.target.classList === "home") {
    console.log(e.target.innerText);
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
  // else if (e.target.classList.contains("start")) {
  //   console.log("pressed reset: ", e.target.innerText);
  //   gameContainer.replaceChildren();
  //   shuffledColors = shuffle(COLORS);
  //   userGuesses = 5;
  //   userGuessesSpan.innerText = "5";
  //   numChecker = [];
  //   clickCount = 0;
  //   //update user
  //   updates.innerText = "You started a new game!";
  //   createDivsForColors(shuffledColors);
  //   rules.style.display = "none";
  //   // change name of start to reset when game starts
  // }
});
