const socket = io()


const form = document.querySelector('form').addEventListener('submit', (e) => {
    e.preventDefault()
    const message = e.target.elements.message.value
    socket.emit('message', message)
    e.target.elements.message.value = ""
    e.target.elements.message.placeholder = "Enter message"

})


socket.on("message", (message) => {
    console.log(message)
})

document.querySelector("#send-location").addEventListener('click', (e) => {

    if (!navigator.geolocation) {
        return alert('Location not supported')
    }
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', { lat: position.coords.latitude, long: position.coords.longitude })
    })
})