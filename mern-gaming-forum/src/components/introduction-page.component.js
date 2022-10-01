import React, { Component } from 'react';
import picture from '../images/picture.jpg';
export default class IntroductionPage extends Component {


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
        return (
            <div>
                <h1>Welcome to Big Game Xchange {this.getCookie("currentCookie")}!</h1>
                <h3> What is this app for?</h3>
                <p>
                    Big Game Xchange is the place to go for gaming news, reviews, commentary, and discussion with fellow gamers.
                </p>
                <h3>How to use this forum</h3>
                <ul>
                    <li>"All Posts" shows all posts by all users</li>
                    <li>"User List" shows all active users</li>
                    <li>"Create Post" is self-explanatory</li>
                    <li>"Big Game Xchange" can be clicked at any time to see this instruction page</li>
                </ul>
                <h3>Info about the creator of this app</h3>
                <p>
                    Hello! I'm Sean, a 3rd year computer science student at UBC, from Vancouver, Canada.
                    Ever since I started programming in high school, I was always striving to explore
                    new tools and technologies, from individual technical endeavours, to collaborative
                    hackathon projects, to work experience in industry. Feel free to check out my resume, and if you have any
                    questions, or just want to chat, don't hesitate to add me on LinkedIn @https://www.linkedin.com/in/seanquan/.
                    Thanks for visiting!
                    <br></br><br></br>
                    I devote this website to my favourite rapper, Corey Struggs.  Died @ 5'7", 425 lbs.  RIP big guy.
                </p>
                <img src={picture} alt="alternatetext"></img>
            </div>

        )
    }
}
