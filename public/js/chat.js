const socket = io()

const $messageForm = document.querySelector('form')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')

const locationTemplate = document.querySelector('#location-template').innerHTML
const messageTemplate = document.querySelector("#message-template").innerHTML

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


socket.on("message", (message) => {
    console.log(message)
    const html = Mustache.render(messageTemplate, {
        message: message.text,
        createdAt: moment(message.createdAt).format("h:mm:ss a")
    })
    $messages.insertAdjacentHTML('beforeEnd', html)

})

socket.on("locationUpdate", (message) => {

    const html = Mustache.render(locationTemplate, {
        url: message,
        createdAt: moment(message.createdAt).format("h:mm:ss a")
    })
    $messages.insertAdjacentHTML('beforeEnd', html)
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

socket.emit('join', { username, room })