import usuarioService from '../services/user.services.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const cadastro_usuario = async (req, res) => {
    
    try{ 
        const{
        usuario, tipo_de_usuario, senha, confirmsenha
    } = req.body
    
    if (!usuario || !tipo_de_usuario || !senha || ! confirmsenha) {
        res.status(200).json({Message: "Há campo(s) vazio.", status:400})
    } else {
        if (senha != confirmsenha || senha.length <= 6) {
            res.status(200).json({Message: "A senha está incorreta.", status:400})
        } else {

            const Usuario = await usuarioService.create(req.body)

            if (!Usuario) {
                res.status(200).send({messsage: "Erro na criação do usuario.", status:400})
            } else {
                res.status(201).json(
                    {
                        user: {
                            id: Usuario._id,
                            usuario,
                            tipo_de_usuario
                        },
                        Message: "Usuario cadastrada com sucesso."
                    }
                )
            }
    }
}
    } catch (err) {
        res.status(500).send({Message: err.Message})
    }
}

const login = async (req, res) =>  {

    const {usuario, senha}= req.body

    if (!usuario || !senha) {
        res.status(200).json({Message: "Há campos vazios", status:400})
    }

    const verificado = await usuarioService.findbyName(usuario) // objeto

    if (!verificado) {
        res.status(200).json({Message: 'Usuario ou senha incorretos', status:400})
    }
    const senhaValida = bcrypt.compareSync(senha, verificado.senha)

    if (!senhaValida) {
        res.status(200).json({Message: 'Usuario ou senha incorretos', status:400})
    }

    const token = usuarioService.generateToken(usuario) 

    res.cookie("token",token,{httpOnly:true})
    res.status(200).json({token:token,id:verificado._id,usuario:verificado.usuario, tipo_usuario:verificado.tipo_de_usuario})

}

const validarToken = async (req,res) =>{

    const token =  req.body.token || req.query.token || req.cookies.token || req.headers['x-access-token'];
    req.token = token

    if(!token){
        return res.status(200).json({Message:"Token inválido", status:400})
    }

    jwt.verify(token, process.env.SECRET_JWT, (err, decoded) =>{
        if(err){
            console.log("oi")
            return res.status(200).json({Message:"Token inválido", status:400})
        }else{
            req.usuario = decoded.usuario
            return res.status(200).json({Message:"Token válido"})
        }
    })
}

const deletarToken = async (req, res) =>{

    const token = req.body.token || req.query.token || req.cookies.token || req.headers['x-access-token'];

    if(!token){
       return res.status(200).json({Message:"Logout não autorizado", status:400})
    }

    res.cookie('token', null, {httpOnly:true})
    
    return res.status(200).json({Message:"Você foi desconectado"})

}

const findAllUsuarios = async (req, res) => {
    try {
        const usuario = await usuarioService.findAllusuarioService()

        if (usuario.length === 0) {
            return res.status(200).json({Message: 'Não há usuarios cadastrados'})
        }   else {
            res.status(200).json(usuario)
        }
    }  catch (error) {
        res.status(500).json({Message: error.Message})
    }
} 

const findByIdUsuario = async (req, res) => {
    try {
        const usuario = req.usuario

        res.status(200).json(usuario)
    }

    catch (erro){
        return res.status(500).json({Message: erro.Message})
    }
}


const pesquisarUsuarioPeloNome = async (req,res) =>{
    try {
        const {usuario} = req.body

        if(!usuario){
            return res.status(200).json({Message:"Há campos vázios", status:400})
        }

        const verificarUsuario = await usuarioService.findbyName(usuario)

        if(!verificarUsuario){
            return res.status(200).json({Message:"Usuário não encontrado", status:400})
        }

        res.status(200).json({Message:"Usuário encontrado", verificarUsuario})
    } catch(erro){
        res.status(500).json({Message: erro.Message})
    }
}

const removeUsuarioID = async (req, res) => {
    try {

        const {id} = req
        if (!id) {
            return res.status(200).json({Message: 'Id não informado', status:400})
        }

        const deletado = await usuarioService.deleteByIDService(id)

        return res.status(200).json({Message: "Usuário excluido com sucesso", deletado})
    }

    catch (erro){
        res.status(500).json({Message: erro.Message})
    }
}

export {
    cadastro_usuario,
    login,
    validarToken,
    deletarToken,
    pesquisarUsuarioPeloNome,
    removeUsuarioID,
    findAllUsuarios,
    findByIdUsuario
}