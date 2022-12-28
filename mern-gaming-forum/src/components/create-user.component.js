import React, { Component } from 'react';
import axios from 'axios';

export default class CreateUser extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.clearCookie = this.clearCookie.bind(this);
        this.createCookie = this.createCookie.bind(this);

        this.state = {
            username: '',
            password: '',
        }
    }

    onChangeUsername(e) { //if user enters username, it will call this function
        this.setState({
            username: e.target.value //target is text box, so whatever user inputs. just updates username.
        });
    }

    onChangePassword(e) { //if user enters username, it will call this function
        this.setState({
            password: e.target.value //target is text box, so whatever user inputs. just updates username.
        });
    }

    onSubmit(e) {
        e.preventDefault(); //instead of doing normally do, it will do what we want (the following:)
        //you CAN create variables as long as its only used in this one method



        //get list of users
        let userList = [];
        let promises = [];
        let inputtedUsername = this.state.username;
        console.log('inputtedUsername: ' + inputtedUsername);

        if (inputtedUsername.length < 3) {
            alert("Username must be at least 3 characters!");
            window.location = '/user/';
        }

        promises.push(
            axios.get('/users/')
                .then(response => {   //we want to get all the fields for exercises. entire JSON object, put into array
                    userList = response.data.map(user => user.username)

                    console.log('userList: ' + userList);
                })
                .catch((error) => {
                    console.log(error);
                })
        )
        let alreadyHaveAccount = false;
        Promise.all(promises).then(() => {
            if (userList.includes(inputtedUsername)) {
                alert("You already have an account!");
                alreadyHaveAccount = true;
            }

            if (alreadyHaveAccount == false) {
                const user = {
                    username: inputtedUsername,
                    password: this.state.password,
                    bio: 'No biography.',
                    pic: 'data:image/png;base64,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',
                }

                this.clearCookie();

                console.log(user);
                //sends post  request to the backend endpoint. expects a JSON object in request.  this is the 'user' input argument.
                axios.post('/users/add', user)//lookg at users.js 'post'
                    .then(res => console.log(res.data));

                this.setState({
                    username: '', //once they've submitted a new user, don't take back to home. 
                    password: '',
                    pic: '',
                })              //instead give option to submit multiple users.
                console.log('this.state.username: ' + inputtedUsername);
                //this.createCookie("currentCookie", inputtedUsername, 1);
                console.log('username from cookie: ' + this.getCookie("currentCookie"));
                console.log('cookie status: ' + document.cookie);
                window.location = '/login';
            }
        });
    }
    //https://www.guru99.com/cookies-in-javascript-ultimate-guide.html
    createCookie(cookieName, cookieValue, daysToExpire) {
        var date = new Date();
        date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
        document.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toGMTString();
    }
    //https://www.w3schools.com/js/js_cookies.asp
    getCookie(cname) {
        let name = cname + "=";
        let decodedCookie = decodeURIComponent(document.cookie);
        let ca = decodedCookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }

    //https://stackoverflow.com/questions/179355/clearing-all-cookies-with-javascript/179514
    clearCookie() {
        var cookies = document.cookie.split(";");

        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i];
            var eqPos = cookie.indexOf("=");
            var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
            document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
        }
    }

    render() {
        if (this.getCookie("currentCookie").length != 0) {  //if the user is already signed in
            alert("You are already logged in.");
            this.props.history.push('/');
        }
        return (
            <div>
                <h3>Create New User</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Username: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.username}
                            onChange={this.onChangeUsername}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.password}
                            onChange={this.onChangePassword}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Create User" className="btn btn-primary" />
                    </div>

                </form>
            </div>
        )
    }
}