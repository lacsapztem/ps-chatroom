import React from 'react';
import ReactDOM from 'react-dom';
import socketIOClient from "socket.io-client";
import Chatroom from './chatroom/chatroom.js';
import IdentificationForm from './userMgmt/form.js';
import UserList from './userMgmt/userList.js';

const SOCKET_IO_URL = "http://127.0.0.1:3000";
const socket = socketIOClient(SOCKET_IO_URL);


  // ========================================

  class App extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            connected:false,
            user : {
                userName : '',      //Nom d'affichage
                userId : ''         //Idenficateur : adresse email, handle twitter...
            },
            userList:[]
        };
        this.identificationAcknoledgement = this.identificationAcknoledgement.bind(this);
    }
    
    identificationAcknoledgement(data){
        this.setState({
            connected:true,
            user :{
                userName : data.userName,    
                userId : data.userId,
                avatar : data.avatar
            }
        })

        
        //$('#login').fadeOut()
        /*
        $('#send-message').removeAttr('disabled')
        $('#send-message').css('opacity',1)
        */
        //$('#message-form').fadeIn()


        //TODO  :  $('#message-to-send').focus()
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
                    </div>
                </header>
                
                <div class="wrap content clearfix" >
                    <div class="onlive">
                        <div class="aside">
                            <div class="player">
                                <iframe src="http://static.infomaniak.ch/infomaniak/radio/html/podcastscience_player.html" height="80" width="400" scrolling="no" frameborder="0" allowtransparency="true"/>
                            </div>
                            <IdentificationForm  socket={socket} identificationAcknoledgement={this.identificationAcknoledgement} connected={this.state.connected}/>
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
                        <Chatroom socket={socket} connected={this.state.connected} user={this.state.user}/>
                        <UserList list={this.state.userList}/> 
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
  
