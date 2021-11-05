import React from 'react';


import MessagesList from './messagesList.js';
import MessageInput from './messageInput.js';


 


class Chatroom extends React.Component {

    render() {
        return (
            <div>
            
                <div id="onChat">   
                    <div id="main" class="chatroom">   
                        <div id="wrap_messages"    >
                            <MessagesList messages={this.props.messages}/>
                        </div>
                    </div>
                </div>
                <MessageInput messages={this.props.messages} connected={this.props.connected} userList={this.props.userList}/>
            </div>
        );
    }
}    

export default Chatroom;