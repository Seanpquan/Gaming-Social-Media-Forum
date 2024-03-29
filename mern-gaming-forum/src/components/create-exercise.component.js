import React, { Component } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import FileBase64 from 'react-file-base64';

export default class CreateExercises extends Component {
    constructor(props) { //always call super when defining constrcutor for subclass
        super(props);
        //want keyword 'this' to refer to the whole class, need to use 'bind' 
        this.onChangeUsername = this.onChangeUsername.bind(this);
        this.getCookie = this.getCookie.bind(this);
        this.onChangeDescription = this.onChangeDescription.bind(this);
        this.onChangeDuration = this.onChangeDuration.bind(this);
        this.onChangeDate = this.onChangeDate.bind(this);
        this.onChangePic = this.onChangePic.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        //update state automatically update page with new values
        this.state = { //state is how you create variables in react. using ':' not '='. 
            username: '',
            description: '',
            duration: '',
            date: new Date(),
            users: [], //page will have dropdown menu with users to associate with exercise
            pic: '',
        }
    }
    //react lifecycle method. this is automaticlaly called before anything is displayed on the page
    componentDidMount() {
        axios.get('/users/')
            .then(response => {
                if (response.data.length > 0) { //check at least one user in database
                    this.setState({
                        users: response.data.map(user => user.username),  //just get the username from each JSON user, puts into array
                        username: response.data[0].username //automatically set to first user
                    })
                }
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

    //never say '=' here, instead use setState prebuilt method.
    onChangeUsername() { //if user enters username, it will call this function
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

    onChangePic(e) {
        this.setState({
            pic: e.target.value
        })
    }

    onChangeDuration() {
        console.log("textValue: " + document.getElementById("myTextarea").value);
        this.state.duration = document.getElementById("myTextarea").value;
        this.setState({
            duration: document.getElementById("myTextarea").value
        })
    }
    //use library to make calendar
    onChangeDate(date) {
        this.setState({
            date: date //set date to equal the input variable 'date'
        })
    }

    onSubmit(e) {
        e.preventDefault(); //instead of doing normally do, it will do what we want (the following:)
        //you CAN create variables as long as its only used in this one method
        this.onChangeUsername();
        this.onChangeDuration();
        const exercise = {
            username: this.getCookie("currentCookie"),
            description: this.state.description,
            duration: this.state.duration,
            date: this.state.date,
            pic: this.state.pic
        }

        console.log(exercise);
        let promises = [];
        promises.push(
            axios.post('/exercises/add', exercise)
                .then(res => console.log(res.data))
        );

        Promise.all(promises).then(() => {


            this.props.history.push('/logged-exercises/ALL');
            //window.location = '/logged-exercises/ALL'; //take the user back to home page, which is the list of exercises
        });
    }

    auto_height(elem) {  /* javascript */
        elem.style.height = "1px";
        elem.style.height = (elem.scrollHeight)+"px";
    }

    render() {
        if (this.getCookie("currentCookie").length == 0) {
            alert("Please log in to post!");
            this.props.history.push('/login');
        }
        return (
            <div>
                <h3>Create New Post</h3>
                <form onSubmit={this.onSubmit}>

                    <div className="form-group">
                        <label>Title</label>
                        <input type="text"
                            required
                            className="form-control"
                            value={this.state.description}
                            onChange={this.onChangeDescription}
                        />
                    </div>
                    <br></br>
                    {/* <div className="form-group">
                        <label>Body: </label>
                        <input
                            type="text"
                            className="form-control"
                            value={this.state.duration}
                            onChange={this.onChangeDuration}
                        />
                    </div> */}
                    <textarea id="myTextarea" class="auto_height" oninput="auto_height(this)" rows = "5" name = "myTextarea" placeholder="Enter description of post here...">

                    </textarea>
                    <br></br>
                    <FileBase64
                        type="file"
                        multiple={false}
                        onDone={({ base64 }) => this.setState({pic: base64})}
                    />
                    <img className="postPicBig" src={this.state.pic} />
                    <br></br>
                    <p>{"(File must be < 70 kB)"}</p>
                    <div className="form-group">
                        <input type="submit" value="Create Post" className="btn btn-primary" />
                    </div>
                </form>
            </div>
        )
    }
}