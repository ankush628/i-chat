// socket instance -  interface used to sends events to — and receive events from — the server
const socket = io('localhost:5000');

// getting data of form submission
const form = document.getElementById('send-form');
// getting data from input message
const messageInput = document.getElementById('messageInp');
// to push data received
const messageContainer = document.querySelector('.container');

// adding sound
const audio = new Audio('ting.mp3');

// to append new event info to container
const append = (message,position,type)=>{
    const messageElement=document.createElement('div');
    messageElement.innerText=message;
    if(type==1)
    {
        messageElement.style.backgroundColor="#F0EEED";
        messageElement.style.fontWeight="bold";
    }
    if(type==2)
    {
        messageElement.classList.add('time');
        messageElement.style.backgroundColor="#D8D8D8";
    }
    else
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageContainer.append(messageElement);
    if(position == 'left')
    {
        audio.play();
    }
}

// asking for new user joined
const userName = prompt("Enter your name to join: ","Harry Potter");
const nameContainer = document.querySelector('.name-container');
const joined = document.createElement('div');
joined.innerText=`${userName}'s Chat`;
joined.classList.add('newUser');
nameContainer.append(joined);

// informing the server
socket.emit('new-user-joined',userName);

// informing everyone on server about new entry
socket.on('user-joined',name=>{
    if(name!=null)
    append(`${name} joined the chat.`,'left',1);
});

// if form gets submitted or someone send a message, give info to server
form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`,'right',0);
    var d = new Date();
    append(d.toLocaleTimeString(navigator.language, {hour: '2-digit',minute:'2-digit'}),'right',2);
    socket.emit('send',message);
    messageInput.value='';
});

// broadcasting a message send by someone to everyone connected
socket.on('receive',data=>{
    append(`${data.name}: ${data.message}`,'left',0);
    var d = new Date();
    append(d.toLocaleTimeString(navigator.language, {hour: '2-digit',minute:'2-digit'}),'left',2);
});

// if someone lefts ,inform everyone
socket.on('leave',name=>{
    if(name!=null)
    append(`${name} left the chat.`,'left',1);
});
