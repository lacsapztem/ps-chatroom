const oauth   = require('oauth')
const querystring  = require("querystring")
const server = process.env.PSLIVE_URL
const url = {
  filter      : 'https://stream.twitter.com/1.1/statuses/filter.json',
  request_token   : 'https://api.twitter.com/oauth/request_token'  ,
  access_token  : 'https://api.twitter.com/oauth/access_token',
  userinfo  : 'https://api.twitter.com/1.1/account/verify_credentials.json'
}

const auth_twitter = {
    consumer_key:         process.env.PSLIVE_TWITTER_CONSUMERKEY,
    consumer_secret:      process.env.PSLIVE_TWITTER_CONSUMERSECRET,
    access_token_key:     process.env.PSLIVE_TWITTER_TOKENKEY,
    access_token_secret:  process.env.PSLIVE_TWITTER_TOKENSECRET
}

class TwitterAuth {
    constructor() {
        this.auth_tockens=[]
    }

    get_auth = (socket,id_connexion) => {
        var request = oauth.post(
            url.request_token,
            auth_twitter.access_token_key,
            auth_twitter.access_token_secret,
            {oauth_callback:server+"twitter_auth/?id="+id_connexion}, 
            (e,data) => {
                if(e) {
                    console.log(e)
                } else {
                    var response = querystring.parse(data)
                    if(response.oauth_callback_confirmed == 'true') {
                        console.log("step1/response:",response)
                        sockets[id_connexion]=socket
                        socket.emit('openurl' , 'https://twitter.com/oauth/authenticate?oauth_token='+response.oauth_token)
                    }
                }
            }
        )
    }
    get_auth_step2 = (res,req) => {
        console.log("step2",req.query)
        var socket=sockets[req.query.id]
        var request = oauth.post(
            url.access_token,
            auth_twitter.access_token_key,
            auth_twitter.access_token_secret,
            {
                oauth_token:req.query.oauth_token,
                oauth_verifier:req.query.oauth_verifier
            }, 
            (e,data) => {
                if(e) {
                    console.log(e)
                } else {
                    var response = querystring.parse(data)
                    this.auth_tockens[response.oauth_token] = response.oauth_token_secret
                    socket.emit('twitter_auth_ok',response.oauth_token)
                    res.redirect(server+'close')
                }
            }
        )
    }
    get_auth_info = (key,cb) =>{
        console.log('twitter/ recuperation des infos utilisateurs',key)
        var request = oauth.get(
            url.userinfo,
            key,
            this.auth_tockens[key] ,
            (e,data) => {
                if(e) {
                    console.log(e)
                } else  {
                    var response = JSON.parse(data)
                    console.log("response" ,response)
                    cb({
                        username : response.name,
                        avatar : response.profile_image_url,
                        mail : response.screen_name+'@twitter'
                    })
                }
            }
        )
    }
}

module.exports = TwitterAuth