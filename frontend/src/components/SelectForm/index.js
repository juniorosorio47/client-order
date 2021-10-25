import React, { useEffect, useState } from 'react'
import Form from 'react-bootstrap/Form';
import {default as ReactSelect} from 'react-select'


import api from "../../services/api";

export const SelectForm = ({endpoint, register, registerName, ...rest }) => {
    const [options, setOptions] = useState([]);
    // const formSelect = registerName ? {...register(registerName)}:'';

    useEffect(async () => {
        const loadOptions = async ()=>{
            const response = await api.get(`${endpoint}`);
            const data = response.data;

            const finalOptions = [];

            data.forEach(item => {
                finalOptions.push({ label: item.name, value:item.id })
            });

            console.log(finalOptions);
            setOptions(finalOptions);

        }

        await loadOptions()

      }, [])

    return (
        // <ReactSelect options={options} {...register(registerName)} {...rest} closeMenuOnSelect={true} />
        <select className="form-select" {...register(registerName)} {...rest}>
            <option value={0} disabled>None</option>
            {options.map(value => (
                <option key={value.value} value={value.value}>
                {value.label}
                </option>
            ))}
        </select>
    )
}
