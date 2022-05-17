import { Server } from "socket.io"

import {instrument} from "@socket.io/admin-ui"

const io = new Server(3000, {
    // cors: {origin: "http://localhost:8080"},
    cors: {
        origin: ["http://localhost:8080", "https://admin.socket.io/"]
    }
})

const getUserNamefromToken = (token)=> {
    // A simple function returning a token
    // Here we can make database request and handle different 
        // business logic
    return token;
}


// creating socket namespace

const userIo = io.of('/user');

// attaching middleware to socket connection
userIo.use((socket, next)=> {

    const token = socket.handshake.auth.token;

    if (token) {
        socket.username = getUserNamefromToken(token);
        next()
    }else{
        next(new Error('Please send user name'))
    }

})

userIo.on("connection", (socket)=> {
    console.log(`connected to user namespace with ${socket.username}`);
})

// This runs every time a client connect to our serve
// socket.id is just a random id assign to each user logged in to the serve
io.on('connection', (socket) => {
    socket.on('send-message', (data, room) => {
        // to emit event to all connected client sockets, use the below
        // This broadcast the message to everyone including the user itself that emits the message
        // io.emit('recieved-message', data);
        if(room === ""){
            // To semit event to all clients except the client that sends the message, use the following code below
            socket.broadcast.emit('recieved-message', data)
        }else{
            // This is sending the message to a particular room.
            // Note: each socket id represent a room and which the owner of the socke it existing alone
            // So I am sending a private message to the room( with the Id passed): 
            // Also this will not be sending the message to the user the previously emitted it.
            socket.to(room).emit("recieved-message", data)
        }

    });

    // socket.on('join-room', (room)=> {
    //     // here the client sendin the requesting being join to the room passed in the data
    //     socket.join(room)
    // })

// Here the cb is passed as the last paramter
    socket.on('join-room', (room, cb)=> {
        //     // here the client requesting being join to the room passed in the data
        socket.join(room)
        
        cb(`joined room (${room}) succesfully`);
    });

    socket.on('ping', n => console.log(n));
})  


instrument(io, { auth: false} )


