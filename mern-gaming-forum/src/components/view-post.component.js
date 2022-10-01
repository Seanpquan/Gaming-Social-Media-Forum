import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Comment = props => (
    <tr>
        <td>
            <Link to={"/logged-exercises/" + props.comment.username}>{props.comment.username}</Link>
        </td>
        <td>{props.comment.contents}</td>
        <td>
            <input id="clickMe" type="button" value="reply" onClick={() => editCommentBox(props.comment.postID, props.comment.username)} />
        </td>
    </tr>
)

const editCommentBox = (postID, username) => {
    console.log('replying to: ' + username);
    window.location = '/view-post/' + postID + "?replyuser=" + username;
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
        this.commentList = this.commentList.bind(this);

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
        console.log('hello from componentDidMount');

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
        this.setState({
            newComment: e.target.value
        })
    }

    commentList() {
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
            return <Comment comment={currentcomment} />
        })
    }


    onSubmit(e) {
        e.preventDefault();
        console.log('this.state.replyUserState: ' + this.state.replyUserState);
        this.state.comments.push(this.getCookie("currentCookie"));
        this.state.comments.push(this.state.newComment); //asdf

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


    }

    render() {
        let stringDate = this.state.date.toString().substring(3, 16);
        window.onload = function () {
            const comment_box = document.getElementById('comment_box');
            comment_box.focus();
        };
        return (
            <div>
                {/* <input type="text" id="my_textbox" value="My Text" />
                <button id="my_button">Focus</button> */}
                {/* <p>You are on the View Post component for {this.props.match.params.id}</p> */}
                <h2>{this.state.description}</h2>
                <h5>Posted on {stringDate}, by {this.state.username}.</h5>
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
                <div className='rowC'>
                    <div>
                        <table className="table">
                            <thead className="thead-light">
                                <tr>
                                    <th>Username</th>
                                    <th>Comment</th>
                                    <th>Reply</th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.commentList()}
                            </tbody>

                        </table>
                    </div>
                </div>


            </div>
        )
    }

}

