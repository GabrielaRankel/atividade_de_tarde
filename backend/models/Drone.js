const { DataTypes } = require('sequelize')
const db = require('../db/conn')

const Drone = db.define('drone', {
    codDrone: {
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
    modelo: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    marca: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    numero : {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    tipo: {
        type: DataTypes.STRING(50),
        allowNull: false
    }
}, {
    tableName: 'drones',
    timestamps: false
})

module.exports = Drone