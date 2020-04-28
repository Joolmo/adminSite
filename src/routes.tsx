import React from 'react'
import {
    Route, 
    Redirect, 
    Switch,
} from "react-router-dom";
import {
    Dashboard, 
    Exchange 
} from 'pages';

export const Routes = () => {
    return (
        <Switch>
            <Route path="/dashboard" component={Dashboard} />
            <Route path="/exchange" component={Exchange} />
            <Redirect from="/" to="/dashboard" />
        </Switch>
    )
}