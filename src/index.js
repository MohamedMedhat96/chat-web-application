const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const path = require('path')
const port = 3000 || process.env.PORT
const socketIo = require('socket.io')
const io = socketIo(server)
const Filter = require('bad-words')
const { generateMessage } = require('./utils/messages')
app.use(express.static(path.join(__dirname, '../public')))

io.on('connection', (socket) => {


    socket.on('join', ({ username, room }) => {
        socket.join(room)
        socket.emit('message', generateMessage("Welcome"))
        socket.broadcast.to(room).emit('message', generateMessage(`${username} has just joined the chat`))
    })
    socket.on('sendMessage', (message, callback) => {
        console.log(message)
        io.emit('message', generateMessage(message))
        callback()

    })
    socket.on('sendLocation', (message, callback) => {
        io.emit("locationUpdate", generateMessage(`https://google.com/maps?q=${message.lat},${message.long}`))
        callback()
    })
    socket.on('disconnect', () => {
        io.emit("message", generateMessage("A user has left the chat"))
    })
})






server.listen(port, () => {
    console.log("Server is up and running on port " + port)
})