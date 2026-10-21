const Cliente = require('../models/Cliente')
const CryptoJS = require('crypto-js')
const CHAVE_SECRETA = 'segredo'

const cadastrar = async (req, res) => {
    const valores = req.body
    console.log(valores)

    if (!valores.nome || !valores.email || !valores.senha || !valores.cpf || !valores.celular) {
        return res.status(400).json({ message: 'Todos os campos são obrigatorios!' })
    }

    if (valores.cpf.length !== 11) {
        return res.status(400).json({ message: 'cpf invalido' })
    }

    try {
        const cpfCripto = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        const senhaCripto = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()

        await Cliente.create({
            nome: valores.nome,
            email: valores.email,
            senha: senhaCripto,
            cpf: cpfCripto,
            celular: valores.celular
        })

        res.status(201).json({ message: 'Cliente Cadastrado com sucesso!' })
    }
    catch (err) {
        console.error('Erro ao cadastar o cliente!',err)
        res.status(500).json({ message: 'Erro ao cadastar o cliente!' })
    }
}
const listar = async (req, res) => {
    try {
        const clientes = await Cliente.findAll()
        let resultado = []

        clientes.forEach((el) => {
            let descriptografado = ` `
            try {
                const bytes = CryptoJS.AES.decrypt(el.cpf, CHAVE_SECRETA)
                cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
            } catch (err) {
                cpfDescriptografado = 'Erro ao descriptografar'
                console.error(cpfDescriptografado, err)
            }
            resultado.push({
                codCliente: el.codCliente,
                nome: el.nome,
                email: el.email,
                cpf: cpfDescriptografado,
                celular: el.celular
            })
        })
        return res.status(200).json(resultado)
    } catch (err) {
        console.error('Não foi possível listar os Clientes', err)
        res.status(500).json({ message: 'Não foi possível listar os Clientes' })
    }
}

const consultarPorId = async (req, res) => {
    const id = req.params.id
    try {
        const cliente = await Cliente.findByPk(id)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado!' })
        }

        const bytes = CryptoJS.AES.decrypt(cliente.cpf, CHAVE_SECRETA)
        console.log('bytes = ', bytes)
        const cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
        console.log('cpf descriptografado = ', cpfDescriptografado)

        return res.status(200).json({
            codCliente: cliente.codCliente,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cpfDescriptografado,
            celular: cliente.celular
        })
    } catch (err) {
        console.error('Erro ao consultar cliente:', err)
        return res.status(500).json({ message: 'Erro ao consultar cliente!' })
    }
}

const consultarPorNome = async (req, res) => {
    const nome = req.params.nome
    try {
        const cliente = await Cliente.findOne({ where: { nome: nome } })
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado!' })
        }

        const bytes = CryptoJS.AES.decrypt(cliente.cpf, CHAVE_SECRETA)
        console.log('bytes = ', bytes)
        const cpfDescriptografado = bytes.toString(CryptoJS.enc.Utf8)
        console.log('cpf descriptografado = ', cpfDescriptografado)

        return res.status(200).json({
            codCliente: cliente.codCliente,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cpfDescriptografado,
            celular: cliente.celular
        })
    } catch (err) {
        console.error('Erro ao consultar cliente:', err)
        return res.status(500).json({ message: 'Erro ao consultar cliente!' })
    }
}
const excluir = async (req, res) => {
    const id = req.params.id
    try {
        const dados = await Cliente.findByPk(id)

        if (!dados) {
            res.status(400).json({ message: 'Cliente não localizado no banco de dados!' })
        }
        else {
            await Cliente.destroy({ where: { codCliente: id } })
            res.status(200).json({ message: 'Cliente excluído com sucesso!' })
        }
    }
    catch (err) {
        res.status(500).json({ message: 'Erro ao excluir os dados!' })
        console.error('Erro ao excluir os dados!')
    }
}
const atualizar = async (req, res) => {
    const id = req.params.id
    const valores = req.body

    try {
        const cliente = await Cliente.findByPk(id)
        if (!cliente) {
            return res.status(404).json({ message: 'Cliente não encontrado!' })
        }

        const dadosAtualizados = {
            codCliente: cliente.codCliente,
            nome: cliente.nome,
            email: cliente.email,
            cpf: cliente.cpf,
            celular: cliente.celular
        }

        if (valores.cpf) {
            if (valores.cpf.length !== 11) {
                return res.status(400).json({ message: 'O cpf deve conter exatamente 11 dígitos!' })
            }
            dadosAtualizados.cpf = CryptoJS.AES.encrypt(valores.cpf, CHAVE_SECRETA).toString()
        }

        if (valores.senha) {
            dadosAtualizados.senha = CryptoJS.AES.encrypt(valores.senha, CHAVE_SECRETA).toString()
        }

        await Cliente.update(dadosAtualizados, { where: { codCliente: id } })
        return res.status(200).json({ message: 'Cliente atualizado com sucesso!' })
        
    } catch (err) {
        console.error('Erro ao atualizar cliente:', err)
        return res.status(500).json({ message: 'Erro ao atualizar cliente!' })
    }
}
module.exports = { cadastrar, listar, consultarPorId, atualizar, excluir, consultarPorNome }