// Set up a connection with the server
const socket = io();

// Inform server about new connection
socket.emit('user:join');

const interactiveSection = document.querySelector("#card-field")
const headerCashPointer = document.querySelector(".header-cash")
const assetsCashPointer = document.querySelector('#asset-section-cash')
const startButton = document.querySelector('#start-button')
const stockStateSection = document.querySelector('#assets-deposit-after')

// Templates
const cashEventCardTemplate = document.querySelector("#cash-event-card-template").innerHTML
const stockMarketCardTemplate = document.querySelector("#stock-market-card-template").innerHTML
const stockStateTemplate = document.querySelector('#stock-state-template').innerHTML
const businessCardTemplate = document.querySelector('#business-card-template').innerHTML

startButton.addEventListener('click', () => {
    socket.emit('game:start')
})

// Random Event Card
socket.on("randomEventCard:display", randomFinancialEvent => {

    console.log(JSON.stringify(randomFinancialEvent))

    const amountIsPositiveNumber = randomFinancialEvent.amount > 0 ? true : false

    const html = Mustache.render(cashEventCardTemplate, {
        eventDescription: randomFinancialEvent.description,
        amount: amountIsPositiveNumber ? `+${randomFinancialEvent.amount}` : randomFinancialEvent.amount
    });
    interactiveSection.innerHTML = html

    let cashEventColor = document.getElementById("cash-event-amount").style

    if (randomFinancialEvent.amount > 0) {
        cashEventColor.color = "#00d062"
    } else { cashEventColor.color = "red" }

    const nextCardButton = document.querySelector('#next-card-button')

    nextCardButton.addEventListener('click', () => {
        socket.emit('state:approveUpdate')
    })
})

// Display change in cash
socket.on('cash:update', user => {
    console.log(JSON.stringify(user))

    headerCashPointer.style.opacity = 0.1
    assetsCashPointer.style.opacity = 0.1

    setTimeout(() => {
        headerCashPointer.innerText = user.cashAmount
        assetsCashPointer.innerText = user.cashAmount

        headerCashPointer.style.opacity = 1;
        assetsCashPointer.style.opacity = 1
    }, 500);  // 1000ms matches the duration of the fade-out
})

// Stock Card
socket.on('stockMarketCard:display', ({ actualPrice,
    companyName,
    fairPrice, amountOnHands, averagePrice }) => {

    const stockAmountOnHands = amountOnHands > 0 ? `${amountOnHands} по ${averagePrice}` : 0

    const html = Mustache.render(stockMarketCardTemplate, {
        actualPrice, companyName, fairPrice, stockAmountOnHands
    });
    interactiveSection.innerHTML = html

    const inputElement = document.querySelector('#input_amount')
    const amountSum = document.querySelector(".amount-sum")

    // Handler for the amount field
    inputElement.onchange = function () {
        amountSum.innerText = this.value * actualPrice
    }

    // Validator for input
    inputElement.addEventListener('blur', () => {
        const value = inputElement.value.trim();

        // Allow only digits (and not empty string)
        const isValid = /^[1-9][0-9]*$/.test(value);

        if (!isValid) {
            // Optional: show error, shake input, or reset value
            alert('Only positive numbers allowed!');
            // reset input area
            inputElement.value = 1
            amountSum.innerText = actualPrice
        }
    });


    // Handler for active lable
    let operationType = 'buySelect';

    document.querySelector('.tabs-holder').addEventListener('change', function (e) {
        operationType = e.target.id;
    });

    // Next button handler
    const nextCardButton = document.querySelector('#next-card-button')
    nextCardButton.addEventListener('click', () => {
        socket.emit('state:stockUpdate', { amount: Number(inputElement.value) || 1, operationType })
    })

    // Skip button handler
    const skipButton = document.querySelector('#skip-button')
    skipButton.addEventListener('click', () => {
        socket.emit('skipTheCard')
    })
})

// Display Stock State
socket.on("state:stockDisplay", stockState => {

    console.log(`Client got this stockState ` + JSON.stringify(stockState))

    const stockRows = document.querySelectorAll(`#stock-row`)

    stockRows.forEach((e) => { e.remove() })

    for (key in stockState) {

        const html = Mustache.render(stockStateTemplate, {
            companyName: key,
            amount: stockState[key].amount,
            totalInvestment: stockState[key].totalInvestment,
            averagePrice: stockState[key].averagePrice,
        });

        stockStateSection.insertAdjacentHTML('afterend', html)

    }

    const nextCardButton = document.querySelector('#next-card-button')

    nextCardButton.addEventListener('click', () => {
        socket.emit('state:stockUpdate', { amount: inputElement.value || 1, operationType })
    })
})

socket.on('notification:operationIsNotApproved', () => {
    alert('Operation is not approved, try again :)')
})

socket.on('businessCard:display', (card) => {

    const html = Mustache.render(businessCardTemplate, card);
    interactiveSection.innerHTML = html


})