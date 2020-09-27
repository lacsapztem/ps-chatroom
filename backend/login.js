const md5 = require('md5');

login = (socket)=> {
    socket.on("login",(loginData)=>{
        socket.emit('authAck',{
            ...loginData,
            avatar : 'https://gravatar.com/avatar/' + md5(loginData.userId) + '?s=40'
        })
    });
}


module.exports =  login