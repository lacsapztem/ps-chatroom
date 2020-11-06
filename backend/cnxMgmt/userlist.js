import md5 from 'md5'

export class UserList{
    constructor(chatroomNamespace) {
        this.list=[];
        this.chatroomNamespace=chatroomNamespace
    }
    login = (loginData,connexionId,socket)=>{
        let user={
          ...loginData,
          avatar : 'https://gravatar.com/avatar/' + md5(loginData.userId) + '?s=40',
          socketId : socket.id,
          id : connexionId
        } 
        const {userId,socketId, ...userPublic} = user // Copie user sans le champs userid et socket id (potentiellement privées))
        socket.emit('authAck',user)
        this.list.push(user) 
        this.chatroomNamespace.emit('new user',userPublic) 
        //Envoie de la notif de l'arrivée d'un nouveau user
        var data = { 
          type : 'notif',
          id: md5(Date.now() + user.userName), 
          message : user.userName+" s'est connecté(e)",
          dateStr : new Date ,
          mentionnedUsers : []
        };
        this.chatroomNamespace.emit("new message",data)
      }

    disconnect=(connexionId) => {
        this.list = this.list.filter( user=>{
            return connexionId!=user.id
        })
        this.chatroomNamespace.emit("Delete User",connexionId)
        
        console.log("userList : ",this.userList);
        console.log("Client disconnected : ",connexionId);
      }
    getList = () => {
      return this.list;
    }

    
    
}

