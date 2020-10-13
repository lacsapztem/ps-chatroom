
const socketIo = require("socket.io");
const messageProcessor = require("../backend/messageProcessor.js");
const login = require("../backend/login.js");
const md5 = require('md5');


 
class Chatroom{
  constructor(server) {
    this.userCounter=0;
    var communicator= (socket) => {
      this.userCounter++;
      var connexionId = md5(socket.id+"@podcastscience")
      
      //console.log("New client connected : ",socket.id);
      console.log("userList : ",this.userList);
      console.log("New client connected : ",connexionId);

      this.chatroomNamespace.emit("Update userCounter",this.userCounter)


      socket.on("disconnect", () => {
        this.userCounter--;
        this.userList = this.userList.filter( user=>{
            return connexionId!=user.id
        })
        this.chatroomNamespace.emit("Delete User",connexionId)
        
        console.log("userList : ",this.userList);
        console.log("Client disconnected : ",connexionId);
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
          type : 'message',
          id: md5(Date.now() + msg.user.userId), 
          message : msg.message,
          dateStr : new Date
        };
        this.chatroomNamespace.emit("new message",data)
        this.messageList.push(data)
        console.log("message:",data);
      }) 



      socket.on("login",(loginData)=>{
        let user={
          ...loginData,
          avatar : 'https://gravatar.com/avatar/' + md5(loginData.userId) + '?s=40',
          socketId : socket.id,
          id : connexionId
        } 
        const {userId,socketId, ...userPublic} = user // Copie user sans le champs userid et socket id (potentiellement privées))
        socket.emit('authAck',user)
        this.userList.push(user) 
        this.chatroomNamespace.emit('new user',userPublic) 
        //Envoie de la notif de l'arrivée d'un nouveau user
        var data = { 
          type : 'notif',
          id: md5(Date.now() + user.userName), 
          message : user.userName+" s'est connecté(e)",
          dateStr : new Date 
        };
        this.chatroomNamespace.emit("new message",data)
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