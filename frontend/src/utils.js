import Badge  from 'react-bootstrap/Badge';


export const getProfit = (price, sell_price)=>{
    console.log(sell_price)

    const profit = (parseFloat(sell_price)/parseFloat(price)).toFixed(2)
    console.log("Profit", profit)

    if(profit>=1.1){
        return <Badge className='badge' bg="success">Ótima</Badge>  
    }
    if(profit<1.1 && profit>=1){
        return <Badge className='badge' bg="primary">Boa</Badge>  
    }
    else if(profit<0.9){
        return <Badge className='badge' bg="danger">Ruim</Badge>  
    }

}