const Drone = require('./Drone')
const Cliente = require('./Cliente')
const Agendamento = require('./Agendamento')

Cliente.hasMany(Agendamento,{
    foreignKey: 'idCliente',
    as: 'agendamentoCliente',
    onDelete: 'CASCADE'
})

Agendamento.belongsTo(Cliente,{
    foreignKey: 'idCliente',
    as: 'clienteAgendamento',
    allowNull: false
})


Drone.hasMany(Agendamento,{
    foreignKey: 'idDrone',
    as: 'agendamentoDrone',
    onDelete: 'CASCADE'
})

Agendamento.belongsTo(Drone,{
    foreignKey: 'idDrone',
    as: 'droneAgendamento',
    allowNull: false
})


module.exports = {Drone, Cliente, Agendamento}