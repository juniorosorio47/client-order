import React from 'react';
import {BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'

import isAuthenticated from './auth'

const PrivateRoutes = ({component: Component, ...rest}) => (
    <Route {...rest} render={props=>(
        isAuthenticated() ? (
            <Component {...props}/>
        ):(
            <Redirect to={{ pathname:'/', state:{from: props.location}}} />
        )
    )}/>
)


const Routes = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/" component={() => <h1>Home</h1>} />
            <PrivateRoutes path="/products" component={() => <h1>Products</h1>} />
        </Switch>
    </BrowserRouter>
)

export default Routes