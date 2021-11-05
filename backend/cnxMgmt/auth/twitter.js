import crypto from 'crypto'
import OAuth from 'oauth-1.0a'
import axios from 'axios'
import querystring from "querystring"
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
  
const token = {
    key: auth_twitter.access_token_key,
    secret: auth_twitter.access_token_secret
}


  const oauth = OAuth({
    consumer: {
        key: auth_twitter.consumer_key,
        secret: auth_twitter.consumer_secret,
    },
    signature_method: 'HMAC-SHA1',
    hash_function(base_string, key) {
        return crypto
            .createHmac('sha1', key)
            .update(base_string)
            .digest('base64')
    },
})




export class TwitterAuth {
    constructor(userList) {
        this.auth_tockens=[]
        this.sockets=[]
        this.userList=userList
    }
    get_auth = (socket,id_connexion) => {
        
        const request_data = {
            url: url.request_token,
            method: 'POST',
            data: {oauth_callback:server+"twitter_auth/?id="+id_connexion }
        }
        
        
        var params = {
            url: url.request_token,
            method: 'POST',
            headers: oauth.toHeader(oauth.authorize(request_data,token))
        }
          console.log("Twitter Auth, step 1")
        axios(params).then((data)=>{
            var response = querystring.parse(data.data)
            if(response.oauth_callback_confirmed == 'true') {
                console.log("step1/response")
                this.sockets[id_connexion]=socket
                socket.emit('openurl' , 'https://twitter.com/oauth/authenticate?oauth_token='+response.oauth_token)
            }
            else {
                console.log("step1/response: callback not confirmed")
            }
        }).catch((e)=>{
            console.log("Erreur step 1",e.request.res.headers)
        })
    }


    get_auth_step2 = (res,req,cbConnectUser) => {
        var socket=this.sockets[req.query.id]
        const request_data = {
            url: url.access_token,
            method: 'POST',
            data: {oauth_verifier:req.query.oauth_verifier}
        }
        const token = {
            key: req.query.oauth_token,
            secret: req.query.oauth_verifier
        }
        var params = {
            url: url.access_token,
            method: 'POST',
            headers: oauth.toHeader(oauth.authorize(request_data,token)),
            data: {oauth_verifier:req.query.oauth_verifier}
        }
        console.log("Twitter Auth, step 2")
        axios(params).then((data)=>{   
            var response = querystring.parse(data.data)
            console.log('retour step2')
            this.auth_tockens[response.oauth_token] = response.oauth_token_secret
            this.get_auth_info(response.oauth_token,(loginInfo)=>{
                cbConnectUser(loginInfo,req.query.id,socket)
            })
            //socket.emit('twitter_auth_ok',response.oauth_token)
            res.redirect(server+'close')
        }).catch((e)=>{
            console.log("erreur step2",e)
            res.redirect(server+'close')
        })
    }
    get_auth_info = (key,cb) =>{
        console.log('twitter/ recuperation des infos utilisateurs')
        const request_data = {
            url: url.userinfo,
            method: 'GET'
        }
        
        const token = {
            key: key,
            secret: this.auth_tockens[key]
        }
        const userSpaceOauth = OAuth({
            consumer: {
                key: key,
                secret: this.auth_tockens[key],
            },
            signature_method: 'HMAC-SHA1',
            hash_function(base_string, key) {
                return crypto
                    .createHmac('sha1', key)
                    .update(base_string)
                    .digest('base64')
            },
        })
        var params = {
            url: url.userinfo,
            method: 'GET',
            headers: oauth.toHeader(oauth.authorize(request_data,token))
        }
        axios(params).then((response)=> {
            console.log("response" ,response)
            cb({
                userName : response.data.name,
                avatar : response.data.profile_image_url,
                userId : response.data.screen_name+'@twitter'
            })
        }).catch((e)=>{
            console.log(e)
        })

/*
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

*/

    }
}