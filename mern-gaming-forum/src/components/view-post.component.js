import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../Card.css'
import { useHistory } from "react-router-dom";


const CardComment = props => (
    <div class="card">
        <div class="topRow">
            <a href={"/logged-exercises/" + props.comment.username} class="top">Posted by: {props.comment.username}</a>
        </div>
        <p>{props.comment.contents}</p>
        <div class="rightSide">
            <input id="clickMe" type="submit" value="Reply" onClick={() => editCommentBox(props.comment.postID, props.comment.username)} />
        </div>
        
    </div>
)

const editCommentBox = (postID, username) => {
    if (getCookie("currentCookie").length == 0) {
        alert("Please log in to comment!");
        window.location = '/login'
    }
    else {
        console.log('replying to: ' + username);
        window.location = '/view-post/' + postID + "?replyuser=" + username;
    }

}

const getCookie = (cname) => {
    //https://www.w3schools.com/js/js_cookies.asp

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

const input = document.getElementById('form-group');


export default class ViewPost extends Component {

    constructor(props) {
        const queryString = window.location.search;
        console.log(queryString);
        const urlParams = new URLSearchParams(queryString);
        const replyuser = urlParams.get('replyuser')
        console.log('replyUser from constructor: ' + replyuser);


        super(props);

        this.getCookie = this.getCookie.bind(this);
        this.onChangeNewComment = this.onChangeNewComment.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.cardCommentList = this.cardCommentList.bind(this);

        let textInCommentBox = '';
        if (replyuser != null) {
            textInCommentBox = '@' + replyuser + ': ';
        }

        // '@' + replyuser + ': '
        this.state = {
            username: '',
            description: '',
            duration: '',
            date: new Date(),
            users: [],
            comments: [],
            newComment: textInCommentBox,
            replyUserState: replyuser,
        }

        this.setState({ newComment: '' });
    }


    componentDidMount() {

        axios.get('/exercises/' + this.props.match.params.id)
            .then(response => {
                // console.log('response.data: ' + JSON.stringify(response.data));
                this.setState({
                    username: response.data.username,
                    description: response.data.description,
                    duration: response.data.duration,
                    date: new Date(response.data.date),
                    comments: response.data.comments,
                })
            })
            .catch(function (error) {
                console.log(error);
            })
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

    onChangeNewComment(e) {
        if (this.getCookie("currentCookie").length == 0) {
            alert("Please log in to comment!");
            window.location = '/login'
        }

        this.setState({
            newComment: e.target.value
        })
    }



    cardCommentList() {
        let numberOfComments = this.state.comments.length / 2;

        let commentList = [];
        for (let i = 0; i < numberOfComments; i++) {
            let comment = {
                username: this.state.comments[2 * i],
                contents: this.state.comments[1 + 2 * i],
                postID: this.props.match.params.id,
            }
            commentList.push(comment);
        }

        return commentList.map(currentcomment => {
            return <CardComment comment={currentcomment} />
        })
    }


    onSubmit(e) {
        e.preventDefault();
        if (this.getCookie("currentCookie").length == 0) {
            alert("Please log in to comment!");
            window.location = '/login'
        }
        else {
            console.log('this.state.replyUserState: ' + this.state.replyUserState);

            //update comments list first (concurrency issue)
            axios.get('/exercises/' + this.props.match.params.id)
                .then(response => {
                    this.setState({
                        comments: response.data.comments,
                    })
                    //add new comment to end of array
                    this.state.comments.push(this.getCookie("currentCookie"));
                    this.state.comments.push(this.state.newComment);

                    const exercise = {
                        username: this.state.username,
                        description: this.state.description,
                        duration: this.state.duration,
                        date: this.state.date,
                        comments: this.state.comments,
                    }



                    console.log('updated exercise: ' + JSON.stringify(exercise));

                    let promises2 = [];
                    promises2.push(
                        axios.post('/exercises/update/' + this.props.match.params.id, exercise)
                            .then(res => console.log(res.data))
                    );
                    Promise.all(promises2).then(() => {
                        this.props.history.push('/logged-exercises/ALL');
                        this.props.history.push('/view-post/' + this.props.match.params.id);
                        //window.location = '/logged-exercises/ALL/';
                    });

                })
                .catch(function (error) {
                    console.log(error);
                })
        }
    }

    render() {
        let stringDate = this.state.date.toString().substring(3, 15);
        window.onload = function () {
            const comment_box = document.getElementById('comment_box');
            comment_box.focus();
        };


        return (
            <div>
                {/* <input type="text" id="my_textbox" value="My Text" />
                <button id="my_button">Focus</button> */}
                {/* <p>You are on the View Post component for {this.props.match.params.id}</p> */}
                <h2 class="titleRow">
                    {this.state.description}
                    <a href="javascript:window.history.back();">BACK</a>
                </h2>
                <h5>Posted on {stringDate}, by {this.state.username}</h5>
                <p>{this.state.duration}</p>
                <hr></hr>

                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Add Comment: </label>
                        <input
                            id="comment_box"
                            type="text"
                            className="form-control"
                            value={this.state.newComment}
                            onChange={this.onChangeNewComment}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Post comment" className="btn btn-primary" />
                    </div>
                </form>
                <br></br>
                <div>{this.cardCommentList()}</div>
            </div>
        )
    }

}

