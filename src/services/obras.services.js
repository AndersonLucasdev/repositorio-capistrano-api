import Obras from "../models/Obras.js"

const create = (body) => Obras.create(body)

const findAllService = () => Obras.find()

const findByIdService = (id) => Obras.findById(id)

const updateService = (
    id,
    titulo,
    autores,
    descricao,
    resumo
    ) => 
    Obras.findOneAndUpdate({_id: id }, 
        {
        titulo,
        autores,
        descricao,
        resumo
    },
    {new: true}
    
    )

const deleteByID = (id) => Obras.findByIdAndDelete(id)

export default {
    create,
    findAllService,
    findByIdService,
    updateService,
    deleteByID

}