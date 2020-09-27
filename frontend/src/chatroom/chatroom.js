import React from 'react';

import MessagesList from './messagesList.js';
import MessageInput from './messageInput.js';


 


class Chatroom extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            messagesList : [],
            userList : []
        };
        this.props.socket.on("new message",this.receive_message)
        this.props.socket.on("new user",this.addUser)
    }

    emit_message = (message)=>{ 
        var data = {
            user : this.props.user,
            message
        }
        this.props.socket.emit("new message", data) 
    }
    receive_message = (msg)=>{ 
        this.setState(state => {
            return { messagesList:[...state.messagesList,msg] }
        });
    }
    addUser = (user)=>{ 
        console.log("ajout d'un user : ",user)
        this.setState(state => {
            return { userList:[...state.userList,user] }
        });
    }
    

    render() {
        return (
            <div>
                <MessagesList   messagesList={this.state.messagesList} />
                <MessageInput emit_message={this.emit_message} connected={this.props.connected}/>
            </div>
        );
    }
}  

export default Chatroom;