import obrasService from '../services/obras.services.js'

const cadastro_obras = async (req, res) => {
    const {
        titulo, descricao, resumo, autores
    } = req.body

    if (!titulo || !autores || !descricao || !resumo) {
        res.status(400).json({message: "Há um campo vazio"})
    } else {
        const Obras = await obrasService.create(req.body)

        if (!Obras) {
            res.status(400).json({message: "Erro na criação das obras"})
        }

            res.status(201).json(
                {
                    user: {
                        id: Obras._id,
                        titulo,
                        descricao,
                        resumo, 
                        autores
                    },
                    message: "Obra cadastrada com sucesso"
                }
            )
        }
    }

const findAll = async (req, res) => {
    try {
        const obras = await obrasService.findAllService()

        if (obras.length === 0) {
            return res.status(200).json({message: 'Não há obras cadastradas'})
        }

        res.status(200).json(obras)
    }

    catch (error) {
        res.status(500).json({message: error.message})

    }
} 

const findById = async (req, res) => {
    try {
        const obra = req.obra

        res.status(200).json(obra)
    }

    catch (erro){
        return res.status(500).json({message: erro.message})
    }
}

const update = async (req, res) => {
    try {
        const {titulo, resumo, descricao, autores} = req.body

        if (!titulo && !resumo && !descricao && !autores) {
            return res.status(400).json({message: 'Altere pelo menos um campo'})
        }

        const {id} = req
        const atualizado = await obrasService.updateService(id, titulo, autores, descricao, resumo)
        console.log(atualizado)
        res.status(200).json({message: 'Obra atualizada', atualizado})
    }

    catch (error){
        res.status(500).json({message: error.message})
    }
}

const remove = async (req, res) => {
    try {
        const {id} = req

        if (!id) {
            return res.status(400).json({message: 'Id não informado'})
        }

        const deletado = await obrasService.deleteByID(id)

        res.status(200).json({message: "Obra excluida com sucesso", deletado})
    }

    catch (erro){
        res.status(500).json({message: erro.message})
    }
}


export {
    cadastro_obras,
    findAll,
    findById,
    update,
    remove
}
