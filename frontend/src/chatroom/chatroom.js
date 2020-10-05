import React from 'react';


import MessagesList from './messagesList.js';
import MessageInput from './messageInput.js';


 


class Chatroom extends React.Component {
    constructor(props) {
        super(props);
    }

    

    render() {
        return (
            <div>
                <MessagesList messages={this.props.messages} />
                <MessageInput messages={this.props.messages} connected={this.props.connected}/>
            </div>
        );
    }
}    

export default Chatroom;