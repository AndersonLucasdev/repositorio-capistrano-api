import usuario from "../models/Usuario.js"

const create = (body) => usuario.create(body)


export default {
    create, 
}