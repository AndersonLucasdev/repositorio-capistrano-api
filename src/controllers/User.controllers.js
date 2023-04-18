import usuario from '../services/user.services.js'
const cadastro_usuario = async (req, res) => {
    try{ const{
        nome, tipo_de_usuario, senha, confirmsenha
    } = req.body
    
    if (!nome || !tipo_de_usuario || !senha || ! confirmsenha) {
        res.status(400).json({message: "Há campo(s) vazio."})
    } else {
        if (senha != confirmsenha || senha.length <= 6) {
            res.status(400).json({message: "A senha está incorreta."})
        } else {
            const Usuario = await usuario.create(req.body)

            if (!Usuario) {
                res.status(400).send({messsage: "Erro na criação do usuario."})
            } else {
                res.status(201).json(
                {
                    user: {
                        id: usuario._id,
                        nome,
                        tipo_de_usuario
                    },
                    message: "Usuario cadastrada com sucesso."
                }
                )
            }
    }
}
    } catch (err) {
        res.status(500).send({message: err.message})
    }
}

export {
    cadastro_usuario
}