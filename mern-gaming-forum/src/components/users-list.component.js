import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../Card.css'
import '../Comment.css'
//User component. a functional react component
const User = props => (
    <div class="parent">
        <div class="leftBox">
            <img className="smallPic" src={props.pic} />
        </div>
        <div class="card">
            <div class="topRow">
                <a href={"/logged-exercises/" + props.user.username} class="top">username: {props.user.username}</a>
            </div>
            <p>{props.user.bio}</p>
            <div class="ownPostRow">
                <a href="#" onClick={() => { props.deleteUser(props.user._id) }} class="right">CLICK TO DELETE ACCOUNT</a>
            </div>
            
        </div>
    </div>
)

const OthersUser = props => (
    <div class="parent">
        <div class="leftBox">
            <img className="smallPic" src={props.pic} />
        </div>
        <div class="card">
            <div class="topRow">
                <a href={"/logged-exercises/" + props.user.username} class="top">username: {props.user.username}</a>
            </div>
            <p>{props.user.bio}</p>
        </div>
    </div>
)
//"#" means link goes nowhere      
//class component
export default class UsersList extends Component {
    constructor(props) {
        super(props);

        this.deleteUser = this.deleteUser.bind(this);
        this.getCookie = this.getCookie.bind(this);

        this.state = {
            users: [],
            exercises: [],
            usernameToPic: {},
        };  //empty array of users
    }
    //get the list of exercises from database
    componentDidMount() {
        axios.get('/users/')
            .then(response => {   //we want to get all the fields for exercises. entire JSON object, put into array
                this.setState({ users: response.data })

                //populate usernameToPic (username to picture map)
                let allUsers = response.data.map(user => user);  //allUsers is an array that stores all users to iterate over
                for (const curUser of allUsers) {
                    this.state.usernameToPic[curUser.username] = curUser.pic;
                }

                //get all the exercises in an array
                axios.get('/exercises/')
                .then(response => {   //we want to get all the fields for exercises. entire JSON object, put into array
                    this.setState({ exercises: response.data })
                })
                .catch((error) => {
                    console.log(error);
                })
            })
            .catch((error) => {
                console.log(error);
            })
    }

    //id is an input. (mongoDb automatically assigned)
    deleteUser(id) {
        //also delete exercisees!!!! 
        this.removeExercisesWithDeletedUser(id);

        axios.delete('/users/' + id)
            .then(response => console.log(response.data)); //will say 'user deleted' (from backend)

        this.setState({  //react automatically updates page with this new state
            users: this.state.users.filter(el => el._id !== id)
        })   //filters thru array of exercises. only return elements whose elements != the id we are deleting. lambda func.
    }


    userList() {
        let cookieUsername = this.getCookie("currentCookie");
        return this.state.users
            .map(currentuser => {
                if (currentuser.username == cookieUsername) {
                    return <User pic={this.state.usernameToPic[currentuser.username]} user={currentuser} deleteUser={this.deleteUser} key={currentuser._id} />;
                }
                else {
                    return <OthersUser pic={this.state.usernameToPic[currentuser.username]} user={currentuser} key={currentuser._id} />;
                }
            })  //these are two 'props'
    }

    removeCommentsWithDeletedUser(usernameToDelete) {
        let newCommentsArray = [];  //same as before, but without deleted user
        console.log('usernameToDelete: ' + usernameToDelete);
        axios.get('/exercises/')
            .then(response => {   //we want to get all the fields for exercises. entire JSON object, put into array
                // console.log('response.data: ' + JSON.stringify(response.data));
                for (let i = 0; i < response.data.length; i++) {
                    //console.log(response.data[i].comments); //gets comment from specific post

                    for (let k = 0; k < response.data[i].comments.length; k = k + 2) {  //iterates thru comments on specific post

                        if (response.data[i].comments[k] == usernameToDelete) {
                            // console.log('k: ' + k + 'user: ' + response.data[i].comments[k]);
                            // console.log('k+1: ' + response.data[i].comments[k + 1]);
                            newCommentsArray.push('deleted');
                            newCommentsArray.push('deleted');
                        }
                        else {
                            newCommentsArray.push(response.data[i].comments[k]);
                            newCommentsArray.push(response.data[i].comments[k + 1]);
                        }
                    }
                    // console.log('newCommentsArray: ' + newCommentsArray);  //contains correct array of comments for this post
                    // console.log('postID: ' + response.data[i]._id);

                    const exercise = {
                        username: response.data[i].username,
                        description: response.data[i].description,
                        duration: response.data[i].duration,
                        date: response.data[i].date,
                        comments: newCommentsArray,  //only thing changed
                    }

                    axios.post('/exercises/update/' + response.data[i]._id, exercise)
                        .then(res => console.log(res.data));

                }

            })

    }

    removeExercisesWithDeletedUser(userIdToDelete) {
        let promises = [];
        let usernameToDelete = '';
        // console.log('/users/' + userIdToDelete);
        promises.push(
            axios.get('/users/' + userIdToDelete)
                .then(response => {   //we want to get all the fields for exercises. entire JSON object, put into array
                    usernameToDelete = response.data.username;
                    // console.log('response.data: ' + JSON.stringify(response.data));

                })
        )

        Promise.all(promises).then(() => {
            // console.log('usernameToDelete: ' + usernameToDelete)
            for (const currExercise of this.state.exercises) {

                let currUsername = currExercise.username;
                // console.log('currUsername: ' + currUsername);

                if (currUsername === usernameToDelete) {
                    // console.log('MATCH!');
                    //detele the exercise entry

                    axios.delete('/exercises/' + currExercise._id)
                        .then(response => console.log(response.data)) //will say 'exercise deleted' (from backend)


                }
            }
            this.removeCommentsWithDeletedUser(usernameToDelete);

            this.props.history.push('/logout/');
        });
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

    render() {
        return (
            <div>
                <h3>User list</h3>
                <div>
                    {this.userList()}
                </div>
            </div>
        )
    }
}

