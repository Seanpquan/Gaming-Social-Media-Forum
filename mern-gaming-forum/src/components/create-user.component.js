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
                    pic: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAiCAMAAADiW5DOAAABOFBMVEU4mP8pKFv///8pJ1g4mv84nP8oJVY2mP/l5eUoI1M0l/85nv8pKl0ylf8vlP83jvAqMWY3kvUpLF81iuU2huQ1hOExZrQrNGv4/P84mP00fdcvUZYrOHAgH1M4lfs3lPg0eM8sPXgrOnQmJlgvk//t9v43kPIwXqguS40sQn4qLmMkJFeOxf5jrv41gt0ybr8xY7AxYa6DhqUvVp0tSIgtRYPI4/+22f9zt//m8v6Iwf5ssv5osP5frf5Zqf7A3f02i+vr6OXo5+U6jOROluO6vs8zcsYyabkkQYU/QW8rN28wMmPd7/+x2P9Ppf9Dn//P5f7F4P5/vP5Mov5IoP6WyP3r7fPo6vHV3OTI1eSoxOOYvON2quNqpOOZuOGRst4zdMkzc8iWmrSPk68wW6QwWqOAgJ8wWZ9y1jJkAAACUklEQVQ4y22U53LrIBBGUVggapbl2HKvcU+1Haf3e9Nv772X93+DLKBiz2R/wezR4UMMkMWFsAo7a2AJArKIsODoaSHsxMzLY9cVJCnhpo5P5pjCquXKDjBSq9cIswEnrrVfSJjOQVtIolj6O21VWoNykJWQaB92IqazlpISltuiJqeUcm46ZZ9gpY46minstuW8/ifDDcNAxsAy/zMFHRQU81ZbeiY2uZHOpylH9LarsrdXJfOiKJTmFhFaLnm+V+pTFPWUSIhtZA71jrIZXOGKMQBgsEkN2iwqkbtGzrYtopgSLtS3Afwu9mCL07QHGiLnu27I4KeDujfJp/s+sTe4kVmKmI/PhWbW5Z4qedy7+ZOxBjWcrGYE+YxIkofK3M462AFXjK6vVsgsIaOKb2KoJnpyEfM49BRHIUIDYH6f46hXC5lHEEbmITKyYb2pJmaDaSYMzxqawR2z3FCP+Y95Bk6HVDF5394wNY6hY0ZDgaMXC/D01cAZQZJHF7vUIp4JNRuMJPsKRd28hIaXpxOqg0HEfLFIJJqggE9tW/0psxxryCf0RH9xSDFzFq4oajI5iJkPzxLRJpdrNGV43os1FjlbTcV8vSUNKk3FJ1GlyPkTSFab8uhABjGC3cWF/UQ0oBHTLMaaV8jsvbakg9msW4mZvGfbDADTvNmT9+JEiJqXawTlipFUpRw0cl4NrB19B79dt9KOvH4zDOUmddKt6+/RXR5Xl42Harn6L3kTfhkrDyAry79n35aLm1iVSG4u5t+fd+O76sqso3o3fq9b98jXNGm4GsdpAAAAAElFTkSuQmCC',
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