import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';

import api from "../../services/api";
import { logout } from "../../services/auth";

import { Header } from '../../components/Header';
import  Table  from '../../components/Table';

import { OrderForm } from './OrderForm';

export const OrderList = () => {
    let history = useHistory();
    
    const [tableData, setTableData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editForm, setEditForm] = useState(false);
    const [formOrderId, setFormOrderId] = useState(0);
    const [formName, setFormName] = useState('');

    const refreshList = async () => {
      try{
        const response = await api.get("/orders/");
        
        setTableData(response.data) 
        console.log(tableData)
      }
      catch(err){
        console.log(err.response);

        if(err.response.status == 401){
          logout(history);
        }

      }
    }

    useEffect(async () => {
      refreshList()
    }, [])
    
    const handleAddOrder = e => {
      // console.log(e);
      setEditForm(false);
      setShowForm(!showForm);
      setFormName('Nova venda');
    }

    const showOrder = async (e) => {
      setFormOrderId(e.currentTarget.value)

      setFormName(`Ordem de venda #${e.currentTarget.value}`);
      
      setEditForm(true);
      setShowForm(true);

    }

    const deleteProduct = async (e) => {
      const orderId = e.currentTarget.value;

      try{
        const response = await api.delete(`/orders/${orderId}`);
        await refreshList();
        
      }catch(err){
        console.log(err)
      }
    }


    const tableColumns = useMemo(
        () => [
      
            {
              Header: 'Vendas',
              columns: [
                {
                  Header: '#',
                  accessor: 'id',
                },
                {
                  Header: 'Cliente',
                  accessor: 'client',
                },
                {
                  Header: 'Usuário',
                  accessor: 'user',
                },
                {
                  Header: 'Produtos',
                  accessor: 'products_count',
                },
                {
                  Header: 'Quantidade',
                  accessor: 'items',
                },
                {
                  Header: 'Total (R$)',
                  accessor: 'total',
                  Cell: ({ cell }) =>(cell.row.values.total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }))
                },
                {
                  Header: 'Ações',
                  id: 'edit',
                  accessor: 'id',
                  width: 30,
                  Cell: ({ cell }) => (<div className="d-flex justify-content-around m-0 p-0 ">
                      <Button type="button" className="btn btn-secondary " value={cell.row.values.id} onClick={showOrder}>
                        <FontAwesomeIcon icon={faInfo} className=""/>
                      </Button>
                      <Button type="button" className="btn btn-danger" value={cell.row.values.id} onClick={deleteProduct}>
                        <FontAwesomeIcon icon={faTrash} className="" />
                      </Button>
                    </div>
                  )
                },
              ],
            },
          ],
          []
        );

    return (
        <div>

            <Header 
                name="Lista de vendas"
                addButtonText="Adicionar"
                handleAdd = {handleAddOrder}
            />
            <hr/>
            {showForm ? <><OrderForm 
                            formName={formName} 
                            setShowForm={setShowForm} 
                            refreshList={refreshList}
                            formOrderId={formOrderId}
                            editForm={editForm}
                            showForm={showForm}
                          />
                            <hr/> </>:<></>}

            <Table columns={tableColumns} data={tableData} editRecord={showOrder}/>
            
        </div>
    )
}
