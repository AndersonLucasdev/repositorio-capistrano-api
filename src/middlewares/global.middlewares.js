import mongoose from 'mongoose'
import obrasServices from '../services/obras.services.js'
import userServices from '../services/user.services.js'


const validID = async (req, res, next)  => {
    try {
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({Message: "ID invalido"})
        }

        next()
    } catch (error) {
        res.status(500).json({Message: error.Message})
    }
}




const validObras = async (req, res, next) => {
    try {
        const id = req.params.id
        const obra = await obrasServices.findByIdService(id)

        if (!obra) {
            return res.status(400).json({Message: "Obra não encontrada"})
        }

        req.id = id
        req.obra = obra

        next()
    }
    catch (error){
        res.status(500).json({Message: error.Message})
    }
}

const validUser = async (req, res, next) => {
    try {
        const id = req.params.id
        const usuario = await userServices.findById(id)
        if (!usuario) {
            return res.status(400).json({Message: "Usuário não encontrada"})
        }

        req.id = id
        req.usuario = usuario
        next()
    }
    catch (error){
        res.status(500).json({Message: error.Message})
    }
}

export {
    validID,
    validObras,
    validUser
}