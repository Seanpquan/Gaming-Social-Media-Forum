import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";


export default class EditUser extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            oldUsername: '',
            exercises: [],
        }
    }

    componentDidMount() {
        console.log('this.props.match.params.id: ' + this.props.match.params.id);

        axios.get('/users/' + this.props.match.params.id)
            .then(response => {
                //console.log('response.data: ' + JSON.stringify(response.data));
                this.setState({
                    username: response.data.username,
                    oldUsername: response.data.username,
                })


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

    onChangeUsername(e) {
        this.setState({
            username: e.target.value
        })
    }


    async updateUsernameInExercises(newUserName) {

        console.log('NEW: ' + newUserName);
        console.log('OLD: ' + this.state.oldUsername);
        let promises = [];
        for (const currExercise of this.state.exercises) {

            let currUsername = currExercise.username;
            console.log('currUsername: ' + currUsername);

            if (currUsername === this.state.oldUsername) {
                console.log('MATCH!');
                //make get request, make a copy, and send post request

                let updatedUsernameExercise = {
                    username: '',
                    description: '',
                    duration: 0,
                    date: new Date(),
                }

                console.log('currExercise._id: ' + currExercise._id);
                console.log('/exercises/' + currExercise._id);

                //get request and make copy
                promises.push(
                    axios.get('/exercises/' + currExercise._id)
                        .then(async (response) => {
                            console.log('response.data: ' + JSON.stringify(response.data));
                            updatedUsernameExercise.username = newUserName;
                            updatedUsernameExercise.description = response.data.description;
                            updatedUsernameExercise.duration = response.data.duration;
                            updatedUsernameExercise.date = new Date(response.data.date);

                            console.log('updatedUsernameExercise: ' + JSON.stringify(updatedUsernameExercise));

                            //Post request
                            console.log('post request: ' + '/exercises/update/' + currExercise._id);
                            axios.post('/exercises/update/' + currExercise._id, updatedUsernameExercise)
                                .then(res => console.log(res.data));
                        }
                        )
                );
            }
        }
        Promise.all(promises).then(() => window.location = '/logged-exercises/ALL/');
    }

    onSubmit(e) {
        e.preventDefault();

        const user = {
            username: this.state.username,
        }

        console.log(user);

        axios.post('/users/update/' + this.props.match.params.id, user)
            .then(res => console.log(res.data));

        //change the names in exercises!
        this.updateUsernameInExercises(this.state.username);



    }

    render() {
        return (
            <div>
                <h3>Edit User Log</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Old song name: {this.state.oldUsername}</label>
                    </div>
                    <div className="form-group">
                        <label>New song name: </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.username}
                            onChange={this.onChangeUsername}
                        />
                    </div>
                    <div className="form-group">
                        <input type="submit" value="Edit song" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}