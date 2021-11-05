import React from 'react';
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
import Messages from './chatroom/oMessages';

//React Componenent
import Chatroom from './chatroom/chatroom.js';
import UserList from './userMgmt/userList.js';
import AlertActivatorButton from './chatroom/alertActivatorButton.js';
import IdentificationForm from './userMgmt/form.js';




const SOCKET_IO_URL = "/chatroom";
/*
window.addEventListener('load', function () {
    Notification.requestPermission().then( (status) => {
        // Cela permet d'utiliser Notification.permission avec Chrome/Safari
        if (Notification.permission !== status) {
            Notification.permission = status;
        }
    });
})
*/

  // ========================================

  
  class App extends React.Component {
    constructor(props) {
        const socket = socketIOClient(SOCKET_IO_URL)
        super(props);
        this.state={
            connected:false,
            socket,
            user : {
                userName : '',      //Nom d'affichage
                userId : ''         //Idenficateur : adresse email, handle twitter...
            },
            userList:[],
            userCounter:0,
            bNotifs: (window.Notification && Notification.permission === "granted"),
            messages:new Messages(socket)
        };
        this.identificationAcknoledgement = this.identificationAcknoledgement.bind(this);

        
        this.state.socket.on("Hello",(data)=>{
            console.log("Reception du Hello")
            this.setState({
                userList:data.userList,
                userCounter:data.userCounter
            })
            
            if(this.state.connected){
                console.log("demande de reconnexion :",this.state.user.type)
                switch(this.state.user.type) {
                    case 'twitter' : {
                        console.log("demande de reconnexion twitter")
                        this.state.socket.emit('twitter_auth'); 
                        break;
                    }
                    default : this.state.socket.emit('login',{
                        userName : this.state.user.userName,
                        userId : this.state.user.userId
                    })
                    
                }
            }
            else
            {
                this.setState(state=>{
                    return {messages:state.messages.setList(data.messages.map(msg=>{
                        return {...msg,date:new Date(msg.dateStr)}
                    }))}
                })
            }
            console.log("Hello",this.state.messages)
        })

        this.state.socket.on("Update userCounter",(data)=>{
            this.setState({userCounter:data})
        })
        
        this.state.socket.on("Update userList",(data)=>{
            this.setState({
                userList:data.map((u)=>{
                    return {
                        ...u,
                        isMe : (u.id==this.state.user.id)
                    }
                })
            })
        })

        this.state.socket.on("new message",(data)=>{
            var cbNewMessage = (msg)=>{
                msg.mentionnedUsers.forEach(id=> {
                    if(id==this.state.user.id){
                        console.log('Nouveau message pour moi !')
                        if (window.Notification && Notification.permission === "granted" && this.state.bNotifs) {
                            var n = new Notification(msg.user.userName+" vous a mentionné(e)",{
                                body:msg.textMessage,
                                image:'images/PodcastScience.png',
                                icon:msg.user.avatar
                            });
                        }
                    }
                })
            }
            this.setState(state=>{
                return {messages:state.messages.receive_message(data,cbNewMessage)}
            })
        })

        this.state.socket.on("Delete User",(data)=>{
            //recoit un id bizarre apres la 2eme deco...
            var newList = this.state.userList.filter( user=>{
                return (data==user.id)?false:true 
            })
            this.setState({userList:newList})
            var newUserCounter=this.state.userCounter-1
            this.setState({userCounter:newUserCounter})
        })
        
        this.state.socket.on("new user",(user)=>{ 
            console.log("ajout d'un user : ",user)
            var newUser={
                ...user,
                isMe : (user.id==this.state.user.id)
            }
            this.setState(state => {
                return { userList:[...state.userList,newUser] }
            });
        })

        
        
        //permet d'ouvrir un popup, notamment pour un authentificaction externe (twitter/fb)
        this.state.socket.on('openurl',(url) => {window.open(url,'Auth','menubar=no, scrollbars=no')})
    }
    
    identificationAcknoledgement(data){
        var user={
            userName : data.userName,    
            userId : data.userId,
            avatar : data.avatar,
            id : data.id,
            type: data.type
        }
        var newState= {
            connected:true,
            user
        }
        var style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = '.mention-'+(data.id)+' { color: red; }';
        document.getElementsByTagName('head')[0].appendChild(style);
        this.setState(newState)
        this.setState(state=>{
            return {messages:state.messages.setUser(user)}
        })
        document.getElementById("message-to-send").focus()
        console.log("connecté",this.state.messages)

    }
     
    updateNotifsState = (value) => {
        this.setState({bNotifs:value})
    }




    




    render() {
        return (
            <div>
                <div id="shadowing"></div>
                <div id="videobox" class="box">
                    <div class="inside_box"></div>
                </div>
                <div id="imagebox" class="box"></div>
                <header>
                    <div class="wrap clearfix">
                        <a href="http://podcastscience.fm" class="logo">
                            <img src="images/PodcastScience.png" width="210" height="25" alt="PodcastScience"/>
                        </a>
                        <h1 id="title-episode"/>
                        <div class="rec">Live</div>
                        <AlertActivatorButton bNotifs={this.state.bNotifs} updateNotifsState={this.updateNotifsState}/>
                    </div>
                </header>
                
                <div class="wrap content clearfix" >
                    <div class="onlive">
                        <div class="aside">
                            <div class="player">
                                <iframe src="http://static.infomaniak.ch/infomaniak/radio/html/podcastscience_player.html" height="80" width="400" scrolling="no" frameborder="0" allowtransparency="true"/>
                            </div>
                            <IdentificationForm  socket={this.state.socket} identificationAcknoledgement={this.identificationAcknoledgement} connected={this.state.connected}/>
                            <ul id="slider"></ul>
                            <div class="share">Passer le message sur
                                <a href="https://twitter.com/intent/tweet?button_hashtag=psLive&amp;text=Rejoignez+nous+sur+la+chatroom+et+suivez+@podcastscience+en+direct.&amp;url=http://live.podcastscience.fm" class="icon-twitter"><span class="caption">Twitter</span></a>
                                <a href="http://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Flive.podcastscience.fm&amp;p[summary]=Rejoignez+nous+sur+la+chatroom+et+suivez+le+live+podcastscience+en+direct" class="icon-facebook"><span class="caption">Facebook</span></a>
                            </div>
                            <div class="liens-sans-flash">
                                <p>
                                    <a href="http://bit.ly/PS-live96kMP3">Flux live mp3</a>
                                </p>
                                <p>
                                    <a href="http://bit.ly/PS-live96kM3U">Flux live m3u  </a>
                                </p>
                            </div>
                            
                        </div>
                        <Chatroom socket={this.state.socket} connected={this.state.connected} addUser={this.addUser} user={this.state.user} messages={this.state.messages} userList={this.state.userList}/>
                        <UserList socket={this.state.socket} list={this.state.userList} userCounter={this.state.userCounter}/> 
                    </div>
                </div>
            </div>
        );
    }
  } 
  // ========================================
  
  ReactDOM.render(
    <App />,
    document.getElementById('root')
  );
  
