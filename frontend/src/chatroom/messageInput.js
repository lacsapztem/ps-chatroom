import React from 'react';
import { MentionsInput, Mention } from 'react-mentions';


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
        const autocompleteList = this.props.userList.filter((u)=>{return !(u.isMe)}).map((u)=>{
            return {
                id : u.id ,
                display : u.userName
            }
        })
        console.log("liste : ",autocompleteList)
        return (

            <div  class="write" >
                <form id="message-form" class={classes}  onSubmit={this.handleSubmit}>
                    <MentionsInput 
                    placeholder="Poster un message" 
                    id="message-to-send" 
                    singleLine={true}
                    allowSpaceInQuery={true}
                    allowSuggestionsAboveCursor={true}
                    class="newmsg" 
                    className="newmsg"
                    autocomplete="off"
                    value={this.state.value} 
                    onChange={this.handleChange}
                    >
                        <Mention
                        data={autocompleteList}
                        //markup='@__display__'//'<span class="mention-tag mention-__id__">__display__</span>'
                        appendSpaceOnAdd={true}    
                        style={{backgroundColor: '#fcfcfc'}}
                        displayTransform={(id,display)=>{return '@'+display}}
                        //regex={/@([@].+)/}
                        />
                    </MentionsInput>
                    <input type="submit" value='Envoyer' id="send-message" />
                    <div>
                        <span class="minitext">Posez vos questions avec la mention <b>@ps</b></span>
                    </div>
                </form>
            </div>
        )
    }
}

//trigger="@"


export default MessageInput;