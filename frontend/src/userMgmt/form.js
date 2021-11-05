import React from 'react';


class IdentificationForm extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            userName : '',
            userId : ''
        };
        this.props.socket.on("authAck",this.props.identificationAcknoledgement)
        
        this.handleUserNameChange = this.handleUserNameChange.bind(this);
        this.handleUserIdChange = this.handleUserIdChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    
     
    handleUserNameChange(event) {
        this.setState({userName: event.target.value});
    }
    
     
    handleUserIdChange(event) {
        this.setState({userId: event.target.value});
    }
    
    handleSubmit(event) {
        //this.props.emit_message(this.state.value);
        console.log("login :", this.state)
        this.props.socket.emit('login',{
            userName : this.state.userName,
            userId : this.state.userId
        })
        this.setState({
            userName : '',
            userId : ''
        });
        event.preventDefault();
    }

    launchTwitterAuth=(event)=>{
        this.props.socket.emit('twitter_auth')
        //event.preventDefault();
    }


    render() {
        const classes = this.props.connected ? 'login clearfix fade_hide' : 'login clearfix fade_visible'
        return (
            <div id="login" class={classes}>
                <h2>Connectez-vous<span class="small">pour participer à la discussion!</span></h2>
                <p id="wrong-mail" class="ps_alert"></p>
                <div class="info">
                    <p>Pour avoir un joli avatar, créez le sur <a href="http://fr.gravatar.com/">Gravatar</a>.</p>
                </div>
                <form id="loginform"  onSubmit={this.handleSubmit}>
                    <input type="text" name="login" placeholder="Nom d'utilisateur" id="username"  onChange={this.handleUserNameChange}/>
                    <input type="text" name="mail" placeholder="E-mail" id="mail"  onChange={this.handleUserIdChange}/>
                    <input type="submit" value="Discuter"/>
                    <a id="twitter_auth_link" onClick={this.launchTwitterAuth}><img src="images/sign-in-with-twitter-link.png"/></a>
                </form>
            </div>
        );
    }
}  

export default IdentificationForm;