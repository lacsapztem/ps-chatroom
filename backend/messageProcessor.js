const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
 
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);


messageProcessor = (socket,broadcastMessage)=>{
    socket.on("new message",(msg)=>{
        processedMessage={
            ...msg,
            message:DOMPurify.sanitize(msg.message)};
        console.log("message:",processedMessage.message)
        broadcastMessage(processedMessage);
    });
}


module.exports =  messageProcessor; 