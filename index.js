/**
 * required modules-
 * 1.socket.io
 * 2.express
 */


const express=require('express');
const app=express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.use(express.static('public'));

/**empty user array to store number of active users */
var users = [];

/**
 * when connection is established 
 */
io.on('connection', function(socket){
   socket.on('message', function(data) {
       let messageAndUserName=[socket.username,data];
       socket.broadcast.emit('message_received',messageAndUserName);
      });

   socket.on("user_name",function(userName){
      if(users.indexOf(userName)==-1 && userName.length!=0)
      {
         users.push(userName);
         socket.username=userName;
         io.emit("success",userName);     
         io.emit("update_userlist",users);
      }
        
   })  
/**
 * when user disconnects server removes username from users array and emits update online user
 * and user left .
 */
   socket.on('disconnect',()=>{ 
      for( let i = 0; i < users.length; i++){ 
         if ( users[i] === socket.username) {
           users.splice(i, 1); 
         }
      }
      io.emit("update_userlist",users);  
      io.emit("user_disconnected",socket.username);
   })

   });

/**
 * Server listening on port 9002.
 */
http.listen(9001, function() {
   console.log('listening on localhost:9001');
});