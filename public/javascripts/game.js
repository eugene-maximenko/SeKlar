// Setting up a connection with the server
const socket = io();

// Sending an event to the server in order to log out the new connection and get the event with the array of active rooms
socket.emit('joinPageGreeting');

const interactiveSection = document.querySelector("#card-field")
const cardTemplate = document.querySelector("#card-template").innerHTML

socket.on("updateInteractiveSection", message => {
    console.log(message)

    const html = Mustache.render(cardTemplate, {
        username: "message",
        message: 'whatever'
    });
    
    console.log(html);
    interactiveSection.insertAdjacentHTML('beforeend', html)
})