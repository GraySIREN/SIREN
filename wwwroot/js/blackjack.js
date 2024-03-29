﻿let dealerSum = 0;
let yourSum = 0;
let dealerAceCount = 0;
let yourAceCount = 0;
let hidden;
let deck;
let canHit = true;
let roundNumber = 1;
let buyInAmount = 0;
var bankRoll = 0;
var betAmount = 0;
var netWinLoss = 0;
var roundWinLoss = 0;

document.getElementById("roundNumber").innerHTML = "Round: " + roundNumber;
document.getElementById("netWinLoss").innerHTML = "Net Win/Loss: $0"

window.onload = function () {
    promptBuyIn();
    document.getElementById("results").innerHTML = "Please submit your bet now.";
    // Need to create a function, or edit existing, to force player to submit a bet before anything else can be done in the game.

    buildDeck();
    shuffleDeck();
    startGame();
}

function submitBet() {
    var betAmountDropDown = document.getElementById("betAmountDropdown");
    betAmount = parseFloat(betAmountDropDown.value);

    if (!isNaN(betAmount) && betAmount > 0) {
        document.getElementById("results").innerHTML = "Bet amount: $" + betAmount + ".";
        console.log("User bets $" + betAmount + ".");
    }
    else {
        alert("Please submit a valid bet amount.");
    }
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    //console.log("DECK: " + deck);
}

//In dealing cards at the start, need to define if I want all dealer cards dealt first, or after user has hit Stand.//

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    //Comment out once deployed
    console.log("HIDDEN: " + hidden);

    setTimeout(function () {
        dealCardAnimation("dealer-cards", hidden);
    }, 500); 

    setTimeout(function () {
        dealCardAnimation("dealer-cards", deck.pop());
    }, 1000); 

    setTimeout(function () {
        dealCardAnimation("your-cards", deck.pop());
    }, 2000); 

    setTimeout(function () {
        dealCardAnimation("your-cards", deck.pop());
    }, 2500);

    //Comment out once deployed
    setTimeout(function () {
        console.log("Dealer Sum: " + dealerSum);
        console.log("Your Sum: " + yourSum);
    }, 3000);

    document.getElementById("hit").removeEventListener("click", hit);
    document.getElementById("stand").removeEventListener("click", stand);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand);
}

function hit() {
    if (!canHit) {
        return;
    }

    let message = "";

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "/cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
        document.getElementById("results").innerText = "You Bust! Minus $" + betAmount;
        bankRoll = bankRoll - betAmount;
        roundWinLoss = (betAmount * -1);
        document.getElementById("bankRoll").innerText = "Bankroll: $" + bankRoll;
        calculateNetWinLoss();

    } else if (yourSum == 21) {
        canHit = false;
        stand();
    }

    document.getElementById("your-sum").innerText = yourSum;

}

function stand() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);
    netWinLoss;

    let message = "";

    if (yourSum > 21) {
        canHit = false;
        message = "You Bust! Minus $" + betAmount;
        roundWinLoss = (betAmount * -1);
        bankRoll = bankRoll - betAmount;
        document.getElementById("bankRoll").innerText = "Bankroll: $" + bankRoll;
        console.log(message);

    }
    else if (dealerSum > 21) {
        message = "You win! Plus: $" + (betAmount * 2);
        roundWinLoss = (betAmount * 2);
        bankRoll = bankRoll + (betAmount * 2);
        document.getElementById("bankRoll").innerText = "Bankroll: $" + bankRoll;
        console.log(message);

    }
    else if (yourSum == dealerSum) {
        message = "Tie! All bets returned.";
        bankRoll = bankRoll + betAmount;
        roundWinLoss = 0;
        document.getElementById("bankRoll").innerText = "Bankroll: $" + bankRoll;
        console.log(message);

    }
    else if (yourSum > dealerSum) {
        message = "You Win! Plus: $" + (betAmount * 2);
        roundWinLoss = (betAmount * 2);
        bankRoll = bankRoll + (betAmount * 2);
        document.getElementById("bankRoll").innerText = "Bankroll: $" + bankRoll;
        console.log(message);

    }
    else if (yourSum < dealerSum) {
        message = "You Lose! Minus: $" + betAmount;
        roundWinLoss = (betAmount * -1);
        bankRoll = bankRoll - betAmount;
        document.getElementById("bankRoll").innerText = "Bankroll: $" + bankRoll;
        console.log(message);

    }

    calculateNetWinLoss();
    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}

document.getElementById("play-again-btn").addEventListener("click", resetGame);

function resetGame() {
    console.log("Resetting game...");
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    canHit = true;
    roundNumber++;

    document.getElementById("dealer-cards").innerHTML = "";
    document.getElementById("your-cards").innerHTML = "";
    document.getElementById("results").innerText = "Please submit your bet now.";
    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("your-sum").innerText = "";

    let hiddenCardImg = document.createElement("img");
    hiddenCardImg.src = "/cards/BACK.png";
    document.getElementById("dealer-cards").appendChild(hiddenCardImg);

    document.getElementById("roundNumber").innerText = "Round: " + roundNumber;
    console.log("Round: " + roundNumber);
    console.log("Bankroll: $" + bankRoll);

    buildDeck();
    shuffleDeck();
    startGame();

    console.log(yourSum);

    document.getElementById("hit").removeEventListener("click", hit);
    document.getElementById("stand").removeEventListener("click", stand);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stand").addEventListener("click", stand);
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}

function promptBuyIn() {

    var buyInAmount = window.prompt("How much would you like to buy in for?");

    if (buyInAmount !== null) {
        buyInAmount = parseFloat(buyInAmount);

        if (!isNaN(buyInAmount) && buyInAmount > 0) {
            document.getElementById("results").innerHTML = "You've bought in for $" + buyInAmount + ". Goodluck!";
        } else {
            alert("Please enter a valid buy-in amount.");
            promptBuyIn();
        }
    }

    bankRoll = buyInAmount;
    document.getElementById("bankRoll").innerText = "Bankroll: $" + bankRoll;
    console.log("Buy-in = $" + buyInAmount);
}

function calculateNetWinLoss() {
    netWinLoss = netWinLoss + roundWinLoss;
    console.log(netWinLoss);
    document.getElementById("netWinLoss").innerHTML = "Net Win/Loss = $" + netWinLoss;
}

function dealCardAnimation(containerId, card) {
    let container = document.getElementById(containerId);
    let cardImg = document.createElement("img");
    cardImg.src = "/cards/" + card + ".png";
    cardImg.classList.add("card");

    let cardRow;
    if (container.getElementsByClassName("card-row").length === 0 || container.lastElementChild.children.length >= 3) {
        cardRow = document.createElement("div");
        cardRow.classList.add("card-row");
        container.appendChild(cardRow);
    } else {
        cardRow = container.lastElementChild;
    }

    cardRow.appendChild(cardImg);
    void cardImg.offsetWidth;
    cardImg.style.animation = "dealAnimation 0.5s forwards";

    if (containerId === "your-cards") {
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-sum").innerText = yourSum;
    } else if (containerId === "dealer-cards") {
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
    }
}