const express = require('express')
const app = express()
const uuid = require('uuid')

app.use(express.json())

/* GET - Buscar informações
   POST - Criar informações
   PUT/PATCH - Alterar/atualizar informações
   DELETE - Deletar informações */

const orders = []

const checkId = (request, response, next) => {
    const { id } = request.params //recebendo o id

    const index = orders.findIndex(order => order.id === id) //verificando o id

    if(index < 0) {
        return response.status(404).json({message: "order not found"})
    }

    request.orderIndex = index
    request.orderId = id

    next()
}   

const consoleInfo = (request, response, next) => {
    const url = console.log(request.url)
    const method = console.log(request.method)

    next()
}

// GET /order: Rota que lista todos os pedidos já feitos.

app.get('/order', consoleInfo, (request, response) => {

    return response.json(orders)


})

// --------------------------------------------


// POST /order: A rota deve receber o pedido do cliente

app.post('/order', consoleInfo, (request, response) => {
    
    const url = console.log(request.url)

    const { order, clienteName, price } = request.body // recebendo pedido pelo body

    const status = 'Em preparação'

    const createOrder = { id:uuid.v4(), order, clienteName, price, status } // gerando o id e recebendo as informações

    orders.push(createOrder) //inserindo o pedido recebido dentro do objeto


    return response.status(201).json(createOrder)

})

// --------------------------------------------

// PATCH /order/:id: Essa rota recebe o id nos parâmetros e assim que ela for chamada, deve alterar o status do pedido recebido pelo id para "Pronto".

app.patch('/order/:id', checkId, consoleInfo, (request, response) => {
    const { order, clienteName, price } = request.body
    const id = request.orderId
    const index = request.orderIndex
    const orderReady = {
        id, order: orders[index].order, clienteName: orders[index].clienteName, price: orders[index].price, status: "Pronto!"
    } //busca as informações pelo index no orders orders(objeto)[informações].dado

    orders[index] = orderReady //substituindo o pedido ja feito pelo pedido pronto

    return response.json(orderReady)

})

// --------------------------------------------

// PUT /order/:id: Essa rota deve alterar um pedido já feito. Pode alterar,um ou todos os dados do pedido.O id do pedido deve ser enviado nos parâmetros da rota.

app.put('/order/:id', checkId, consoleInfo, (request, response) => {
    const { order, clienteName, price, status } = request.body
    const id = request.orderId
    const index = request.orderIndex
    
    const updatedOrder = { id, order, clienteName, price, status: orders[index].status }

    orders[index] = updatedOrder //substituindo o pedido feito pelas informações passadas

    return response.json(updatedOrder)

})

// --------------------------------------------

// DELETE /order/:id: Essa rota deve deletar um pedido já feito com o id enviado nos parâmetros da rota.

app.delete('/order/:id', checkId, consoleInfo, (request, response) => {
    const index = request.orderIndex

    orders.splice(index, 1) //splice remove ou altera

    return response.status(204).json()

})

// --------------------------------------------

app.listen(3000, () => {
  console.log(`O servidor está rodando na porta 5500`)
})