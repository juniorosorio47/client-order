import React, { useState, useEffect} from "react";
// import { useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import api from "../../services/api";


export const ClientForm = ({refreshList, setShowForm, formName, editForm, formClientId}) => {
    const { register, handleSubmit, /*watch,*/ reset, formState: { errors } } = useForm();

    useEffect(async () => {
        if(editForm){
            console.log(formClientId);

            const loadProductDetails = async () => {
                const response = await api.get(`/clients/${formClientId}`)

                reset(response.data);
            }

            loadProductDetails();
        }else{
            reset();
        }


    },[formClientId]);

    const closeForm = () => {
        setShowForm();
        refreshList();
        reset();
    }

    const onSubmit = async data => {
        console.log(data);

        try{
            if(editForm){
                await api.put(`/clients/${formClientId}`, data);

            }else{
                await api.post("/clients/", data);

            }

            closeForm();

        }catch(err){
            console.log(err);
            errors.name = err.name;

        }
        
    }


    return (
        <Container className=" h-100 mb-5 mt-5 shadow bg-light" >
            <h2 className="mb-5 mt-5 ">{formName}</h2>
            <Row className="h-100 ">
                <Col lg={12} className="mx-auto my-auto " >
                    <Form onSubmit={handleSubmit(onSubmit)} className=" h-100 mb-5" >
                        <Row className="h-100 ">
                            <Col lg={6} className="">
                                <Form.Group className="mb-3" controlId="name">
                                    <Form.Label>Nome:</Form.Label>
                                    <Form.Control type="text" placeholder="Nome" {...register("name", { required: true })}/>
                                    {errors.name && <Form.Text className="text-muted" >Este campo é obrigatório.</Form.Text>}
                                </Form.Group>
                            </Col>   
                            <Row className="h-100 mx-auto my-auto mt-3 ">
                                <Col lg={6} className=" m-0 p-1 d-flex justify-content-between">
                                    <Button lg={12} 
                                        type="submit" 
                                        className="btn m-0 btn-md btn-primary"
                                        color="primary"

                                        >
                                        Salvar
                                    </Button>
                                    <Button lg={12} 
                                        onClick={closeForm} 
                                        className="btn m-0 btn-md btn-secondary"
                                        color="secondary"
                                        >
                                        Cancelar
                                    </Button>
                                </Col>    
                            </Row>
                        </Row>
                    </Form>

                </Col>
            </Row>
            
        </Container>
    )
}
