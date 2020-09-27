
const socketIo = require("socket.io");
const messageProcessor = require("../backend/messageProcessor.js");
const login = require("../backend/login.js");
const md5 = require('md5');


let pad2 = (val) => {
  if (val < 10) {
    return '0' + val;
  } else {
    return val;
  }
}


class Chatroom{
  constructor(server) {
      
    var communicator= (socket) => {
      
      
      console.log("New client connected : ",socket.id);

      socket.on("disconnect", () => {
        console.log("Client disconnected : ",socket.id);
      });
      
      //receptionne un message, le traite puis le broadcast
      //A voir si promise
      messageProcessor(socket,(msg) =>{
        var d = new Date();
        var data = {
          user : {
            userName : msg.user.userName,
            avatar : msg.user.avatar
          },
          id: md5(Date.now() + msg.user.userId),
          message : msg.message,
          h: pad2(d.getHours()),
          m: pad2(d.getMinutes()),
          s: pad2(d.getSeconds())
        };
        this.io.emit("new message",data)
        console.log("message:",data);
      })



      socket.on("login",(loginData)=>{
        let user={
          ...loginData,
          avatar : 'https://gravatar.com/avatar/' + md5(loginData.userId) + '?s=40',
          socketId : socket.id
        } 
        const {userId,socketId, ...userPublic} = user // Copie user sans le champs userid (potentiellement privées))
        socket.emit('authAck',user)
        this.userList.push(user)
        this.io.emit('new user',userPublic) 
        console.log("new_user :",user)
      });
    }









    this.io = socketIo(server);
    this.io.on("connection",communicator);
    this.userList=[]
    //console.log("this:",this)






  }

  


}

module.exports =  Chatroom; 