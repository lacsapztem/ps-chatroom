import React from 'react';


let pad2 = (val) => {
    if (val < 10) {
      return '0' + val;
    } else {
      return val;
    }
  }
  

class MessagesList extends React.Component {
    render_notif(notif) {
        return (
            <li id={notif.id} class="message_me message_info ">
                <p>
                    <i>* {notif.message}</i>
                </p>
            </li>
        )
    }
    render_real_message(msg) {
        return (
            <li id={msg.id} >
                <img src={msg.user.avatar} alt="Avatar {msg.user.userName}" class="avatar avatar40"/>
                <div class="message" >
                    <span class="pseudo">{msg.user.userName}</span>
                    <span class="timestamp">&nbsp;[{pad2(msg.date.getHours())}:{pad2(msg.date.getMinutes())}:{pad2(msg.date.getSeconds())}</span>
                    <p id="msg_{msg.id}" >{msg.message}</p>
                </div>
            </li>
        )
    }
    render_message =(msg) =>{
        switch(msg.type){
            case "notif" : return this.render_notif(msg);
            default : return this.render_real_message(msg)
        }
    }
    render() {
        return (
            <div id="onChat">   
                <div id="main" class="chatroom">   
                    <div id="wrap_messages"    >
                        <div id="messages"    >
                            <h2 class="clearfix nb-connected" />
                            <ul id="message-box">
                                {
                                    this.props.messages.list.map(this.render_message )
                                }
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        ) 
    }
}



 


export default MessagesList;