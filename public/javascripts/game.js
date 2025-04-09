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

socket.on("updateInteractiveSection", randomFinancialEvent => {
    
    const randomNumber = Math.floor(Math.random() * (3000-500+1) + 500)
    const randomAmount = randomFinancialEvent.type == "income" ? randomNumber : -randomNumber  

    const html = Mustache.render(cashEventCardTemplate, {
        eventDescription: randomFinancialEvent.description,
        amount: randomAmount
    });
    interactiveSection.innerHTML = html
    
    let cashEventColor = document.getElementById("cash-event-amount").style
    
    if (randomAmount > 0) {
        cashEventColor.color = "#00d062"
    } else {cashEventColor.color = "red"}
})

socket.on('updateState', user => {
    headerCashPointer.innerText = user.cashAmount
    assetsCashPointer.innerText = user.cashAmount
})
