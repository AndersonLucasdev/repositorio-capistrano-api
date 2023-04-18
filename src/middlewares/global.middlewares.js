import mongoose from 'mongoose'
import obrasServices from '../services/obras.services.js'

const validID = async(req, res, next)  => {
    try {
        const id = req.params.id
        if (!mongoose.Types.ObjectId.isValid(id)) {
            res.status(400).json({message: "Id invalido"})
        }

        next()
    }
    catch (error){
        res.status(500).json({message: error.message})
    }
}


const validObras = async (req, res, next) => {
    try {
        const id = req.params.id
        const obra = await obrasServices.findByIdService(id)

        if (!obra) {
            return res.status(400).json({message: "Obra não encontrada"})
        }

        req.id = id
        req.obra = obra

        next()
    }
    catch (error){
        res.status(500).json({message: error.message})
    }
}


export {
    validID,
    validObras
}