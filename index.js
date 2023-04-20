const express = require('express');
const uuid = require('uuid');
const port = 3000;
const app = express();
app.use(express.json())

const orders = []

const checkOrderId = (request, response, next) =>{
    const { id } = request.params
    const index = orders.findIndex(order => order.id === id)

    if (index < 0 ){
        return response.status(404).json({error: "Order not found."})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}

const checkUrl = (request, respose, next) =>{
    const method = request.method
    const url = request.url

    console.log(`Method used: ${method}, and Url used: ${url}`)

    next()
}

app.get('/order/', checkUrl, (request, response) =>{

    return response.json(orders)
    
})


app.post('/order/', checkUrl, (request, response) =>{

    const { clientOrder, clientName, priceOrder } = request.body

    const order = {id:uuid.v4(), clientOrder, clientName, priceOrder, status: "Em preparação" }

    orders.push(order)

    return response.status(201).json(order)
    
})

app.delete('/order/:id', checkOrderId, checkUrl, (request, response) =>{
    const index =request.orderIndex

    orders.splice(index,1)

    return response.status(204).json()

})

app.put('/order/:id', checkOrderId, checkUrl, (request, response) =>{
    const { clientOrder, clientName, priceOrder } = request.body
    const index = request.orderIndex
    const id = request.orderId

    const updatedOrder = { id, clientOrder, clientName, priceOrder, status: "Em preparação" }

    orders [index] = updatedOrder

    return response.json(updatedOrder)
})

app.get('/order/:id', checkOrderId, checkUrl, (request, response) =>{
    const index = request.orderIndex
    const order = orders[index]

    return response.json(order)
})

app.patch('/order/:id', checkOrderId, checkUrl, (request, response) =>{
    const index = request.orderIndex

    const order = orders[index]
    order.status = "Pedido Pronto"

    return response.json(order)
})



app.listen(port, () =>{
    console.log(`Servidor foi iniciado! ${port}`)
})
