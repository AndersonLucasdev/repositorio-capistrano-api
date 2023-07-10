import pool from "../database/db.js"
import jwt from 'jsonwebtoken'


const validarToken = async (req, res) => {
    const token =  req.body.token || req.query.token || req.cookies.token || req.headers['x-access-token'];
    req.token = token

    if(!token){
        return res.status(200).json({Message:"Token inválido.", status:400})
    }

    jwt.verify(token, '802c6ed36c616ef9df379ef94c380f', (err, decoded) =>{
        if(err){
            return res.status(200).json({Message:"Token inválido.", status:400})
        }else{
            req.usuario = decoded.usuario
            return res.status(200).json({Message:"Token válido."})
        }
    })
}

const deletarToken = async (req, res) => {
    const token = req.body.token || req.query.token || req.cookies.token || req.headers['x-access-token'];

    if(!token){
       return res.status(200).json({Message:"Logout não autorizado.", status:400})
    }
    res.cookie('token', null, {httpOnly:true})
    
    return res.status(200).json({Message:"Você foi desconectado."})
};

export {
    validarToken, deletarToken
}