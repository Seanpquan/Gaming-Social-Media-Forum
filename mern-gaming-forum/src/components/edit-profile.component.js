import React, { Component } from 'react';
import axios from 'axios';
import FileBase64 from 'react-file-base64';
import '../Card.css'
import '../Profile.css'
export default class EditProfile extends Component {
    constructor(props) {
        super(props);
        this.getCookie = this.getCookie.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        // this.onChangeBio = this.onChangeBio(this);

        this.state = { 
            username: '',
            password: '',
            pic: '',
            userID: '',
            bio: '',
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
                        bio: response.data.bio,
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
            bio: this.state.bio,
        }

        // console.log("this.state.userID: " + this.state.userID);
        console.log("onSubmit userID: " + this.state.userID);
        let promises = [];
        promises.push(
            axios.post('/users/update/' + this.state.userID, user)
            .then(res => console.log(res.data))
        );

        Promise.all(promises).then(() => {
            // console.log("updated user: " + user);
            this.props.history.push('/logged-exercises/' + this.state.username);
        });
            

    }



    render() {
        if (this.getCookie("currentCookie").length == 0) {
            alert("Please log in to edit profile!");
            this.props.history.push('/login');
        }
        return (
            <div>
                <div class="profParent">
                    <div class="profLeftBox">
                        <h3>Edit Profile</h3>
                        <form action="" onSubmit={this.onSubmit}>
                            <FileBase64
                                type="file"
                                required
                                multiple={false}
                                onDone={({ base64 }) => this.setState({pic: base64})}
                            />
                            <div className="form-group">
                                <input type="submit" value="Save Profile Pic" className="btn btn-primary" />
                            </div>
                        </form>
                        <div className="largeProfilePic">
                            <img src={this.state.pic} />
                        </div>
                    </div>
                

                    <div class="profRightBox">
                        <h3>Edit Biography</h3>
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <input 
                                    type="text"
                                    className="form-control"
                                    value={this.state.bio}
                                    onChange={(e) => this.setState({bio: e.target.value})}
                                />
                            {/* <textarea rows="5" cols="60" name="text" placeholder="Enter text">{this.state.bio}</textarea> */}
                            </div>
                            <div className="form-group">
                                <input type="submit" value="Save Biography" className="btn btn-primary" />
                            </div>
                        </form>
                        <h4>New bio:</h4>
                        <p>{this.state.bio}</p>
                    </div>                
                </div>
            </div>
        )
    }
}

//style={{ width: 200, height: 200,}}