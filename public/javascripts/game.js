// Setting up a connection with the server
const socket = io();

// Sending an event to the server in order to log out the new connection and get the event with the array of active rooms
socket.emit('joinPageGreeting');

const interactiveSection = document.querySelector("#card-field")
const cardTemplate = document.querySelector("#card-template").innerHTML
const cashEventCardTemplate = document.querySelector("#cash-event-card-template").innerHTML

socket.on("updateInteractiveSection", () => {
    
    const amount = -15000
    const html = Mustache.render(cashEventCardTemplate, {
        headerPhrase: 'Поздравляем, вам удалось заработать!',
        eventDescription: 'Вы продали ненужный диван на Finn.no',
        amount
    });
    interactiveSection.innerHTML = html
    
    let cashEventColor = document.getElementById("cash-event-amount").style
    
    if (amount > 0) {
        cashEventColor.color = "#00d062"
    } else {cashEventColor.color = "red"}
})

