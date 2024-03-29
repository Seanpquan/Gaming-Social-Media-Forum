import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../Card.css'
import '../Profile.css'
const cutOffDescLength = 350;  //description length cutoff before "... {continued}"

const CardConst = props => (
    <div class="parent">
        <div class="leftBox">
            <img className="smallPic" src={props.pic} />
            <a href={"/logged-exercises/" + props.exercise.username} class="top">By: {props.exercise.username}  </a> 
            <p> Date: {props.exercise.date.substring(5, 10)}</p>
        </div>
        <div class="card">
                <a href={"/view-post/" + props.exercise._id} class="title">{props.exercise.description}</a>
                <img className="postPic" src={props.exercise.pic} />
                <a href={"/view-post/" + props.exercise._id} class="descrip">{bodyPreview(props.exercise.duration.substring(0, cutOffDescLength))}</a>
                <br></br>
                <br></br>
                <div class="actionRow">
                    <a href={"/view-post/" + props.exercise._id} class="descrip">{props.exercise.comments.length/2} comments</a>
                </div>
                <div class="ownPostRow">
                    <a href="#" onClick={() => { props.deleteExercise(props.exercise._id) }} class="right">Delete</a>
                    <a href={"/edit/" + props.exercise._id} class="right">Edit</a>
                </div>
        </div>
        {/* <div class="rightPicBox">
            
        </div> */}
        
    </div>
)

const OtherCardConst = props => (
    <div class="parent">
        <div class="leftBox">
            <img className="smallPic" src={props.pic} />
            <a href={"/logged-exercises/" + props.exercise.username} class="top">By: {props.exercise.username}  </a> 
            <p> Date: {props.exercise.date.substring(5, 10)}</p>
        </div>
        <div class="card">
                <a href={"/view-post/" + props.exercise._id} class="title">{props.exercise.description}</a>
                <img className="postPic" src={props.exercise.pic} />
                <a href={"/view-post/" + props.exercise._id} class="descrip">{bodyPreview(props.exercise.duration.substring(0, cutOffDescLength))}</a>
                <br></br>
                <br></br>
                <div class="actionRow">
                    <a href={"/view-post/" + props.exercise._id} class="descrip">{props.exercise.comments.length/2} comments</a>
                </div>
        </div>
    </div>
)

const Profile = props => (
    <div>
        <h2>{props.username}'s profile</h2>
        <div class="profParent">
            <div class="profLeftBox">
                <img className="bigPic" src={props.pic} />
            </div>
            <div class="profRightBox">
                <h3>About me:</h3>
                <div class="multiline">
                    {props.bio}
                </div>        
            </div>
            
        </div>
    </div>
)

{/* <td>{props.exercise.duration.substring(0, 50)}</td> */ }
const bodyPreview = (beginningOfBody) => {
    if (beginningOfBody.length == cutOffDescLength) {
        return beginningOfBody + ' ... {continued}';
    }
    return beginningOfBody;
}




//"#" means link goes nowhere      
//class component
export default class LoggedExercises extends Component {
    constructor(props) {
        super(props);

        this.deleteExercise = this.deleteExercise.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.profile = this.profile.bind(this);


        this.state = { 
            exercises: [],
            usernameToPic: {},
            usernameToBio: {},
        };  
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


    //get the list of exercises from database
    componentDidMount() {

        
        //populate usernameToPic (username to picture map)
        axios.get('/users/')
            .then(response => {
                let allUsers = response.data.map(user => user);  //allUsers is an array that stores all users to iterate over
                for (const curUser of allUsers) {
                    this.state.usernameToPic[curUser.username] = curUser.pic;
                    this.state.usernameToBio[curUser.username] = curUser.bio;
                }
                // console.log("usernameToPic then: " + this.state.usernameToPic["sean"]);

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
    deleteExercise(id) {
        axios.delete('/exercises/' + id)
            .then(response => console.log(response.data)); //will say 'exercise deleted' (from backend)

        this.setState({  //react automatically updates page with this new state
            exercises: this.state.exercises.filter(el => el._id !== id)
        })   //filters thru array of exercises. only return elements whose elements != the id we are deleting. lambda func.
    }       //where did _id come from? _id is the automatically created one from mongoid.

    selectedUsername = this.props.match.params.username;


    cardList(selectedUsername) {
        let cookieUsername = this.getCookie("currentCookie");
        if (selectedUsername !== "ALL" && selectedUsername === cookieUsername) {
            var newarray = this.state.exercises.slice().reverse();  //sorted recent to oldest
            return newarray
                .filter(function (currentexercise) {
                    return currentexercise.username == selectedUsername;
                })
                .map(currentexercise => {
                        return <CardConst exercise={currentexercise} deleteExercise={this.deleteExercise} pic={this.state.usernameToPic[currentexercise.username]} key={currentexercise._id} />;                
                    }
                )
        }

        if (selectedUsername !== "ALL" && selectedUsername !== cookieUsername) {
            var newarray = this.state.exercises.slice().reverse();  //sorted recent to oldest
            return newarray
                .filter(function (currentexercise) {
                    return currentexercise.username == selectedUsername;
                })
                .map(currentexercise => {
                        return <OtherCardConst exercise={currentexercise} deleteExercise={this.deleteExercise} pic={this.state.usernameToPic[currentexercise.username]} key={currentexercise._id} />;                
                    }
                )
        }

        if (selectedUsername === "ALL") {
                var newarray = this.state.exercises.slice().reverse();  //sorted recent to oldest
                return newarray
                .map(currentexercise => {
                    if (currentexercise.username == cookieUsername) {
                        // console.log("usernameToPic returning: " + this.state.usernameToPic["sean"]);
                        return <CardConst exercise={currentexercise} deleteExercise={this.deleteExercise} pic={this.state.usernameToPic[currentexercise.username]} key={currentexercise._id} />;
                    }
                    else {
                        return <OtherCardConst exercise={currentexercise} deleteExercise={this.deleteExercise} pic={this.state.usernameToPic[currentexercise.username]} key={currentexercise._id} />;
                    }
                        
                    }
                )
        }

    }

    profile(username) {
        if (username !== "ALL") {
            return <Profile bio = {this.state.usernameToBio[username]} username = {username} pic={this.state.usernameToPic[username]}/>;
        }
    }

    getCurrentDate() {
        let currDate = new Date();
        return currDate.toISOString().substring(5, 10);
    }


    render() { //7 days in a week
        // console.log('document.cookie: ' + document.cookie);

        return (
            <div>
                <div>{this.profile(this.props.match.params.username)}</div>
                <h3>Posts from {this.props.match.params.username}</h3>
                <div>{this.cardList(this.props.match.params.username)}</div>

                {/* <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>User</th>
                            <th>Title</th>
                            <th>Body</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.exerciseList(this.props.match.params.username)}
                    </tbody>
                </table> */}

            </div>

        )
    }
}

