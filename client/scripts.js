import { io } from "socket.io-client"

// io is a function called to get  individual socket
// initialze client socket and connect ot the server
const socket  = io("http://localhost:3000");

// this is creating a custom user socket that connects to /user namespace

// initialize client socket and connect to user namespace
// const userSocket  = io("http://localhost:3000/user");

// you can connect to a particuar socket with an auth token
const userSocket  = io("http://localhost:3000/user", { auth: { token: "test"}, });

// We can attach custom listener to handle errors
userSocket.on('connect_error', (error)=> {
    displayMessage(error);
})


socket.on('connect', () => {
    displayMessage(`You connected with id: ${socket.id} `)
})

socket.on('recieved-message', (data)=> displayMessage(data))



const joinRoomButton = document.getElementById('room-button');

const messageInput = document.getElementById("message-input");

const roomInput = document.getElementById("room-input");

const form = document.getElementById("form");


form.addEventListener('submit', (e)=> {
    e.preventDefault();

    const message = messageInput.value;
    const room = roomInput.value;

    if(message === "") return;

    displayMessage(message);

    socket.emit('send-message', message, room)

    messageInput.value = "";
});


joinRoomButton.addEventListener('click', () => {
    const room = roomInput.value;
    // here we are sending request to the server to join us to a custom room passed in the request
    // socket.emit('join-room', room);

    // passing a callback function to socket.emit signature
    // Note: the callback should be the last paramter in the emit signature
    socket.emit('join-room', room, (msg) => displayMessage(msg));
});

function displayMessage(message){

    const div = document.createElement("div");

    div.textContent = message;

    document.getElementById("screen").append(div)
}

let count = 0;

setInterval(()=> {
    // socket.emit('ping', ++count);
    socket.volatile.emit('ping', ++count);
}, 1000)


// connecting and disconnecting to socket

document.addEventListener('keydown', (e)=> {
    if ( e.target.matches('input') ) return;

    if( e.key === "c" ) socket.connect();

    if( e.key === "d" ) socket.disconnect();


})