import React from 'react';
const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };

let pad2 = (val) => {
    if (val < 10) {
      return '0' + val;
    } else {
      return val;
    }
  }
  

class MessagesList extends React.Component {
    render_date(d) {
        return (
            <li id={'date_{msg.date.toISOString()}'} class="message_me message_info ">
                <p>
                    <i>Nous somme le {d.toLocaleDateString('fr-FR', options)}</i>
                </p>
            </li>
        )
    }
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
                    <span class="timestamp">&nbsp;[{pad2(msg.date.getHours())}:{pad2(msg.date.getMinutes())}:{pad2(msg.date.getSeconds())}]</span>
                    <p id="msg_{msg.id}" >{msg.message}</p>
                </div>
            </li>
        )
    }
    render_message =(msg) =>{
        var retval=[]
        console.log("date "+typeof(msg.date)+":",msg.date)
        
        var messageDate=msg.date.toLocaleDateString('fr-FR', options)
        if(this.date!=messageDate){
            this.date=messageDate
            retval.push(this.render_date(msg.date))
        }
        switch(msg.type){
            case "notif" : 
                retval.push(this.render_notif(msg));
                break;
            default : 
                retval.push(this.render_real_message(msg));
        }
        return retval;
    }
    render=()=> {
        this.date="00/00/0000"
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