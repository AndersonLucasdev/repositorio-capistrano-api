import { Router } from "express";
import { MostrarObraPeloID, MostrarPeloNomeAutor, MostrarPeloNomeObra, 
    MostrarPeloNomeUsuario, MostrarTodasobra, MostrarTodasobraCapistrano,
    MostrarTodasobraOutrosAutores, CadastrarObra, ExcluirObra } from "../controllers/controllersObras.js";

import { MostrarTodosUsuarios, EncontrarUsuarioId, CadastrarUsuario, Login, removeUsuarioID } from "../controllers/controllersUsuarios.js";

import {validarToken, deletarToken} from '../controllers/controllersToken.js'

const route = Router()

// Obras
// mostrar
route.get("/mostrar_todas_obras", MostrarTodasobra)
route.get("/mostrar_todas_capistrano", MostrarTodasobraCapistrano)
route.get("/mostrar_outras_obras", MostrarTodasobraOutrosAutores)
route.get("/mostrar_obraid/:id", MostrarObraPeloID)
route.post("/pesquisar_nome_obra", MostrarPeloNomeObra)
route.post("/pesquisar_nome_autor", MostrarPeloNomeAutor)
route.post("/pesquisar_nome_usuario", MostrarPeloNomeUsuario)

// cadastrar
route.post("/cadastro_obras", CadastrarObra)

// editar


// excluir
route.delete("/excluir_obra/:id", ExcluirObra)

// Usuários
//mostrar
route.get("/mostrar_todos_usuarios", MostrarTodosUsuarios)
route.get("/mostrar_usuarioid/:id", EncontrarUsuarioId)

// cadastrar/logar
route.post("/cadastro_usuarios", CadastrarUsuario)
route.post("/login", Login)

// excluir
route.delete("excluir_usuario/:id", removeUsuarioID)


// token
// validar
route.post("validar_token", validarToken)
route.post("deletar_token", deletarToken)


export default route
