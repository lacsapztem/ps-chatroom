import React from 'react';


class MessagesList extends React.Component {
    render_message(msg) {
        return (
            <li id={msg.id} >
                <img src={msg.user.avatar} alt="Avatar {msg.user.userName}" class="avatar avatar40"/>
                <div class="message" >
                    <span class="pseudo">{msg.user.userName}</span>
                    <span class="timestamp">&nbsp;[{msg.h}:{msg.m}:{msg.s}]</span>
                    <p id="msg_{msg.id}" >{msg.message}</p>
                </div>
            </li>
        )
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