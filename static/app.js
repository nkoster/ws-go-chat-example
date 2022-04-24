let socket = null
const message = document.querySelector('#message')
const output = document.querySelector('#output')
const username = document.querySelector('#username')
const sendBtn = document.querySelector('#sendBtn')
const status = document.querySelector('#status')
const wsEndpoint = `${location.protocol === 'http:' ? 'ws' : 'wss'}://${location.host}/ws`
console.log(wsEndpoint, location.protocol)
window.onbeforeunload = () => {
  console.log('Leaving...')
  const jsonData = {}
  jsonData['action'] = 'left'
  socket.send(JSON.stringify(jsonData))
}
document.addEventListener('DOMContentLoaded', () => {
  socket = new ReconnectingWebSocket(wsEndpoint, null, {
    debug: true,
    reconnectInterval: 3000
  })

  const online = `<span class="badge bg-success">connected</span>`
  const offline = `<span class="badge bg-danger">disconnected</span>`

  socket.onopen = () => {
    console.log('Successfully connected')
    status.innerHTML = online
  }
  socket.onclose = () => {
    console.log('Connection closed')
    status.innerHTML = offline
  }
  socket.onerror = error => {
    console.log('There was an error:', error)
    status.innerHTML = offline
  }
  socket.onmessage = msg => {
    const data = JSON.parse(msg.data)
    console.log('data', data)
    switch (data.action) {
      case 'list_users': {
        const ul = document.querySelector('#online_users')
        while (ul.firstChild) ul.removeChild(ul.firstChild)
        if (data.connected_users) {
          data.connected_users.forEach(user => {
            if (user) {
              const li = document.createElement('li')
              li.appendChild(document.createTextNode(user))
              ul.appendChild(li)
            }
          })
        }
      }
        break
      case 'broadcast': {
        output.innerHTML += `${data.message}<br>`
      }
        break
    }
  }

  username.addEventListener('change', e => {
    const jsonData = {}
    jsonData['action'] = "username"
    jsonData['username'] = e.target.value
    socket.send(JSON.stringify(jsonData))
  })

  message.addEventListener('keydown', e => {
    if (e.code === 'Enter') {
      e.preventDefault()
      e.stopPropagation()
      sendMessage()
    }
  })
})

function sendMessage() {
  if (username.value === '' || message.value === '' || !socket) {
    errorAlert('fill out user name and message')
    return false
  }
  const jsonData = {}
  jsonData['action'] = 'broadcast'
  jsonData['username'] = username.value
  jsonData['message'] = message.value
  socket.send(JSON.stringify(jsonData))
  message.value = ''
}

sendBtn.addEventListener('click', () => {
  sendMessage()
})

function errorAlert(msg) {
  notie.alert({
    type: 'error',
    text: msg,
  })
}
