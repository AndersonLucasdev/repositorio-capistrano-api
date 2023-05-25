import obrasService from '../services/obras.services.js'

// ------- INICIO CADASTRO OBRAS ----------
const cadastro_obras = async (req, res) => {

    // Campos necessários para o cadastro da obra no banco de dados
    const {
        titulo, descricao, resumo, autores
    } = req.body

    //Checando se há campos vázios
    if (!titulo || !autores || !descricao || !resumo) {
        res.status(200).json({Message: "Há campo(s) vazio(s).", status:400})

    } else {
        try{
            //Cadastrando a obra no banco de dados

            const Obras = await obrasService.create(titulo.trim(), autores, descricao, resumo)

            if (!Obras) {
                res.status(200).json({Message: "Erro na criação das obra.", status:400})
            }
                //Obra cadastrada no banco de dados
                res.status(201).json(
                    {
                        user: {
                            id: Obras._id,
                            titulo:titulo.trim(),
                            descricao,
                            resumo, 
                            autores
                        },
                        Message: "Obra cadastrada com sucesso."
                    }
                )
            }

        catch(err){
            return res.status(500).json({Message:"Erro ao cadastrar obra."})
        }
    
        
    }
}
const findAll = async (req, res) => {
    try {
        const obras = await obrasService.findAllService()

        if (obras.length === 0) {
            return res.status(200).json({Message: 'Não há obras cadastradas.'})
        }

        res.status(200).json(obras)
    }

    catch (error) {
        res.status(500).json({Message: error.Message})

    }
} 

const findById = async (req, res) => {
    try {
        const obra = req.obra

        res.status(200).json(obra)
    }

    catch (erro){
        return res.status(500).json({Message: erro.Message})
    }
}

const update = async (req, res) => {
    try {
        const {titulo, resumo, descricao, autores} = req.body

        if (!titulo && !resumo && !descricao && !autores) {
            return res.status(200).json({Message: 'Altere pelo menos um campo.', status:400})
        }

        const {id} = req
        const atualizado = await obrasService.updateService(id, titulo, autores, descricao, resumo)
        console.log(atualizado)
        res.status(200).json({Message: 'Obra atualizada.', atualizado})
    }

    catch (error){
        res.status(500).json({Message: error.Message})
    }
}

const remove = async (req, res) => {
    try {
        const {id} = req
        console.log(id)
        if (!id) {
            return res.status(200).json({Message: 'Id não informado.', status:400})
        }

        const excluido = await obrasService.deleteByID(id)

        res.status(200).json({Message: "Obra excluida com sucesso.", excluido})
    }

    catch (erro){
        res.status(500).json({Message: erro.Message})
    }
}

const pesquisar_obra = async(req,res) =>{
    try{
        const {titulo} = req.body

        if (!titulo) {
            return res.status(200).json({Message: "Titulo não informado.", status: 400})
        }

        const pesquisa = await obrasService.findBynameService(titulo)
        if (!pesquisa){
            res.status(200).json({Message: "Obra(s) não encontrada(s)."})
        }
        
        res.status(200).json({Message: "Obra(s) encontrada(s) com sucesso.",pesquisa})
    } catch(erro){
        res.status(500).json({Message: erro.Message})
    }
}


export {
    cadastro_obras,
    findAll,
    findById,
    update,
    remove,
    pesquisar_obra
}
