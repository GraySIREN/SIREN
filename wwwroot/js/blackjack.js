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
var netWinLoss = 0;
var roundWinLoss = 0;
var gameStarted = false;
var dealingStarted = false;
// placeholder keeper removed; placeholder is managed on load/reset only
var betPlaced = false;
var revealDealerTotal = false;
var dealerFaceUpSum = 0;
var dealerFaceUpAceCount = 0;
var dealerVisibleSum = 0;
var dealerVisibleAceCount = 0;

// initial DOM updates moved into window.onload to avoid null reference if script runs early

window.onload = function () {
    document.getElementById("roundNumber").innerHTML = "Round: " + roundNumber;
    document.getElementById("netWinLoss").innerHTML = "Net Win/Loss: $0";
    promptBuyIn();
    document.getElementById("results").innerHTML = "Please submit your bet now.";
    // Need to create a function, or edit existing, to force player to submit a bet before anything else can be done in the game.

    // Prepare deck but do not deal until a bet is submitted
    buildDeck();
    shuffleDeck();
    // Ensure player card area is empty before betting (dealer placeholder is static in HTML)
    document.getElementById("your-cards").innerHTML = "";
    // ensure a placeholder exists inside dealer area
    var dealerAreaInit = document.getElementById('dealer-cards');
    if (dealerAreaInit && !document.getElementById('hidden-card-placeholder')) {
        var rowInit = document.createElement('div');
        rowInit.className = 'card-row';
        var placeholderInit = document.createElement('img');
        placeholderInit.id = 'hidden-card-placeholder';
        placeholderInit.src = '/cards/BACK.png';
        rowInit.appendChild(placeholderInit);
        dealerAreaInit.innerHTML = '';
        dealerAreaInit.appendChild(rowInit);
        console.log('blackjack: placeholder created on load');
    }
    // placeholder is managed on load/reset only
    // document.getElementById("your-cards").innerHTML is already set above
    // dealer back-card placeholder is provided statically in the HTML
    // Disable hit/stand until round starts and attach handlers so clicks always call functions
    var hitBtn = document.getElementById("hit");
    var standBtn = document.getElementById("stand-btn");
    if (hitBtn) { hitBtn.disabled = true; hitBtn.removeEventListener('click', hit); hitBtn.addEventListener('click', hit); }
    if (standBtn) { standBtn.disabled = true; standBtn.removeEventListener('click', stand); standBtn.addEventListener('click', stand); }
    // submit-bet button will be enabled by promptBuyIn() after a valid buy-in
    // Wire up Play Again button
    var playAgain = document.getElementById('play-again-btn');
    if (playAgain) playAgain.addEventListener('click', resetGame);
    // Ensure hit/stand handlers are attached (safe to attach early; handlers check state)
    var hitBtnInit = document.getElementById('hit');
    var standBtnInit = document.getElementById('stand-btn');
    if (hitBtnInit) { hitBtnInit.removeEventListener('click', hit); hitBtnInit.addEventListener('click', hit); }
    if (standBtnInit) { standBtnInit.removeEventListener('click', stand); standBtnInit.addEventListener('click', stand); }
}

