const socket = io()

const $messageForm = document.querySelector('form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $users = document.querySelector("#usersBar")
const locationTemplate = document.querySelector('#location-template').innerHTML
const messageTemplate = document.querySelector("#message-template").innerHTML
const userTemplate = document.querySelector("#users-template").innerHTML
$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()
    $messageFormButton.setAttribute('disabled', 'disabled')
    const message = e.target.elements.message.value
    socket.emit('sendMessage', message, (err) => {

        $messageFormButton.removeAttribute('disabled')

        $messageFormInput.value = ""
        $messageFormInput.placeholder = "Enter message"
        $messageFormInput.focus()
        if (err)
            return console.log(err)
        else
            console.log("Delivered")


    })

})

const { username, room } = Qs.parse(location.search, { ignoreQueryPrefix: true })

const autoscroll = () => {
    const $newMessage = $messages.lastElementChild
    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight

    const containerHeight = $messages.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight
    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}


socket.on("message", (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm:ss a"),
        username: message.username
    })
    $messages.insertAdjacentHTML('beforeEnd', html)
    autoscroll()
})

socket.on("locationUpdate", (message) => {

    const html = Mustache.render(locationTemplate, {
        url: message.text,
        createdAt: moment(message.createdAt).format("h:mm:ss a"),
        username: message.username
    })
    $messages.insertAdjacentHTML('beforeEnd', html)
    autoscroll()
})

$locationButton.addEventListener('click', (e) => {

    if (!navigator.geolocation) {
        return alert('Location not supported')
    }
    $locationButton.setAttribute('disabled', 'disabled')
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendLocation', { lat: position.coords.latitude, long: position.coords.longitude }, () => {
            $locationButton.removeAttribute('disabled')

            console.log("Location recieved")
        })
    })
})

socket.on('roomData', ({ room, usersArray }) => {
    let users = usersArray.map(user => user.username);
    const html = Mustache.render(userTemplate, {
        room,
        users
    })
    $users.innerHTML = html
})

socket.emit('join', { username, room }, (user, error) => {
    if (error) {
        alert(error)
        location.href = '/'
    }

})