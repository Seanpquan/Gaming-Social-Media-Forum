import React, { Component } from 'react';
import { Link } from 'react-router-dom';

export default class Navbar extends Component {

    render() {
        return (
            <nav className="navbar navbar-dark bg-dark navbar-expand-lg">
                <Link to="/" className="navbar-brand">Gaming Forum</Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav ml-auto">
                        <li className="navbar-item">
                            <Link to="/logged-exercises/ALL/" className="nav-link">All Posts</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/users-list" className="nav-link">User List</Link>
                        </li>
                        <li className="navbar-item">
                            <Link to="/create" className="nav-link">Create Post</Link>
                        </li>
                    </ul>
                </div>

                <div className="collapse navbar-collapse justify-content-end">
                    <ul className="navbar navbar-nav ">
                        <li className="navbar-item">
                            <Link to="/user" className="nav-link">Create Account</Link>
                        </li>
                    </ul>
                    <ul className="navbar navbar-nav ">
                        <li className="navbar-item">
                            <Link to="/login" className="nav-link">Login</Link>
                        </li>
                    </ul>
                    <ul className="navbar navbar-nav ">
                        <li className="navbar-item">
                            <Link to="/logout" className="nav-link">Logout</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}