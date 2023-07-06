import { Router } from "express";
import {cadastro_obras, findAll, findById, pesquisar_obra, remove, update} from '../controllers/controllers.js'
import {cadastro_usuario, login, validarToken, deletarToken, findAllUsuarios, removeUsuarioID, findByIdUsuario, pesquisarUsuarioPeloNome} from '../controllers/User.controllers.js'


const route = Router()

// Obras
route.post("/cadastro_obras", cadastro_obras)
route.get("/obras", findAll)
route.get("/pegar_obraid/:id", validID, validObras, findById)
route.patch("/:id", validID, validObras, update)
route.delete("/excluir_obras/:id", validID, validObras, remove)
route.post("/pesquisar_obra", pesquisar_obra)

// Usuários
route.post("/cadastro_usuario", cadastro_usuario)
route.post("/login", login)
route.get("/mostrar_usuarios", findAllUsuarios)
route.post("/pesquisar_usuario_nome", pesquisarUsuarioPeloNome)
route.post("/validarToken", validarToken)
route.post("/deletarToken", deletarToken)
route.delete("/excluir_usuario/:id", validID, validUser, removeUsuarioID)

route.get("/pegar_usuarioid/:id", validID, validUser, findByIdUsuario)


export default route
