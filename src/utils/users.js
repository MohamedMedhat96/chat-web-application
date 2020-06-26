const users = []
const addUser = ({
    id,
    username,
    room
}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if (!username || !room) {
        return { error: 'Username and room are required' }
    }
    const existingUser = users.find((user) => {
        return user.room == room && user.username === username
    })

    if (existingUser) {
        return {
            error: "Username is in use"
        }
    }

    const user = {
        id,
        username,
        room
    }
    users.push(user)
    return { user }
}


const removeUser = (id) => {

    var index = users.findIndex((user) => {
        return user.id == id
    })
    console.log(index)
    if (index != -1) {

        const u = users.splice(index, 1)[0]
        return u
    }
}
addUser({
    id: 22,
    username: "Medhat",
    room: "Cairo"
})
const user1 = addUser({
    id: 23,
    username: "Testing",
    room: "Cairo"
})

const getUser = (id) => {
    return users.find(user => user.id === id)
}

const getUsersInRoom = (room) => {
    return users.filter(user => user.room == room.trim().toLowerCase())
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom }