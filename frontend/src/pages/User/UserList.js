import React from 'react';
import { Link } from 'react-router-dom'
import { useFetch } from '../../hooks/useFetch'

// import { Container } from './styles';



const UserList = () => {
    const { data } = useFetch('http://localhost:8080/users')

    return <div>
        <h1>Users List</h1>
        <ul>
            {data.map(user =>(
                <li key={user.id}>{user.username}</li>
            ))}
        </ul>
    </div>
}

export default UserList;