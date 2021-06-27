import React, { Component } from 'react';
import Login from '../screens/login/Login';
import { BrowserRouter as Router, Route, Redirect, Switch } from 'react-router-dom';

class Controller extends Component {

    constructor() {
        super();
        this.state = {
            loggedIn: sessionStorage.getItem("access-token") == null ? false : true
        }
        this.baseUrl = "https://graph.instagram.com/";
    }

    render() {
        return (
            <div>
                <Router>
                    <Switch>
                        <Route exact path="/" render={({ history }, props) => <Login {...props} baseUrl={this.baseUrl} history={history} />} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default Controller;