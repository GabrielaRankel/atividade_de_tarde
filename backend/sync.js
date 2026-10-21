const conn  = require('./db/conn')
const {Cliente, Drone, Aendamento} = require('./models/rel')

async function syncDataBase(){
    try {
        await conn.sync({force: true})
        console.log('Sincronizando')
    } catch(err) {
        console.log('Erro ao sincronizar')
        console.error('Erro ao sincronizar')
    }
    finally{
        await conn.close()
        console.log('Fechando conexão')
    }
}

syncDataBase()