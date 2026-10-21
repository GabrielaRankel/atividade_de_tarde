const express = require('express')
const app = express()
const cors = require('cors')

const conn = require('./db/conn')

require('./models/rel.js')

const authMiddleware = require('./middleware/auth.middleware')
const clienteController = require('./controller/cliente.controller.js')
const droneController = require('./controller/drone.controller.js')
const agendamentoController = require('./controller/agedamento.controller.js')
const authController = require('./controller/auth.controller.js')

const hostname = 'localhost'
const PORT = 3000

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.post('/cliente', clienteController.cadastrar)
app.post('/login', authController.login)

app.get('/', (req,res)=>{
    res.status(200).json({message: 'Aplicação rodando!!'})
})

// Middleware de Autenticação para proteger as rotas abaixo
app.use(authMiddleware)

// Rotas privadas do Cliente (CRUD Completo)
app.get('/clientes', clienteController.listar)
app.get('/cliente/buscarNome/:nome', clienteController.consultarPorNome)
app.get('/cliente/:id', clienteController.consultarPorId)
app.put('/cliente/:id', clienteController.atualizar)
app.delete('/cliente/:id', clienteController.excluir)


app.post('/drone', droneController.cadastrar)
app.get('/drones', droneController.listar)

app.post('/agendamento', agendamentoController.cadastrar)
app.get('/agendamentos', agendamentoController.listar)
app.put('/agendamento/:id', agendamentoController.atualizar)



conn.sync()
.then(()=>{
    app.listen(PORT, hostname, ()=>{
        console.log(`Servidor rodando em http://${hostname}:${PORT}`)
    })
})
.catch((err)=>{
    console.error('Erro de conexão no bamco de dados!', err)
})