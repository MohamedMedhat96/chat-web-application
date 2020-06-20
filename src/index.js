const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const path = require('path')
const port = 3000 || process.env.PORT
const socketIo = require('socket.io')
const io = socketIo(server)

app.use(express.static(path.join(__dirname, '../public')))
let count = 0
io.on('connection', (socket) => {
    socket.broadcast.emit('message', "user logged in!")
    socket.on('message', (message) => {
        console.log(message)
        io.emit('message', message)
    })
    socket.on('sendLocation', (message) => {
        io.emit("message", `https://google.com/maps?q=${message.lat},${message.long}`)
    })
    socket.on('disconnect', () => {
        io.emit("message", "User has left")
    })
})




server.listen(port, () => {
    count++;
    console.log("Server is up and running on port " + port)
})
