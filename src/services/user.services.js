import jwt from 'jsonwebtoken'
import Usuarios from "../models/Usuario.js"


const create = (body) => Usuarios.create(body)

const findAllusuarioService = () => Usuarios.find()

const findbyName = (usuario) => Usuarios.findOne({usuario})

const findById = (id) => Usuarios.findById(id)

const deleteByIDService = (id) => Usuarios.findByIdAndDelete(id)

const generateToken = (user) => jwt.sign({usuario: user}, process.env.SECRET_JWT, {expiresIn: 86400})


export default {
    create, findAllusuarioService, findById, findbyName, deleteByIDService, generateToken
}