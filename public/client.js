
const textBox = document.querySelector(".textBox");
const chatDivs = document.querySelector(".chatDivs");
const onlineUsers = document.querySelector(".onlineUsers ul");
const socket = io();



/**
 * popUp function is called as soon as the page loads and a popup appears asking name of user
 * and validate it
 */
popUp = (function () {
   let userName = prompt("Enter user name:");
   if (userName == null || userName.length == 0) {
      alert("invalid input");
      popUp();
   }
   else {
      socket.emit("user_name", userName);
   }
})

/**
 * when send button is pressed then send function is called to send and display the message
 */

send = (function (event) {
   event.preventDefault();
   let msg = textBox.value;
   textBox.value = "";
   if (!msg.length == 0) {
      displayMessage(msg);
      socket.emit('message', msg);//an event is emitted to send the message to all connected users
   }
})

/**
 * on successful registration new msg is displayed inside text area by creating a new div
 */
socket.on("success", function (newUser) {
   let newUserDiv = document.createElement("div");
   newUserDiv.className = "joiningStatus";
   newUserDiv.innerHTML+=`<p>🔵 ${newUser} joined the chat..</p>`;
   chatDivs.appendChild(newUserDiv);
})

/**
 * when a user leaves a new msg is displayed on the screen that he left  
 */
socket.on("user_disconnected", function (username) {
   let newUserDiv = document.createElement("div");
   newUserDiv.className = "joiningStatus";
   newUserDiv.innerHTML+=`<p>🔴 ${username} left the chat...</p>`;
   chatDivs.appendChild(newUserDiv);
})

/**
 * responds to event emitted by server to update online users
 */
socket.on("update_userlist", function (userList) {
   updateOnlineUsers(userList);
})
/**
 * function that updates online users by adding a new text node for each user and appending 
 * inside list.
 */
updateOnlineUsers = (function (userList) {
   onlineUsers.innerHTML = "";
   for (let i = 0; i < userList.length; i++) {
     onlineUsers.innerHTML += `<li>${userList[i]}</li>`;
   }
})

/**
 * responds to chat message received event emitted  by server
 * create new div and attach time username and message and add to textarea.
 */
socket.on("message_received", function (userNameAndMessage) {
   let time = new Date().toLocaleTimeString().substring(0, 5);
   let user = userNameAndMessage[0];
   let message = userNameAndMessage[1];
   let userTime = document.createElement("p");
   userTime.className = "username-time";
   let textNode = document.createTextNode(`${user},${time}`);
   userTime.appendChild(textNode);
   let textDiv = document.createElement("div");
   textDiv.appendChild(userTime);
   textDiv.innerHTML+=`<p>${message}</p>`;
   textDiv.className = "received_messages";
   chatDivs.appendChild(textDiv);
})


/**
 * displaying own msg sent on chat with time and name by creating new dom elements
 */
displayMessage = (function (msg) {
   let time = new Date().toLocaleTimeString().substring(0, 5);
   let user = document.createElement("p");
   user.className = "username-time";
   let textNode = document.createTextNode(`You,${time}`);
   user.appendChild(textNode);
   let textDiv = document.createElement("div");
   textDiv.appendChild(user);
   textDiv.innerHTML+=`<p>${msg}</p>`
   textDiv.className = "sent_messages";
   chatDivs.append(textDiv);
})



