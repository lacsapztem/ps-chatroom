const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
 
const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);



const mentionsProcessor = (inputMessage,userList)=>
{
    var patternUserName ='\\[(.*?)\\]';
    var patternUserID = '\\((\\w*?)\\)';
    var regexUserID =  new RegExp("@"+patternUserName+patternUserID,"g");
    var mentionnedUsers=[];
    const reducer = (accumulator, currentValue)=>{
        accumulator[currentValue.id]=currentValue.userName
        return accumulator
    }
    var idIndexedUserList = userList.reduce(reducer ,[]) 
    var outputMessage={
        ...inputMessage,
        htmlMessage :inputMessage.message.replace(regexUserID,(correspondance, pUserName /*p1*/, pUserId /*p2*/, decalage, input) => {
            if(typeof(idIndexedUserList[pUserId])!='undefined'){
                // l'utilisateur mentionné existe, on remplace le tag par une mention mise en avant et on ajoute l'id a la liste des utilsatur mentionné
                mentionnedUsers.push(pUserId);
                return '<span class="mention-tag mention-'+pUserId+'">@'+idIndexedUserList[pUserId]+'</span>';
            } else
            {
                // l'utilisateur mentionné n'existe pas , on remplace le tag par le nom qui y figure sans le mettre en avant
                return pUserName
            }

        }),
        textMessage: inputMessage.message.replace(regexUserID,'$1')
    }
    outputMessage.mentionnedUsers=mentionnedUsers;
    return outputMessage;
}

messageProcessor = (socket,userList,broadcastMessage)=>{
    socket.on("new message",(msg)=>{
        //sanitization du message
        // Doit être le premier traitement
        processedMessage={
            ...msg,
            message:DOMPurify.sanitize(msg.message)};


        processedMessage=mentionsProcessor(processedMessage,userList);
        /*
        //Remplace les code des mentions par les noms d'utilisateurs trié par longueur décroissante
        processedMessage=userList.sort(comparator).reduce(reducer,{
            ...msg,
            textMessage:msg.message, 
            htmlMessage:msg.message,
            mentionnedUsers : []
        })
        */

        console.log("processed message:",processedMessage )
        broadcastMessage(processedMessage);
    }); 
}


module.exports =  messageProcessor; 