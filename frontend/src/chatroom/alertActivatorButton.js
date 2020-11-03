import React from 'react';


class AlertActivatorButton extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick = () => {
        if (window.Notification) {
            if(Notification.permission === "granted"){
                this.props.updateNotifsState(!this.props.bNotifs)
            }
            else {
                Notification.requestPermission().then( (status) => {
                    // Cela permet d'utiliser Notification.permission avec Chrome/Safari
                    if (Notification.permission !== status) {
                        Notification.permission = status;
                    }
                    this.props.updateNotifsState(true)
                })
            }
        }
    }
    
    render() {
        var bubbleClass=''
        var tooltip = ''
        if (window.Notification && Notification.permission === "granted" && this.props.bNotifs){
            bubbleClass = 'icon-bubblemoon tooltip mention_alert'
            tooltip = 'Cliquer ici pour désactiver les alertes'
        } else {
            bubbleClass = 'icon-bubble2moon tooltip mention_alert'
            tooltip = 'Cliquer ici pour activer les alertes'
        }
        return (
            <div class={bubbleClass}  onClick={this.handleClick} aria-label={tooltip}></div>
        )
    }
}



export default AlertActivatorButton;