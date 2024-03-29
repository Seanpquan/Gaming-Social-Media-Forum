import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

export default class EditExercise extends Component {
    constructor(props) {
        super(props);

        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = {
            username: '',
            description: '',
            duration: '',
            date: new Date(),
            users: [],
            pic: '',
        }
    }

    componentDidMount() {
        console.log('this.props.match.params.id: ' + this.props.match.params.id);
        axios.get('/exercises/' + this.props.match.params.id)
            .then(response => {
                console.log('response.data: ' + JSON.stringify(response.data));
                this.setState({
                    username: response.data.username,
                    description: response.data.description,
                    duration: response.data.duration,
                    date: new Date(response.data.date),
                    comments: response.data.comments,
                    pic: response.data.pic
                })
                
                axios.get('/users/')
                .then(response => {
                    if (response.data.length > 0) {
                        this.setState({
                            users: response.data.map(user => user.username),
                        })
                    }
                })
                .catch((error) => {
                    console.log(error);
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

    onChangeUsername(e) { //if user enters username, it will call this function
        let cookieUsername = this.getCookie("currentCookie");
        this.setState({
            username: cookieUsername
        })
    }

    onChangeDescription(e) {
        this.setState({
            description: e.target.value
        })
    }

    onChangeDuration() {
        console.log("textValue: " + document.getElementById("myTextarea").value);
        this.state.duration = document.getElementById("myTextarea").value;
        this.setState({
            duration: document.getElementById("myTextarea").value
        })
    }

    onChangeDate(date) {
        this.setState({
            date: date
        })
    }

    onSubmit(e) {
        e.preventDefault();
        this.onChangeUsername();
        this.onChangeDuration();

        let editedBool = false;
        axios.get('/exercises/' + this.props.match.params.id)
            .then(response => {
                editedBool = response.data.description.includes('{edited}') && this.state.description.includes('{edited}');
                console.log('response.data.description: ' + response.data.description);
                console.log('this.state.description: ' + this.state.description);
                console.log('editedBool:' + editedBool);
                if (!editedBool) {  //if not edited yet
                    console.log('unedited yet!');
                    console.log('description before: ' + this.state.description);
                    this.state.description = '{edited} ' + this.state.description;
                    console.log('description after: ' + this.state.description);
                }

                const exercise = {
                    username: this.state.username,
                    description: this.state.description,
                    duration: this.state.duration,
                    date: this.state.date,
                    comments: this.state.comments,
                    pic: this.state.pic
                }


                // console.log(exercise);
                let promises2 = [];
                promises2.push(
                    axios.post('/exercises/update/' + this.props.match.params.id, exercise)
                        .then(res => console.log(res.data))
                );

                Promise.all(promises2).then(() => {
                    this.props.history.push('/view-post/' + this.props.match.params.id);
                    //window.location = '/logged-exercises/ALL/';
                });

            })
            .catch(function (error) {
                console.log(error);
            })

    }

    durationText() {
        return this.state.duration;
    }

    render() {
        return (
            <div>
                <h3>Edit Post</h3>
                <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                        <label>Title </label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.description}
                            onChange={this.onChangeDescription}
                        />
                    </div>
                    <br></br>
                    {/* <div className="form-group">
                        <label>Body </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.duration}
                            onChange={this.onChangeDuration}
                        />
                    </div> */}
                    <textarea defaultValue={this.state.duration} id="myTextarea" class="auto_height" oninput="auto_height(this)" rows = "5" name = "myTextarea"/>
                    <br></br>

                    <div className="form-group">
                        <input type="submit" value="Edit Post" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}