const Drone = require('../models/Drone')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async (req, res) => {
    const valores = req.body
    console.log(valores)

    if (!valores.idCliente || !valores.modelo || !valores.marca || !valores.numero,
        !valores.tipo) {
        return res.status(400).json({ message: 'Todos os campos são obrigatorios!' })
    }

    try {
        const numeroDes = CryptoJS.AES.encrypt(valores.numero, CHAVE_SECRETA).toString()

        await Drone.create({
            idCliente: valores.idCliente,
            modelo: valores.modelo,
            marca: valores.marca,
            numero: numeroDes,
            tipo: valores.tipo
        })

        res.status(201).json({ message: 'Drone Cadastrado com sucesso!' })
    }
    catch (err) {
        console.error('Erro ao cadastar!')
        res.status(500).json({ message: 'Erro ao cadastar' })
    }
}
const listar = async (req, res) => {
    try {
        const drones = await Drone.findAll()
        let resultado = []

        drones.forEach((el) => {
            let descriptografado = ` `
            try {
                const bytes = CryptoJS.AES.decrypt(el.numero, CHAVE_SECRETA)
                numeroDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
            } catch (err) {
                numeroDescriptografado = 'Erro ao descriptografar'
                console.error(numeroDescriptografado, err)
            }
            resultado.push({
                codDrone: el.codDrone,
                idCliente: el.idCliente,
                modelo: el.modelo,
                marca: el.marca,
                numero: numeroDescriptografado,
                tipo: el.tipo,
            })
        })
        return res.status(200).json(resultado)
    } catch (err) {
        console.error('Não foi possível listar', err)
        res.status(500).json({ message: 'Não foi possível listar' })
    }
}
module.exports = { cadastrar, listar }