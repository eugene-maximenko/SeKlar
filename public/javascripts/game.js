// Setting up a connection with the server
const socket = io();

// Sending an event to the server in order to log out the new connection and get the event with the array of active rooms
socket.emit('joinPageGreeting');

const interactiveSection = document.querySelector("#card-field")
const cardTemplate = document.querySelector("#card-template").innerHTML
const cashEventCardTemplate = document.querySelector("#cash-event-card-template").innerHTML

socket.on("updateInteractiveSection", () => {

    const html = Mustache.render(cashEventCardTemplate, {
        headerPhrase: 'Поздравляем, вам удалось заработать!',
        eventDescription: 'Вы продали ненужный диван на Finn.no',
        amount: 2000
    });
    
    interactiveSection.innerHTML = html
})