function submitBet() {
    var betAmountDropDown = document.getElementById("betAmountDropdown");
    betAmount = parseFloat(betAmountDropDown.value);

    if (!isNaN(betAmount) && betAmount > 0) {
        document.getElementById("results").innerHTML = "Bet amount: $" + betAmount + ".";
        betPlaced = true;
        // start the game only once a bet has been placed
        if (!gameStarted) {
            gameStarted = true;
            // ensure deck is fresh for the round
            buildDeck();
            shuffleDeck();
            // make sure dealing flag is cleared so startGame can proceed
            dealingStarted = false;

            // disable the bet button until round completes to prevent double bets
            var submitBetBtn = document.getElementById('submit-bet');
            if (submitBetBtn) submitBetBtn.disabled = true;

            // small delay so user sees the placeholder before cards are dealt
            setTimeout(function () { startGame(); }, 600);
        }
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
    // Guard: do not deal if no bet has been placed
    if (!betAmount || betAmount <= 0) {
        document.getElementById("results").innerText = "Please submit your bet now.";
        return;
    }
    if (dealingStarted) return;
    dealingStarted = true;

    // clear player cards, keep dealer back placeholder
    document.getElementById("your-cards").innerHTML = "";

    // ensure dealer placeholder exists
    var dealerArea = document.getElementById('dealer-cards');
    if (dealerArea && !document.getElementById('hidden-card-placeholder')) {
        dealerArea.innerHTML = '';
        var row = document.createElement('div');
        row.className = 'card-row';
        var ph = document.createElement('img');
        ph.id = 'hidden-card-placeholder';
        ph.src = '/cards/BACK.png';
        row.appendChild(ph);
        dealerArea.appendChild(row);
    }

    // draw facedown dealer card and store it
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    var phEl = document.getElementById('hidden-card-placeholder');
    if (phEl) phEl.dataset.hiddenCard = hidden;

    // deal one dealer face-up card
    setTimeout(function () { dealCardAnimation('dealer-cards', deck.pop()); }, 300);

    // deal two player cards
    setTimeout(function () { dealCardAnimation('your-cards', deck.pop()); }, 600);
    setTimeout(function () { dealCardAnimation('your-cards', deck.pop()); }, 900);

    // enable controls
    var hitBtn = document.getElementById('hit');
    var standBtn = document.getElementById('stand-btn');
    if (hitBtn) { hitBtn.disabled = false; hitBtn.removeEventListener('click', hit); hitBtn.addEventListener('click', hit); }
    if (standBtn) { standBtn.disabled = false; standBtn.removeEventListener('click', stand); standBtn.addEventListener('click', stand); }
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

function revealHidden() {
    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "/cards/" + card + ".png";
}

function stand() {
    // Reveal dealer facedown card
    revealHidden();

    // show totals while dealer draws
    revealDealerTotal = true;

    // Adjust sums for aces
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    // Dealer draws until 17
    while (dealerSum < 17) {
        var card = deck.pop();
        console.log('blackjack: dealer draws', card);
        dealCardAnimation('dealer-cards', card);
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        dealerSum = reduceAce(dealerSum, dealerAceCount);
    }

    var message = '';

    if (yourSum > 21) {
        message = 'You Bust! Minus $' + betAmount;
        roundWinLoss = (betAmount * -1);
        bankRoll -= betAmount;
    } else if (dealerSum > 21) {
        message = 'You win! Plus: $' + (betAmount * 2);
        roundWinLoss = (betAmount * 2);
        bankRoll += (betAmount * 2);
    } else if (yourSum == dealerSum) {
        message = 'Tie! All bets returned.';
        bankRoll += betAmount;
        roundWinLoss = 0;
    } else if (yourSum > dealerSum) {
        message = 'You Win! Plus: $' + (betAmount * 2);
        roundWinLoss = (betAmount * 2);
        bankRoll += (betAmount * 2);
    } else {
        message = 'You Lose! Minus: $' + betAmount;
        roundWinLoss = (betAmount * -1);
        bankRoll -= betAmount;
    }

    calculateNetWinLoss();
    document.getElementById('dealer-sum').innerText = dealerSum;
    document.getElementById('your-sum').innerText = yourSum;
    document.getElementById('results').innerText = message;
}

// play-again event is wired in window.onload

function resetGame() {
    console.log('blackjack: resetGame');
    console.log("Resetting game...");
    dealerSum = 0;
    yourSum = 0;
    dealerAceCount = 0;
    yourAceCount = 0;
    canHit = true;
    roundNumber++;
    // require a new bet for the next round
    gameStarted = false;
    betAmount = 0;
    dealingStarted = false;
    betPlaced = false;

    document.getElementById("dealer-cards").innerHTML = "";
    document.getElementById("your-cards").innerHTML = "";
    document.getElementById("results").innerText = "Please submit your bet now.";
    document.getElementById("dealer-sum").innerText = "";
    document.getElementById("your-sum").innerText = "";

    // Do not show any cards until the player places a bet
    var hitBtn = document.getElementById("hit");
    var standBtn = document.getElementById("stand-btn");
    if (hitBtn) hitBtn.disabled = true;
    if (standBtn) standBtn.disabled = true;
    // Enable bet submit so player can place a new bet
    var submitBetBtn = document.getElementById('submit-bet');
    if (submitBetBtn) submitBetBtn.disabled = false;
    // ensure dealer back-card placeholder is visible after reset
    var dealerAreaReset = document.getElementById('dealer-cards');
    if (dealerAreaReset && !document.getElementById('hidden-card-placeholder')) {
        var row = document.createElement('div');
        row.className = 'card-row';
        var placeholderReset = document.createElement('img');
        placeholderReset.id = 'hidden-card-placeholder';
        placeholderReset.src = '/ImageBACK.png';
        row.appendChild(placeholderReset);
        dealerAreaReset.innerHTML = '';
        dealerAreaReset.appendChild(row);
        console.log('blackjack: placeholder added on reset');
    }
    // placeholder re-created above; no observer re-attachment needed

    document.getElementById("roundNumber").innerText = "Round: " + roundNumber;
    console.log("Round: " + roundNumber);
    console.log("Bankroll: $" + bankRoll);

    // prepare a fresh deck but DO NOT start dealing until bet is submitted
    buildDeck();
    shuffleDeck();

    console.log(yourSum);

    var hitEl = document.getElementById("hit");
    var standEl = document.getElementById("stand-btn");
    if (hitEl) { hitEl.removeEventListener("click", hit); hitEl.addEventListener("click", hit); }
    if (standEl) { standEl.removeEventListener("click", stand); standEl.addEventListener("click", stand); }
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
    // Enable the Bet button now that buy-in is set
    var submitBetBtn = document.getElementById('submit-bet');
    if (submitBetBtn) submitBetBtn.disabled = false;
}

function calculateNetWinLoss() {
    netWinLoss = netWinLoss + roundWinLoss;
    console.log(netWinLoss);
    document.getElementById("netWinLoss").innerHTML = "Net Win/Loss = $" + netWinLoss;
}

function dealCardAnimation(containerId, card) {
    let container = document.getElementById(containerId);
    let cardImg = document.createElement("img");
    cardImg.classList.add("card");

    let cardRow;
    if (container.getElementsByClassName("card-row").length === 0 || container.lastElementChild.children.length >= 3) {
        cardRow = document.createElement("div");
        cardRow.classList.add("card-row");
        container.appendChild(cardRow);
    } else {
        cardRow = container.lastElementChild;
    }

    // load image with fallback, append immediately
    const imgSrc = "/cards/" + card + ".png";
        cardImg.onerror = function () { cardImg.onerror = null; cardImg.src = '/cards/BACK.png'; };
    cardImg.src = imgSrc;
    cardRow.appendChild(cardImg);
    void cardImg.offsetWidth;
    cardImg.style.animation = "dealAnimation 0.5s forwards";

    if (containerId === "your-cards") {
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-sum").innerText = yourSum;
    } else if (containerId === "dealer-cards") {
        // Face-up dealer card: add to faceUp tracker
        dealerFaceUpSum += getValue(card);
        dealerFaceUpAceCount += checkAce(card);
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);

        var ph = document.getElementById('hidden-card-placeholder');
        if (ph && !revealDealerTotal) {
            // show partial total like '? + X' where X is faceUp sum
            var faceUpDisplay = reduceAce(dealerFaceUpSum, dealerFaceUpAceCount);
            var el = document.getElementById('dealer-sum');
            el.classList.add('partial');
            el.innerText = faceUpDisplay;
        } else if (revealDealerTotal) {
            var el = document.getElementById('dealer-sum');
            el.classList.remove('partial');
            el.innerText = reduceAce(dealerSum, dealerAceCount);
        }
    }
}