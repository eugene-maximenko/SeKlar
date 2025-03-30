// Setting up a connection with the server
const socket = io();

// Sending an event to the server in order to log out the new connection and get the event with the array of active rooms
socket.emit('joinPageGreeting');

const interactiveSection = document.querySelector("#card-field")
socket.on("updateInteractiveSection", message => {
    console.log(message)

    interactiveSection.innerHTML = `<h1>${message}</h1>`
})