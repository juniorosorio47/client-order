import React from "react";
import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser } from '@fortawesome/free-solid-svg-icons'

import api from "../../services/api";
import { login } from "../../services/auth";

const Login = (props) => {
    let history = useHistory();
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const onSubmit = async data => {
        // console.log(data);
        try{

            const response = await api.post("/token-auth/", data);
            login(response.data.token)
            
            history.push('/')
        }
        catch(err){
            console.log(err);
            
        }
    }

    return (
        <Container className="align-items-center justify-content-center h-100" >
            <Row className="align-items-center justify-content-center h-100 ">
                <Col lg={4} className="mx-auto my-auto text-center" >
                    <FontAwesomeIcon icon={faUser} className="h1 mb-5"/>
                    <Form onSubmit={handleSubmit(onSubmit)} className="align-items-center justify-content-center h-100 " >
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            {/* <Form.Label>Usuário:</Form.Label> */}
                            <Form.Control type="text" placeholder="Usuário" {...register("username", { required: true })}/>
                            {errors.username && <Form.Text className="text-muted" >Esse campo é obrigatório.</Form.Text>}
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            {/* <Form.Label>Senha:</Form.Label> */}
                            <Form.Control type="password" placeholder="Senha" {...register("password", { required: true })}/>
                            {errors.password && <Form.Text className="text-muted" >Esse campo é obrigatório.</Form.Text>}
                        </Form.Group>
                        <Button lg={12} 
                            type="submit" 
                            className="btn-block m-0 w-100 btn-md"
                            color="primary"
                        >
                            Login
                        </Button>
                    </Form>
                </Col>
            </Row>
            
        </Container>
    )
}

// Login.propTypes = {

// }

export default Login;