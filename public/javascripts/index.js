// Set up a connection with the server
const socket = io();

// Inform server about new connection
socket.emit('user:join');

const interactiveSection = document.querySelector("#card-field")
const headerCashPointer = document.querySelector(".header-cash")
const assetsCashPointer = document.querySelector('#asset-section-cash')
const cashEventCardTemplate = document.querySelector("#cash-event-card-template").innerHTML
const startButton = document.querySelector('#start-button')
const stockMarketCardTemplate = document.querySelector("#stock-market-card-template").innerHTML

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
    } else {cashEventColor.color = "red"}
    
    const nextCardButton = document.querySelector('#next-card-button')
    
    nextCardButton.addEventListener('click', () => {
        socket.emit('state:approveUpdate')
    })
})

// Display cash
socket.on('state:display', user => {
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
socket.on('stockMarketCard:display', ({actualPrice,
    companyName,
    fairPrice }) => {
    
    const html = Mustache.render(stockMarketCardTemplate, {
    actualPrice, companyName, fairPrice    
    });
    interactiveSection.innerHTML = html

    const inputElement = document.querySelector('#input_amount')
    const amountSum = document.querySelector(".amount-sum")
    
    // Handler for the amount field
    inputElement.onchange = function () {
        amountSum.innerText = this.value * actualPrice
    }

    // Handler for active lable

    let operationType = 'buySelect';

    document.querySelector('.tabs-holder').addEventListener('change', function (e) {
        operationType = e.target.id;
    });

    // Next button handler
    const nextCardButton = document.querySelector('#next-card-button')
    nextCardButton.addEventListener('click', () => {
        socket.emit('state:stockUpdate', {amount: inputElement.value || 1, operationType})
    })
})