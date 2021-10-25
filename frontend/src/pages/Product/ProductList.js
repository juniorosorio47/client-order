import React, { useState, useEffect, useMemo } from 'react'
import { useHistory, Link } from "react-router-dom";

import api from "../../services/api";
import { logout } from "../../services/auth";

import { Header } from '../../components/Header'
import Button from 'react-bootstrap/Button';

import  Table  from '../../components/Table'
import { ProductForm } from './ProductForm'

export const ProductList = () => {
    let history = useHistory();
    
    const [tableData, setTableData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editForm, setEditForm] = useState(false);
    const [formProductId, setFormProductId] = useState(0);
    const [formName, setFormName] = useState('');

    const refreshList = async () => {
      try{
        const response = await api.get("/products/");
        
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
    
    const handleAddProduct = e => {
      // console.log(e);
      setEditForm(false);
      setShowForm(!showForm);
      setFormName('Novo Produto');
    }

    const editTable = async (e) => {
      setFormProductId(e.target.value)

      setFormName(`Editar produto #${e.target.value}`);
      
      setEditForm(true);
      setShowForm(true);

    }

    const deleteProduct = async (e) => {
      const productId = e.target.value;

      try{
        const response = await api.delete(`/products/${productId}`);
        await refreshList()
        
      }catch(err){
        console.log(err)
      }
    }


    const tableColumns = useMemo(
        () => [
      
            {
              Header: 'Produtos',
              columns: [
                {
                  Header: '#',
                  accessor: 'id',
                },
                {
                  Header: 'Nome',
                  accessor: 'name',
                },
                {
                  Header: 'Preço (R$)',
                  accessor: 'price',
                },
                {
                  Header: 'Estoque',
                  accessor: 'inventory',
                },
                {
                  Header: 'Múltiplo',
                  accessor: 'multiple',
                },
                {
                  Header: 'Ações',
                  id: 'edit',
                  accessor: 'id',
                  width: 30,
                  Cell: ({ cell }) => (<div className="d-flex justify-content-around fluid ">
                      <Button type="button" className="btn btn-secondary " value={cell.row.values.id} onClick={editTable}>
                        Edit
                      </Button>
                      <Button type="button" className="btn btn-danger" value={cell.row.values.id} onClick={deleteProduct}>
                        Delete
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
                name="Lista de produtos"
                addButtonText="Adicionar"
                handleAdd = {handleAddProduct}
            />
            <hr/>
            {showForm ? <><ProductForm 
                            formName={formName} 
                            setShowForm={setShowForm} 
                            refreshList={refreshList}
                            formProductId={formProductId}
                            editForm={editForm}
                            showForm={showForm}
                          />
                            <hr/> </>:<></>}

            <Table columns={tableColumns} data={tableData} editRecord={editTable}/>
            
        </div>
    )
}
