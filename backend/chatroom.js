
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
    this.userCounter=0;
    var communicator= (socket) => {
      this.userCounter++;
      
      console.log("New client connected : ",socket.id);
      this.chatroomNamespace.emit("Update userCounter",this.userCounter)
      socket.on("disconnect", () => {
        this.userCounter--;
        this.userList = this.userList.filter( user=>{return (socket.id==user.socketId)?false:true })
        this.chatroomNamespace.emit("Update userList",this.userList)
        this.chatroomNamespace.emit("Update userCounter",this.userCounter)
        console.log("Client disconnected : ",socket.id);
        
      });

      var initData={
        userList: this.userList,
        messages : this.messageList.filter( (msg,idx,msgs)=>{
          return idx>=(msgs.length-10);
        }),
        userCounter: this.userCounter
        
      }
      socket.emit("Hello",initData)
      
      //receptionne un message, le traite puis le broadcast
      //A voir si promise
      messageProcessor(socket,(msg) =>{
        var d = new Date();
        if(typeof(msg.user) == "undefined") {
          var user = { 
            userName : "Anonyme",
            avatar : ""
          }
        }
        else
        {
          var user = { 
            userName : msg.user.userName,
            avatar : msg.user.avatar
          }
        }
        var data = { 
          user,
          id: md5(Date.now() + msg.user.userId), 
          message : msg.message,
          h: pad2(d.getHours()),
          m: pad2(d.getMinutes()),
          s: pad2(d.getSeconds())
        };
        this.chatroomNamespace.emit("new message",data)
        this.messageList.push(data)
        console.log("message:",data);
      }) 



      socket.on("login",(loginData)=>{
        let user={
          ...loginData,
          avatar : 'https://gravatar.com/avatar/' + md5(loginData.userId) + '?s=40',
          socketId : socket.id
        } 
        const {userId,socketId, ...userPublic} = user // Copie user sans le champs userid et socket id (potentiellement privées))
        socket.emit('authAck',user)
        this.userList.push(user) 
        //this.chatroomNamespace.emit('new user',userPublic) 
        this.chatroomNamespace.emit("Update userList",this.userList)
      });
    }









    this.io = socketIo(server);
    this.chatroomNamespace = this.io.of('/chatroom');
    this.chatroomNamespace.on("connection",communicator);
    this.userList=[]
    this.messageList=[]
    //console.log("this:",this)






  }

  


}

module.exports =  Chatroom; 