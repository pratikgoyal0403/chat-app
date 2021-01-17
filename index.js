const { create } = require('domain');
const express = require('express');
const { createWriteStream, createReadStream, writeFileSync, writeFile } = require('fs');
const app = express();
const path = require('path');
const server = app.listen(5000, ()=> console.log('server is up and running at port 5000'));

const io = require('socket.io')(server);

app.use(express.static(path.join(__dirname, 'client')))

app.use('/', (req, res, next)=> {
    res.sendFile(path.join(__dirname, 'client', 'index.html'));
})
let users = [];
io.on('connection', socket => {
    socket.on('connection', (name) => {
        users.push(name);
        socket.broadcast.emit('new user', name)
    })
    socket.on('new message', (data) => {
        
        socket.broadcast.emit('message', data);
    })
    socket.on('new Image', (data) => {
        socket.broadcast.emit('file', data)
    })
})
