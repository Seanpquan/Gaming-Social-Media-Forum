import React, { Component } from 'react';
import axios from 'axios';

export default class Login extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.deleteCookies = this.deleteCookies.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.clearCookie = this.clearCookie.bind(this);
        this.createCookie = this.createCookie.bind(this);

        this.state = {
            username: '',
            password: '',
        }
    }

    deleteCookies() {
        var allCookies = document.cookie.split(';');

        // The "expire" attribute of every cookie is 
        // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
        for (var i = 0; i < allCookies.length; i++)
            document.cookie = allCookies[i] + "=;expires="
                + new Date(0).toUTCString();



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
        let allUserData = [];
        let inputtedUsername = this.state.username;
        let inputtedPassword = this.state.password;
        let databasePassword = '';
        console.log('inputtedUsername: ' + inputtedUsername);
        promises.push(
            axios.get('/users/')
                .then(response => {   //we want to get all the fields for exercises. entire JSON object, put into array
                    userList = response.data.map(user => user.username)
                    allUserData = response.data;
                    console.log('allUserData: ' + JSON.stringify(allUserData));
                    console.log('userList: ' + userList);
                })
                .catch((error) => {
                    console.log(error);
                })
        )

        Promise.all(promises).then(() => {
            let alreadyHaveAccount = false;
            console.log('allUserData: ' + allUserData);
            //find the corresponding password 
            for (const userData of allUserData) {
                if (userData.username === inputtedUsername) {
                    databasePassword = userData.password;

                }
            }
            console.log('databasePassword: ' + databasePassword);

            //delete all cookies-------
            const deleteAllCookies = () => {
                const cookies = document.cookie.split(";");

                for (const cookie of cookies) {
                    const eqPos = cookie.indexOf("=");
                    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
            }
            //-----------              

            if (userList.includes(inputtedUsername)) {
                alreadyHaveAccount = true;
                if (inputtedPassword === databasePassword) {
                    alert("Welcome back, " + inputtedUsername + "!");
                    this.deleteCookies();
                    deleteAllCookies();
                    deleteAllCookies();
                    deleteAllCookies();

                    document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/;';
                    document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/ALL;';
                    document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/users-list;';
                    document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/create;';
                    document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/logged-exercises;';
                    document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/edit;';
                    document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/user;';
                    document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/edit-user;';
                    document.cookie = "currentCookie" + '=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/view-post;';
                    window.postMessage({ type: "CLEAR_COOKIES_EXTENSION_API" }, "*");
                    let promises1 = [];
                    promises1.push(
                        deleteAllCookies()
                    );
                    promises1.push(
                        this.deleteCookies()
                    );



                    Promise.all(promises1).then(() => {
                        this.deleteCookies();
                        deleteAllCookies();

                        this.createCookie("currentCookie", inputtedUsername, 1)
                        console.log('document.cookie: ' + document.cookie);
                        this.props.history.push('/');
                        //window.location = '/';
                    })





                }
                else {
                    alert("Incorrect password.  Try again.");
                }

            }

            if (alreadyHaveAccount == false) {
                alert("Account does not exist in our database.");
            }
        });
    }
    //https://www.guru99.com/cookies-in-javascript-ultimate-guide.html
    createCookie(cookieName, cookieValue, daysToExpire) {
        var date = new Date();
        date.setTime(date.getTime() + (daysToExpire * 24 * 60 * 60 * 1000));
        document.cookie = cookieName + "=" + cookieValue + "; expires=" + date.toGMTString() + ";path=/;";
        console.log(cookieName + "=" + cookieValue + "; expires=" + date.toGMTString() + ";path=/;");
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
            alert("You are already logged in");
            this.props.history.push('/');
        }
        return (
            <div>
                <h3>Account Login</h3>
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
                        <input type="password"
                            required
                            className="form-control"
                            value={this.state.password}
                            onChange={this.onChangePassword}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Log in" className="btn btn-primary" />
                    </div>

                </form>
            </div>
        )
    }
}