import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../Card.css'
const cutOffDescLength = 300;  //description length cutoff before "... {continued}"
//Exercise component. a functional react component
const Exercise = props => (
    <tr>
        <td>
            <Link to={"/logged-exercises/" + props.exercise.username}>{props.exercise.username}</Link>
        </td>
        <td>
            <Link to={"/view-post/" + props.exercise._id}>{props.exercise.description}</Link>
        </td>
        <td>{bodyPreview(props.exercise.duration.substring(0, 50))}</td>
        <td>{props.exercise.date.substring(5, 10)}</td>
        <td>
            <Link to={"/edit/" + props.exercise._id}>edit</Link> | <a href="#" onClick={() => { props.deleteExercise(props.exercise._id) }}>delete</a>
        </td>
    </tr>
)

const CardConst = props => (
    <div class="card">
        <div class="topRow">
            <a href={"/logged-exercises/" + props.exercise.username} class="top">Posted by: {props.exercise.username}  </a> 
            <a href={"/view-post/" + props.exercise._id} class="right"> Posted on: {props.exercise.date.substring(5, 10)}</a>
        </div>
        <a href={"/view-post/" + props.exercise._id} class="title">{props.exercise.description}</a>
        <a href={"/view-post/" + props.exercise._id} class="descrip">{bodyPreview(props.exercise.duration.substring(0, cutOffDescLength))}</a>
        <div class="actionRow">
            <a href={"/view-post/" + props.exercise._id} class="descrip">{props.exercise.comments.length/2} comments</a>
        </div>
        <div class="ownPostRow">
            <a href="#" onClick={() => { props.deleteExercise(props.exercise._id) }} class="right">Delete</a>
            <a href={"/edit/" + props.exercise._id} class="right">Edit</a>
        </div>
    </div>
)

const OtherCardConst = props => (
    <div class="card">
        <div class="topRow">
            <a href={"/logged-exercises/" + props.exercise.username} class="top">Posted by: {props.exercise.username}  </a> 
            <a href={"/view-post/" + props.exercise._id} class="right"> Posted on: {props.exercise.date.substring(5, 10)}</a>
        </div>
        <a href={"/view-post/" + props.exercise._id} class="title">{props.exercise.description}</a>
        <a href={"/view-post/" + props.exercise._id} class="descrip">{bodyPreview(props.exercise.duration.substring(0, cutOffDescLength))}</a>
        <div class="actionRow">
            <a href={"/view-post/" + props.exercise._id} class="descrip">{props.exercise.comments.length/2} comments</a>
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

//other person's exercise (not the current user)
const OthersExercise = props => (
    <tr>
        <td>
            <Link to={"/logged-exercises/" + props.exercise.username}>{props.exercise.username}</Link>
        </td>
        <td>
            <Link to={"/view-post/" + props.exercise._id}>{props.exercise.description}</Link>
        </td>
        <td>{bodyPreview(props.exercise.duration.substring(0, 50))}</td>
        <td>{props.exercise.date.substring(5, 10)}</td>
    </tr>
)
//"#" means link goes nowhere      
//class component
export default class LoggedExercises extends Component {
    constructor(props) {
        super(props);

        this.deleteExercise = this.deleteExercise.bind(this);
        this.getCookie = this.getCookie.bind(this);


        this.state = { exercises: [] };  //empty array of exercises
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
        axios.get('/exercises/')
            .then(response => {   //we want to get all the fields for exercises. entire JSON object, put into array
                this.setState({ exercises: response.data })
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

    exerciseList(selectedUsername) {
        let cookieUsername = this.getCookie("currentCookie");
        //console.log('selectedUsername: ' + selectedUsername);
        if (selectedUsername !== "ALL" && selectedUsername === cookieUsername) {
            return this.state.exercises
                .filter(function (currentexercise) {
                    return currentexercise.username == selectedUsername;
                })
                .map(currentexercise => {
                    return <Exercise exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id} />;
                })  //these are three 'props'
        }
        if (selectedUsername !== "ALL" && selectedUsername !== cookieUsername) {
            return this.state.exercises
                .filter(function (currentexercise) {
                    return currentexercise.username == selectedUsername;
                })
                .map(currentexercise => {
                    return <OthersExercise exercise={currentexercise} key={currentexercise._id} />;
                })  //these are three 'props'
        }
        if (selectedUsername === "ALL") {
            //show all users
            //console.log("ALL users selected");

            console.log('cookieUsername: ' + cookieUsername);
            return this.state.exercises
                .map(currentexercise => {

                    if (currentexercise.username == cookieUsername) {

                        return <Exercise exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id} />;
                    }
                    else {
                        return <OthersExercise exercise={currentexercise} key={currentexercise._id} />;
                    }
                })
        }
    }

    cardList(selectedUsername) {
        let cookieUsername = this.getCookie("currentCookie");
        if (selectedUsername !== "ALL" && selectedUsername === cookieUsername) {
            var newarray = this.state.exercises.slice().reverse();  //sorted recent to oldest
            return newarray
                .filter(function (currentexercise) {
                    return currentexercise.username == selectedUsername;
                })
                .map(currentexercise => {
                        return <CardConst exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id} />;                
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
                        return <OtherCardConst exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id} />;                
                    }
                )
        }

        if (selectedUsername === "ALL") {
                var newarray = this.state.exercises.slice().reverse();  //sorted recent to oldest
                return newarray
                .map(currentexercise => {
                    if (currentexercise.username == cookieUsername) {
                        return <CardConst exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id} />;
                    }
                    else {
                        return <OtherCardConst exercise={currentexercise} deleteExercise={this.deleteExercise} key={currentexercise._id} />;
                    }
                        
                    }
                )
        }

    }


    getCurrentDate() {
        let currDate = new Date();
        return currDate.toISOString().substring(5, 10);
    }

    render() { //7 days in a week
        console.log('document.cookie: ' + document.cookie);

        return (
            <div>
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

