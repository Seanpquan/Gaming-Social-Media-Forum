import React, { Component } from 'react';

export default class Logout extends Component {
    constructor(props) {
        super(props);

    }


    render() {
        document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
        document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/ALL;';
        document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/users-list;';
        document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/create;';
        document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/logged-exercises;';
        document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/edit;';
        document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/user;';
        document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/edit-user;';
        document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/view-post;';
        this.props.history.push('/login');
        return (
            <div>
                <p>You are on the Logout page</p>
            </div>
        )
    }
}

