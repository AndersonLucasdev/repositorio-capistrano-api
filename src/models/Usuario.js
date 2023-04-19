import mongoose from "mongoose";
import bcrypt from "bcrypt"
const UsuarioSchema = new mongoose.Schema({
    usuario: {
        type: String,
        required: true,
        unique: true
    },
    tipo_de_usuario: {
        type: String,
        required: true,
    },
    senha: {
        type: String,
        required: true

    },
    
})
// baixar o bcrypt: npm i bcrypt
UsuarioSchema.pre("save", async function(next) {
    this.senha = await bcrypt.hash(this.senha, 10)
    // this.confirmsenha = await bcrypt.hash(this.confirmsenha, 10)
    next()
})
const Usuario = mongoose.model("Usuario", UsuarioSchema) 

export default Usuario