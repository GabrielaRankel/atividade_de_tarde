// cadastrar, atualizar e listarconst Cliente = require('../models/Cliente')
const Agendamento = require('../models/Agendamento')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async (req, res) => {
    const valores = req.body
    console.log(valores)

    if (!valores.idCliente || !valores.idDrone || !valores.data || !valores.hora) {
        return res.status(400).json({ message: 'Todos os campos são obrigatorios!' })
    }
    try{
        await Agendamento.create({
            nome: valores.idCliente,
            email: valores.idDrone,
            data: valores.data,
            hora: valores.hora
        })
        res.status(201).json({ message: 'Cadastrado com sucesso!' })
    
    }
    catch (err) {
        console.error('Erro ao cadastar!')
        res.status(500).json({ message: 'Erro ao cadastar!' })
    }
}
const listar = async (req, res) => {
    try {
        const agendamentos = await Agendamento.findAll()
        return res.status(200).json(agendamentos)
    } catch (err) {
        console.error('Não foi possível listar', err)
        res.status(500).json({ message: 'Não foi possível listar' })
    }
}

const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const agendamento = await Agendamento.findByPk(id)
        if (!agendamento) {
            return res.status(404).json({ message: 'Agendamento não encontrado!' })
        }

        const dadosAtualizados = {
           nome: valores.idCliente,
            email: valores.idDrone,
            data: valores.data,
            hora: valores.hora
        }

        await Agendamento.update(dadosAtualizados, { where: { codAgendamento: id } })
        return res.status(200).json({ message: 'Atualizado com sucesso!' })
    } catch (err) {
        console.error('Erro ao atualizar:', err)
        return res.status(500).json({ message: 'Erro ao atualizar !' })
    }
}
module.exports = { cadastrar, listar, atualizar}