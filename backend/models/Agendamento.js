const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Agendamento = db.define('agedamento', {
    codAgendamento: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    idCliente:{
        type: DataTypes.INTEGER,
        references:{
            model: 'clientes',
            key: 'codCliente'
        }
    },
    idDrone:{
        type: DataTypes.INTEGER,
        references:{
            model: 'drones',
            key: 'codDrone'
        }
    },
    data: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    hora: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'agedamentos',
    timestamps: false
})

module.exports = Agendamento