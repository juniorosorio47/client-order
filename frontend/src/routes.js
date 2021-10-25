import React from 'react';
import {BrowserRouter, Route, Switch, Redirect } from 'react-router-dom'
import Container from 'react-bootstrap/Container';

import { isAuthenticated } from './services/auth'

import { GlobalNavbar } from './components/Nav'

import Login from './pages/Login';
import { ProductList } from './pages/Product/ProductList';
import { ProductDetails } from './pages/Product/ProductDetails';

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
                    <PrivateRoutes exact path="/" component={() => <h1>Hsssssss<p>ssssssss</p>ssssssssssssssssssssssssssssssssssss ome</h1>} />
                    <PrivateRoutes exact path="/products" component={ProductList} />
                    <PrivateRoutes path="/products/:id" component={ProductDetails} />
                </Switch>
            </Container>
        </BrowserRouter>
    </Container>
)

export default Routes