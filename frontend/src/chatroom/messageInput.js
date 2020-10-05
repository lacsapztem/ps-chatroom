import React from 'react';



class MessageInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: ''};
    
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
    handleChange(event) {
        this.setState({value: event.target.value});
    }
    
    handleSubmit(event) {
        var data=this.state.value
        this.props.messages.emit_message(data);
        this.setState({value: ""});
        event.preventDefault();
    }

    render() {
        const classes = this.props.connected ? 'fade_visible' : 'fade_hide'
        return (

            <div  class="write" >
                <form id="message-form" class={classes}  onSubmit={this.handleSubmit}>
                    <input type="text" placeholder="Poster un message" id="message-to-send" class="newmsg" value={this.state.value} onChange={this.handleChange}/>
                    <input type="submit" value='Envoyer' id="send-message" />
                    <div>
                        <span class="minitext">Posez vos questions avec la mention <b>@ps</b></span>
                    </div>
                </form>
            </div>
        )
    }
}



export default MessageInput;