import React, { useEffect, useState } from 'react'
import Table from 'react-bootstrap/Table';
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';



export const ItemOrder = ({products, setProducts, getProfit, editForm}) => {
    const { register, handleSubmit, /*watch,*/ reset, formState: { errors } } = useForm();

    useEffect(async () => {
        
        

    }, [setProducts])


    const changeProduct = (e) => { 

        
        const id = e.target.id
        

        switch(e.target.name){
            case 'quantity':
                console.log("changing at quantity")
                products[id].quantity = parseInt(e.target.value);
                
                setProducts(products.map((item, index) => {
                    return index !== id ? item : { quantity: e.target.value }
                }))

                break;
            case 'sell_price':
                console.log("changing at price")
                products[id].sell_price = parseFloat(e.target.value);
                getProfit(products[id].price, products[id].sell_price)
                
                setProducts(products.map((item, index) => {
                    return index !== id ? item : { sell_price: e.target.value}
                }))
                

                console.log(products)
                break;

        }

        // console.log(products)

        // console.log(e.target.value)
    }

    const removeProduct = (e)=>{
        console.log(e.currentTarget.value)
        const productId = e.currentTarget.value;
        products.pop(p => p.id === productId)

        setProducts([...products])
        console.log(products)
    }

    return (
        <Table bordered hover className="shadow shadow-sm mt-2">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Quantidade</th>
                    <th>Preço de venda</th>
                    <th>Rentabilidade</th>
                    {editForm?<></>:<th>Ações</th>}
                </tr>
            </thead>
            <tbody>
                
                {products.length > 0 ? products.map((product, index) => ((
                    <tr key={index}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>{product.price}</td>
                        <td>
                            <div className="input-group">
                                    <input 
                                        disabled={editForm && true}
                                        name="quantity"
                                        onChange={changeProduct}
                                        type="number" 
                                        value={product.quantity}
                                        id={index}
                                        product={product}
                                        max={product.inventory}
                            />
                            </div>
                        </td>
                        <td>
                            <div className="input-group">
                                <input 
                                    disabled={editForm && true}
                                    name="sell_price"
                                    onChange={changeProduct}
                                    type="number" 
                                    value={parseFloat(product.sell_price)}
                                    id={index}
                                    product={product}
                                />
                            </div>
                        </td>
                        <td>
                            {/* {if} */}
                            {getProfit(product.price, product.sell_price)}
                        </td>
                        {editForm?<></>:<td>
                            <Button type="button" className="btn btn-danger" value={product.id} onClick={removeProduct}>
                                <FontAwesomeIcon icon={faTrash} className="" />
                            </Button>
                        </td>}
                        
                    </tr>
                ))):<tr></tr>}
            </tbody>
            
        </Table>
    )
}
