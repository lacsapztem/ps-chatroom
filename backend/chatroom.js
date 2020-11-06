
import socketIo from 'socket.io'
import messageProcessor from '../backend/messageProcessor.js'
import md5 from 'md5'
import {UserList} from  './cnxMgmt/userlist.js'
 
export class Chatroom{
  constructor(server) {
    this.userCounter=0;


    
    var communicator= (socket) => {
      this.userCounter++; 
      var connexionId = md5(socket.id+"@podcastscience")
      
      console.log("New client connected : ",connexionId);

      this.chatroomNamespace.emit("Update userCounter",this.userCounter)
    
  
      //initialise les données clients
      var initData={
        userList: this.userList.getList(),
        messages : this.messageList.filter( (msg,idx,msgs)=>{
          return idx>=(msgs.length-10); 
        }),
        userCounter: this.userCounter
      }
      socket.emit("Hello",initData)
    



      //receptionne un message, le traite puis le broadcast
      socket.on("new message",(msg)=>{
        messageProcessor(this.userList,msg,(processedMessage) =>{
          this.chatroomNamespace.emit("new message",processedMessage)
          this.messageList.push(processedMessage)
        }) 
      });





      socket.on("login",(logindata)=>{
        this.userList.login(logindata,connexionId,socket)
      });
      


      socket.on("disconnect", () => {
        this.userCounter--;
        this.userList.disconnect(connexionId);
      });
    }  





    this.io = socketIo(server);
    this.chatroomNamespace = this.io.of('/chatroom');
    this.chatroomNamespace.on("connection",communicator);
    this.userList=new UserList(this.chatroomNamespace);
    this.messageList=[]







  }

  


}
