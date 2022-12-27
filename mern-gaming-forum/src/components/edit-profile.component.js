import React, { Component } from 'react';
import axios from 'axios';
import FileBase64 from 'react-file-base64';
import '../Card.css'
export default class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.getCookie = this.getCookie.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.state = { 
            username: '',
            password: '',
            pic: '',
            userID: '',
        }
    }

    
    
    componentDidMount() {
        let allUsers = [];
        let cookieUsername = this.getCookie("currentCookie");
        axios.get('/users/')
        .then(response => {
            if (response.data.length > 0) { //check at least one user in database
                allUsers = response.data.map(user => user)  //just get the username from each JSON user, puts into array
                
                for (const curUser of allUsers) {
                    if (curUser.username === cookieUsername) {  //found the user whose username matches! Do this to get ._id
                        // console.log("ORESOF");           // note:  (same as this.props.match.params._id) from other components
                        // console.log(curUser.username);
                        // console.log(curUser._id);
                        this.setState({userID: curUser._id});
                    }
                }
                
                axios.get('/users/' + this.state.userID)
                .then(response => {
                    //console.log('response.data: ' + JSON.stringify(response.data));
                    this.setState({
                        username: response.data.username,
                        password: response.data.password,
                        pic: response.data.pic,
                    })

                })
                .catch((error) => {
                    console.log(error);
                })

            }
        })
        .catch((error) => {
            console.log(error);
        })


        //for loop over all users


        // axios.get('/users/')
        //     .then(response => {
        //         if (response.data.length > 0) {
        //             console.log("YEET: " + response[0].username);
        //             //for loop over response
        //                 //if curResponse.username == cookieUsername
        //                     //setState with username, pass, and pic
        //         }
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })



        // console.log('this.props.match.params.id: ' + this.props.match.params.id);
        // axios.get('/users/' + this.props.match.params.id)
        //     .then(response => {
        //         //console.log('response.data: ' + JSON.stringify(response.data));
        //         this.setState({
        //             username: response.data.username,
        //             password: response.data.password,
        //             pic: response.data.pic,
        //         })


        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     })
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



    onSubmit(e) {
        e.preventDefault();

        const user = {
            username: this.state.username,
            password: this.state.password,
            pic: this.state.pic,
        }

        // console.log("this.state.userID: " + this.state.userID);
        console.log("onSubmit userID: " + this.state.userID);
        let promises = [];
        promises.push(
            axios.post('/users/update/' + this.state.userID, user)
            .then(res => console.log(res.data))
        );

        Promise.all(promises).then(() => {
            console.log("updated user: " + user);
        });
            

    }


    render() {
        if (this.getCookie("currentCookie").length == 0) {
            alert("Please log in to edit profile!");
            this.props.history.push('/login');
        }
        return (
            <div>
                <h3>Edit Profile</h3>

                <form action="" onSubmit={this.onSubmit}>
                    <FileBase64
                        type="file"
                        required
                        multiple={false}
                        onDone={({ base64 }) => this.setState({pic: base64})}
                    />
                    <div className="form-group">
                        <input type="submit" value="Save profile pic" className="btn btn-primary" />
                    </div>
                </form>

                <div className="largeProfilePic">
                    <img src={this.state.pic} />
                </div>
            </div>
        )
    }
}

//style={{ width: 200, height: 200,}}