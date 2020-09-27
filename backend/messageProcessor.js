



messageProcessor = (socket,broadcastMessage)=>{
    socket.on("new message",broadcastMessage);

}


module.exports =  messageProcessor; 