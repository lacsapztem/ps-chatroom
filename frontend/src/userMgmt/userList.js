import React from 'react';



class UserList extends React.Component {
    //props nécessaire : list

    constructor(props) {
        super(props);
    }


    render_user(user) {
        return (
            <li id={user.id}><img src={user.avatar} alt="Avatar " class="avatar40"/>
                <span class="pseudo">{user.userName}</span>
            </li>
        );
    }

    render_connectedNumber(){
        if(this.props.list.length<=1) {
            return (
                <p><span class="connectes">{this.props.list.length}</span> auditeur connecté</p>
            )
        } else {
            return (
                <p><span class="connectes">{this.props.list.length}</span> auditeurs connectés</p>
            )
        }
    }

    render_hiddenNumber(){
        var nb=this.props.userCounter-this.props.list.length
        if(nb<=1) {
            return (
                <p>(plus <span class="caches">{nb}</span> qui se cache)</p>
            )
        } else {
            return (
                <p>(plus <span class="caches">{nb}</span> qui se cachent)</p>
            )
        }
    }
    render() {
        console.log("Rendering userList",this.props.list)
        return (
            <div class="online">
                <h2 class="nb-connected">
                    {this.render_connectedNumber()}
                    {this.render_hiddenNumber()}
                </h2>
                <ul id="members-list">
                    {
                        this.props.list.map(this.render_user )
                    }
                </ul>
            </div>
        );
    }
}  

export default UserList;

