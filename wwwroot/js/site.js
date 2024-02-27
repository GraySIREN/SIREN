let dealerSum = 0;
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

document.getElementById("roundNumber").innerHTML = "Round: " + roundNumber;

window.onload = function () {
    promptBuyIn();
    document.getElementById("results").innerHTML = "Please submit your bet now.\nIf you do not press submit, the bet is automatically set at the shown value.";

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
    console.log("DECK: " + deck);
}

//In dealing cards at the start, need to define if I want all dealer cards dealt first, or after user has hit Stand.//

function startGame() {
    shuffleDeck();
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    console.log("HIDDEN: " + hidden);

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log("DEALER: " + dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    console.log("USER: " + yourSum);
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
    cardImg.src = "./cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) {
        canHit = false;
        document.getElementById("results").innerText = "You Bust! Minus $" + betAmount;
        bankRoll = bankRoll - betAmount;
        document.getElementById("bankRoll").innerText = "Bankroll: $" + bankRoll;
    }

    document.getElementById("your-sum").innerText = yourSum;
}

function stand() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;

    let message = "";

    if (yourSum > 21) {
        message = "You Bust! Minus $" + betAmount;
        bankRoll = bankRoll - betAmount;
        document.getElementById("bankRoll").innerText = "Bankroll: $" + bankRoll;
        console.log(message);
    }
    else if (dealerSum > 21) {
        message = "You win! Plus: $" + (betAmount * 2);
        bankRoll = bankRoll + (betAmount * 2);
        document.getElementById("bankRoll").innerText = "Bankroll: $" + bankRoll;
        console.log(message);
    }
    else if (yourSum == dealerSum) {
        message = "Tie! All bets returned.";
        bankRoll = bankRoll + betAmount;
        document.getElementById("bankRoll").innerText = "Bankroll: $" + bankRoll;
        console.log(message);
    }
    else if (yourSum > dealerSum) {
        message = "You Win! Plus: $" + (betAmount * 2);
        bankRoll = bankRoll + (betAmount * 2);
        document.getElementById("bankRoll").innerText = "Bankroll: $" + bankRoll;
        console.log(message);
    }
    else if (yourSum < dealerSum) {
        message = "You Lose! Minus: $" + betAmount;
        bankRoll = bankRoll - betAmount;
        document.getElementById("bankRoll").innerText = "Bankroll: $" + bankRoll;
        console.log(message);
    }

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
    hiddenCardImg.src = "./cards/BACK.png";
    document.getElementById("dealer-cards").appendChild(hiddenCardImg);

    document.getElementById("roundNumber").innerText = "Round: " + roundNumber;
    console.log("Round: " + roundNumber);
    console.log("Bankroll: $" + bankRoll);

    buildDeck();
    shuffleDeck();
    startGame();

    console.log(yourSum);

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