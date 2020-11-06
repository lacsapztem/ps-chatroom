import  createDOMPurify from 'dompurify';
import jsdom from 'jsdom';
import md5 from 'md5'

const {JSDOM} = jsdom;
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
    var idIndexedUserList = userList.getList().reduce(reducer ,[]) 
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

const messageProcessor = (userList,msg,cbBroadcastMessage)=>{
        //sanitization du message
        var processedMessage={
            ...msg,
            message:DOMPurify.sanitize(msg.message)
        };
        
        //traitement du message
        processedMessage=mentionsProcessor(processedMessage,userList);


        //verifications et construction de la structure à envoyer
        // La création d'un nouvel objet permet d'éviter la propagation de donnée ajouté en amont
        if(typeof(processedMessage.user) == "undefined") {
            var user = { 
              userName : "Anonyme",
              avatar : ""
            }
        } else { 
            var user = { 
                userName : processedMessage.user.userName,
                avatar : processedMessage.user.avatar
            }
        }
        var data = { 
            user,
            type : 'message',
            id: md5(Date.now() + processedMessage.user.userId), 
            message : processedMessage.message,
            htmlMessage : processedMessage.htmlMessage,
            textMessage : processedMessage.textMessage,
            mentionnedUsers : processedMessage.mentionnedUsers,
            dateStr : new Date
        };

        console.log("processed message:",data )
        cbBroadcastMessage(data);
}

export default messageProcessor