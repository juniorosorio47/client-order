import React from 'react';
import {BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Container from 'react-bootstrap/Container';

import { isAuthenticated } from './services/auth'

import { GlobalNavbar } from './components/Nav'

import Login from './pages/Login';

import { ProductList } from './pages/Product/ProductList';
import { ClientList } from './pages/Client/ClientList';
import { OrderList } from './pages/Order/OrderList';

const PrivateRoutes = ({component: Component, ...rest}) => (
    <Route {...rest} render={props=>(
        isAuthenticated() ? (<>
            
            <Component {...props}/>
        </>):(
            <Redirect to={{ pathname:'/login', state:{from: props.location}}} />
        )
    )}/>
)


const Routes = () => (
    <Container fluid className="vw-100 vh-100" >
        <BrowserRouter>
            <Route path="/login" component={Login} />
            <GlobalNavbar/>
            <Container lg={6}  className=" align-items-center justify-content-center " >
                <Switch>
                    <PrivateRoutes exact path="/" component={OrderList} />
                    <PrivateRoutes exact path="/products" component={ProductList} />
                    <PrivateRoutes exact path="/clients" component={ClientList} />
                    <PrivateRoutes exact path="/orders" component={OrderList} />
                </Switch>
            </Container>
        </BrowserRouter>
    </Container>
)

export default Routes