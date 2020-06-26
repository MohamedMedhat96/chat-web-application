const express = require('express')
const http = require('http')
const app = express()
const server = http.createServer(app)
const path = require('path')
const port = process.env.PORT || 3000
const socketIo = require('socket.io')
const io = socketIo(server)
const Filter = require('bad-words')
const { generateMessage } = require('./utils/messages')
app.use(express.static(path.join(__dirname, '../public')))
const { getUser, getUsersInRoom, addUser, removeUser } = require('./utils/users')
io.on('connection', (socket) => {


    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ username, room, id: socket.id })
        if (error) {
            return callback(undefined, error)
        }
        socket.join(user.room)
        socket.emit('message', generateMessage("Welcome", user.username))
        socket.broadcast.to(user.room).emit('message', generateMessage(`${user.username} has just joined the chat`, 'Admin'))
        io.to(user.room).emit('roomData', {
            room: user.room,
            usersArray: getUsersInRoom(user.room)
        })
        callback(user.room)
    })
    socket.on('sendMessage', (message, callback) => {
        console.log(message)
        const user = getUser(socket.id)

        io.to(user.room).emit('message', generateMessage(message, user.username))
        callback()

    })
    socket.on('sendLocation', (message, callback) => {
        const user = getUser(socket.id)
        io.to(user.room).emit("locationUpdate", generateMessage(`https://google.com/maps?q=${message.lat},${message.long}`, user.username))
        callback()
    })
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        console.log(user.room)
        if (user) {
            io.to(user.room).emit("message", generateMessage(`${user.username} has left the chat`, 'Admin'))
            io.to(user.room).emit('roomData', {
                room: user.room,
                usersArray: getUsersInRoom(user.room)
            })
        }

    })
})






server.listen(port, () => {
    console.log("Server is up and running on port " + port)
})