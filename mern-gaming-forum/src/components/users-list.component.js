import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
//User component. a functional react component
const User = props => (
    <tr>
        <td>{props.user.username}</td>
        <td>
            <Link to={"/logged-exercises/" + props.user.username}>view</Link>
        </td>
        <td>
            <a href="#" onClick={() => { props.deleteUser(props.user._id) }}>delete</a>
        </td>
    </tr>
)

const OthersUser = props => (
    <tr>
        <td>{props.user.username}</td>
        <td>
            <Link to={"/logged-exercises/" + props.user.username}>view</Link>
        </td>
    </tr>
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
        };  //empty array of users
    }
    //get the list of exercises from database
    componentDidMount() {
        axios.get('/users/')
            .then(response => {   //we want to get all the fields for exercises. entire JSON object, put into array
                this.setState({ users: response.data })
            })
            .catch((error) => {
                console.log(error);
            })

        //get all the exercises in an array
        axios.get('/exercises/')
            .then(response => {   //we want to get all the fields for exercises. entire JSON object, put into array
                this.setState({ exercises: response.data })
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
        //getting Youtube url
        console.log('document.cookie from users-list: ' + document.cookie);
        let cookieUsername = this.getCookie("currentCookie");
        return this.state.users
            .map(currentuser => {
                if (currentuser.username == cookieUsername) {
                    return <User user={currentuser} deleteUser={this.deleteUser} key={currentuser._id} />;
                }
                else {
                    return <OthersUser user={currentuser} key={currentuser._id} />;
                }
            })  //these are two 'props'
    }

    removeExercisesWithDeletedUser(userIdToDelete) {
        let promises = [];
        let usernameToDelete = '';
        console.log('/users/' + userIdToDelete);
        promises.push(
            axios.get('/users/' + userIdToDelete)
                .then(response => {   //we want to get all the fields for exercises. entire JSON object, put into array
                    usernameToDelete = response.data.username;
                    console.log('response.data: ' + JSON.stringify(response.data));

                })
        )

        Promise.all(promises).then(() => {
            console.log('usernameToDelete: ' + usernameToDelete)
            for (const currExercise of this.state.exercises) {

                let currUsername = currExercise.username;
                console.log('currUsername: ' + currUsername);

                if (currUsername === usernameToDelete) {
                    console.log('MATCH!');
                    //detele the exercise entry

                    axios.delete('/exercises/' + currExercise._id)
                        .then(response => console.log(response.data)) //will say 'exercise deleted' (from backend)


                }
            }
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
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>User</th>
                            <th>Posts</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.userList()}
                    </tbody>
                </table>
            </div>
        )
    }
}

