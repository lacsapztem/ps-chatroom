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

    render() {
        return (
            <div class="online">
                <h2 class="nb-connected">
                    <p><span class="connectes">1</span> auditeur connecté</p>
                    <p>(plus <span class="caches">1</span> qui se cache)</p>
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

