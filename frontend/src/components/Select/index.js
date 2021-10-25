import React, { useEffect, useState, useRef } from 'react'
import Form from 'react-bootstrap/Form';
import {default as ReactSelect} from 'react-select'


import api from "../../services/api";

export const Select = ({endpoint, ...rest }) => {
    const [options, setOptions] = useState([]);

    useEffect(async () => {
        const loadOptions = async ()=>{
            const response = await api.get(`${endpoint}`);
            const data = response.data;

            const finalOptions = [];

            data.forEach(item => {
                if(item.inventory<1){
                    console.log(`Product #${item.name} does not have inventory`)
                }else{
                    finalOptions.push({
                        label:item.name, 
                        value:item.id,
                        inventory: item.inventory,
                        price: item.price,
                    })
                }
                
            });

            console.log(finalOptions);
            setOptions(finalOptions);

        }

        await loadOptions()

      }, [])

    return (
        <ReactSelect options={options} {...rest}/>
        // <select className="form-select" {...register(registerName)} {...rest}>
        //     <option value={0} disabled>None</option>
        //     {options.map(value => (
        //         <option key={value.id} value={value.id}>
        //         {value.name}
        //         </option>
        //     ))}
        // </select>
    )
}
