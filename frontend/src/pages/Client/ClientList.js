import React, { useState, useEffect, useMemo } from 'react'
import { useHistory } from "react-router-dom";

import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

import api from "../../services/api";
import { logout } from "../../services/auth";

import { Header } from '../../components/Header'
import  Table  from '../../components/Table'

import { ClientForm } from './ClientForm'

export const ClientList = () => {
    let history = useHistory();
    
    const [tableData, setTableData] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editForm, setEditForm] = useState(false);
    const [formClientId, setFormClientId] = useState(0);
    const [formName, setFormName] = useState('');

    const refreshList = async () => {
      try{
        const response = await api.get("/clients/");
        
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
    
    const handleAddClient = e => {
      // console.log(e);
      setEditForm(false);
      setShowForm(!showForm);
      setFormName('Novo Cliente');
    }

    const editTable = async (e) => {
      console.log(e.currentTarget)
      setFormClientId(e.currentTarget.value)

      setFormName(`Editar cliente #${e.currentTarget.value}`);
      
      setEditForm(true);
      setShowForm(true);

    }

    const deleteProduct = async (e) => {
      const clientId = e.currentTarget.value;

      try{
        const response = await api.delete(`/clients/${clientId}`);
        await refreshList()
        
      }catch(err){
        console.log(err)
      }
    }


    const tableColumns = useMemo(
        () => [
      
            {
              Header: 'Clientes',
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
                  Header: 'Ações',
                  id: 'edit',
                  accessor: 'id',
                  width: 30,
                  Cell: ({ cell }) => (<div className="d-flex justify-content-around m-0 p-0 ">
                      <Button type="button" className="btn btn-secondary " value={cell.row.values.id} onClick={editTable}>
                        <FontAwesomeIcon icon={faEdit} className=""/>
                      </Button>
                      <Button type="button" className="btn btn-danger" value={cell.row.values.id} onClick={deleteProduct}>
                        <FontAwesomeIcon icon={faTrash} className=""/>
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
                name="Lista de clientes"
                addButtonText="Adicionar"
                handleAdd = {handleAddClient}
            />
            <hr/>
            {showForm ? <><ClientForm 
                            formName={formName} 
                            setShowForm={setShowForm} 
                            refreshList={refreshList}
                            formClientId={formClientId}
                            editForm={editForm}
                            showForm={showForm}
                          />
                            <hr/> </>:<></>}

            <Table columns={tableColumns} data={tableData} editRecord={editTable}/>
            
        </div>
    )
}
