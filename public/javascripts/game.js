// Setting up a connection with the server
const socket = io();

// Sending an event to the server in order to log out the new connection and get the event with the array of active rooms
socket.emit('user:join');

const interactiveSection = document.querySelector("#card-field")
const headerCashPointer = document.querySelector(".header-cash")
const assetsCashPointer = document.querySelector('#asset-section-cash')
const cardTemplate = document.querySelector("#card-template").innerHTML
const cashEventCardTemplate = document.querySelector("#cash-event-card-template").innerHTML
const startButton = document.querySelector('#start-button')

startButton.addEventListener('click', () => {
    socket.emit('game:start')
})


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

socket.on('state:display', user => {
    console.log(JSON.stringify(user))
    headerCashPointer.innerText = user.cashAmount
    assetsCashPointer.innerText = user.cashAmount
})
