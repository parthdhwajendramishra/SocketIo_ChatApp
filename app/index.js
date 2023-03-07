const socket = io()
let userName;
let roomName;
let textarea = document.querySelector('#textarea')
let messageArea = document.querySelector('.message__area')

do {
  userName = prompt('Please enter your name: ');
  roomName = prompt('Please enter your room name: ');
} while (!userName && !roomName)



if(roomName!==null)
{
  socket.emit('join room', roomName);
}




// Send message to all
textarea.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    sendMessage(e.target.value);
    
  }
})

function sendMessage(message) {
  let msg = {
    sender: userName,
    message: message.trim()
  }
  // Append 
  appendMessage(msg, 'outgoing')
  textarea.value = ''
  scrollToBottom()

  //Sending message to a particular room
  socket.emit('send message', { room: roomName, message: msg });

}


// Recieve messages 
socket.on('new message', (data) => {

  if(data.sender!==userName)
    appendMessage(data, 'incoming')
  scrollToBottom()
})


function appendMessage(data, type) {
  let mainDiv = document.createElement('div')
  let className = type
  mainDiv.classList.add(className, 'message')
  console.log(data);
  console.log("Testing");
  let markup = `
        <h4>${data.sender}</h4>
        <p>${data.message}</p>
    `
  mainDiv.innerHTML = markup
  messageArea.appendChild(mainDiv)
}


function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight
}


// Typing....


// Listen for the keydown event on the input field
textarea.addEventListener('keydown', user_typing);

function user_typing() {
  socket.emit('typing', userName);
}

socket.on('typing', (msg) => {
  showTypingIndicator(msg);
})

function showTypingIndicator(msg) {
  var cursor = document.createElement('span');
  cursor.textContent=msg;
  cursor.classList.add('cursor');
  document.getElementById('typing-indicator').appendChild(cursor);
}


// Not Typing.....

// Listen for the keyup event on the input field
textarea.addEventListener('keyup', () => {
  // Set the typing indicator to false
  let isTyping = false;

  // Use a timeout function to detect when the user stops typing
  setTimeout(() => {
    // If the user is not typing, do something
    if (!isTyping) {
      socket.emit('stop typing');
    }
  }, 1000);
});

socket.on('stop typing', () => {
  hideTypingIndicator();
})

function hideTypingIndicator() {
  var typingIndicator = document.getElementById('typing-indicator');
  typingIndicator.removeChild(typingIndicator.lastChild);
}


