import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
//Exercise component. a functional react component
const Exercise = props => (
    <tr>
        <td>{props.exercise.username}</td>
        <td>
            <Link to={"/view-post/" + props.exercise._id}>{props.exercise.description}</Link>
        </td>
        <td>{props.exercise.duration.substring(0, 50)}</td>
        <td>{props.exercise.date.substring(5, 10)}</td>
        <td>
            <Link to={"/edit/" + props.exercise._id}>edit</Link> | <a href="#" onClick={() => { props.deleteExercise(props.exercise._id) }}>delete</a>
        </td>
    </tr>
)

//other person's exercise (not the current user)
const OthersExercise = props => (
    <tr>
        <td>{props.exercise.username}</td>
        <td>
            <Link to={"/view-post/" + props.exercise._id}>{props.exercise.description}</Link>
        </td>
        <td>{props.exercise.duration.substring(0, 50)}</td>
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
        axios.get('http://localhost:5000/exercises/')
            .then(response => {   //we want to get all the fields for exercises. entire JSON object, put into array
                this.setState({ exercises: response.data })
            })
            .catch((error) => {
                console.log(error);
            })
    }
    //id is an input. (mongoDb automatically assigned)
    deleteExercise(id) {
        axios.delete('http://localhost:5000/exercises/' + id)
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





    getCurrentDate() {
        let currDate = new Date();
        return currDate.toISOString().substring(5, 10);
    }

    render() { //7 days in a week
        console.log('document.cookie: ' + document.cookie);

        return (
            <div>
                <h3>Logs for {this.props.match.params.username}</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Username</th>
                            <th>Title of Post</th>
                            <th>Beginning of body</th>
                            <th>Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.exerciseList(this.props.match.params.username)}
                    </tbody>
                </table>

            </div>

        )
    }
}

