import React, { useState, useEffect} from "react";
import { useForm } from "react-hook-form";

import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';

import api from "../../services/api";
import { getProfit } from "../../utils";

import { Select } from "../../components/Select";
import { SelectForm } from "../../components/SelectForm";
import { ItemOrder } from "../../components/ItemOrder";


export const OrderForm = ({refreshList, setShowForm, formName, editForm, formOrderId}) => {
    
    const { register, handleSubmit, /*watch,*/ reset, formState: { errors } } = useForm();
    const [products, setProducts] = useState([]);
    const [formError, setFormError] = useState({status:false, data:[]});

    useEffect(async () => {

        if(editForm){
            console.log(formOrderId);

            const loadOrderDetails = async () => {
                const response = await api.get(`/orders/${formOrderId}`);
                console.log(response.data)
                setProducts(response.data.products)

                reset({client:response.data.client_id})

                
            }

            loadOrderDetails();
        }else{
            reset();
        }

    },[formOrderId]);

    const closeForm = () => {
        setShowForm();
        refreshList();
        reset();
    }

    const onSubmit = async data => {
        data.products = products;

        console.log(data);
        if(data.client==''){
            setFormError({status:true, data:data.push(`Por favor, selecione o cliente.`)})
            setTimeout(() => {
                setFormError({status:false, data:[]});
            }, 5000)
            return;
        }

        if(products.length<1){
            setFormError({status:true, data:data.push(`A lista de produtos está vazia.`)})
            setTimeout(() => {
                setFormError({status:false, data:[]});
            }, 5000)
            return;
        }


        products.map(product =>{
            const productMaxPrice = (product.price*100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

            if(product.sell_price > product.price*100) 
                setFormError({status:true, data: data.push(`Produto #${product.id} pode ser vendido por no máximo ${productMaxPrice}`)})
                setTimeout(() => {
                    setFormError({status:false, data:[]});
                }, 5000)

                return;
        })

        try{
  
            await api.post("/orders/", data);

            closeForm();

        }catch(err){
            console.log(err.response);
            setFormError({status:true, data:[...err.response.data]});

            setTimeout(() => {
                setFormError({status:false, data:[]});
             }, 5000)

        }
        
    }

    
    

    const productChange = (data) => {
        console.log(data);



        setProducts([...products, {
            id: data.value,
            name: data.label,
            quantity: data.quantity ? data.quantity : 1,
            price: data.price,
            sell_price: data.sell_price ? data.sell_price : data.price,
        }])

    }


    return (
        <Container className=" h-100 mb-5 mt-5 shadow bg-light" >
            <h2 className="mb-5 mt-5 ">{formName}</h2>
            <Row className="h-100 ">
                <Col lg={12} className="mx-auto my-auto " >
                    <Form onSubmit={handleSubmit(onSubmit)} className=" h-100 mb-5" >
                        <Row className="h-100 ">
                            <Row className="h-100 mx-auto my-auto mt-3 ">
                                <Col lg={6} className="">
                                    <Form.Group className="mb-3" controlId="name" >
                                        <Form.Label>Client:</Form.Label>
                                        {!editForm ?
                                            <SelectForm endpoint="clients/" register={register} registerName={'client'} required />
                                        :
                                            <SelectForm disabled={true} endpoint="clients/" register={register} registerName={'client'} required />
                                            
                                        }
                                        {errors.client && <Form.Text className="text-muted" >Este campo é obrigatório.</Form.Text>}
                                        
                                    </Form.Group>
                                    
                                </Col>
                            </Row> 
                            <Row className="h-100 mx-auto my-auto mt-3 ">
                                <Col lg={12} className="">
                                    <Form.Group className="mb-3 " controlId="name">
                                            <Form.Label>Products:</Form.Label>
                                            {!editForm && <Select 
                                                endpoint="products/" 
                                                onChange={productChange}
                                            />}
                                            
                                            <ItemOrder editForm={editForm} products={products} setProducts={setProducts} getProfit={getProfit} />
  
                                    </Form.Group>
                                    
                                </Col> 
                                {formError.status ? <Alert variant="danger">
                                    Erro ao salvar ordem de venda: {formError.data.map((err,index)=>(<div key={`error-${index}`}>{err}<br/></div>))}
                                </Alert>:<></>}
                            </Row>   
                            <Row className="row h-10 mx-auto my-auto flex-nowrap">
                                <Col lg={6} className=" w-10 m-0 p-1 d-flex justify-content-left ">
                                    <Button lg={12} 
                                        type="submit" 
                                        className="btn m-0 btn-md btn-primary mr-5"
                                        color="primary"
                                        >
                                        Salvar
                                    </Button>
                                </Col>    
                                <Col lg={6} className=" w-10 m-0 p-1 d-flex justify-content-left">
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
