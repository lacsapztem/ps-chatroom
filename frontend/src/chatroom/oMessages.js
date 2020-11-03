

class Messages {
    constructor(socket){
        this.list=[]
        this.user=null
        this.socket=socket
    }
    
    emit_message = (message)=>{ 
        var _user=this.user
        console.log("this:",this)
        console.log("user:",this.user)
        console.log("_user:",_user)
        var data = {
            user:_user,
            message
        }
        data.user=this.user
        this.socket.emit("new message", data) 
    }

    receive_message = (msg,cbAlert)=>{
        cbAlert(msg) 
        this.list=[...this.list,{
            ...msg,
            date: new Date(msg.dateStr)
        }];
        return  {...this}
    }

    setList= (list) =>{
        this.list=list;
        return  {...this}
    }

    setUser= (user) =>{
        this.user=user;
        return  {...this}
    } 

}


export default Messages;