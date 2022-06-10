const express = require('express');
const http = require('http');
const { Server } = require("socket.io");


const app = express();
const server = http.createServer(app);
const socketIo = new Server(server, {
        cors: {
            origin: "http://localhost:3000",
        } 
    });

    // For Determine Users and Duplicated Usere 
let mainFlag = 0;
let usersIDs = [];


socketIo.on('connection', (socket) => {

    //solve douple connecting for same user with two socket ids                                                                                     
    if(mainFlag%2 ==0){
        socket.broadcast.emit('Users Broadcast Chatting', socket.id);
        usersIDs.push(socket.id);
    }
    mainFlag++;
    if(mainFlag == 1001){
        mainFlag = 0;
    }
    socketIo.to(socket.id).emit('Users Chat List',usersIDs);

    /* Handling Users requests */
    socket.on('Connect with a specific user', (socketId, mySocketId) => {
        socketIo.to(socketId).emit('Connect with a specific user',mySocketId);
    });

    socket.on('Chatting with specific user', (socketId, mySocketId, msg) => {
        socketIo.to(socketId).emit('Chatting with specific user message',msg);
        socketIo.to(mySocketId).emit('Chatting with specific user message',msg);
    });

    socket.on('Server Broadcast Chatting message', (msg) => {
        socketIo.emit('Broadcast Chatting message', msg);
    });

    socket.on('disconnect', () => {
        usersIDs = usersIDs.filter(client => client !== socket.id);
            socketIo.emit('Users Chat List',usersIDs);
        });
    });

    server.listen(5000, () => {
        console.log('listening on http://localhost:5000');
    });