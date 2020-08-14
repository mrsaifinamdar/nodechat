const socket = io(window.location.hostname+':3000');
const messageContainer= document.getElementById('message-container')
const messageForm = document.getElementById('send-container');
const messageinput = document.getElementById('message-input');
const name= prompt('What is your name?');
appendMessage('You Joined');
socket.emit('new-user',name);
socket.on('chat-message', data =>{
    appendMessage(`${data.name} : ${data.message} `);
}) 
socket.on('user-connected', name =>{
    appendMessage(`${name} Connected`);
}) 
socket.on('user-disconnected',userid =>{
    appendMessage(`${userid} Disconnected `);
}) 

messageForm.addEventListener('submit',e =>{
    e.preventDefault();
    const message = messageinput.value;
    appendMessage(`You: ${message}`);
    socket.emit('send-chat-message',message)
    messageinput.value='';
})

function appendMessage(message){
    const messageElement = document.createElement('div')
    messageElement.innerText= message;
    messageContainer.append(messageElement);
}
