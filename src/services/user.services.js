import jwt from 'jsonwebtoken'
import usuarios from "../models/Usuario.js"


const create = (body) => usuarios.create(body)

const findbyName = (usuario) => usuarios.findOne({usuario})

const generateToken = (user) => jwt.sign({usuario: user}, process.env.SECRET_JWT, {expiresIn: 86400})

export default {
    create, findbyName, generateToken
}