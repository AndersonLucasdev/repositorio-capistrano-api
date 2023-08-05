import { Router } from "express";
import {
  MostrarObraPeloID,
  MostrarPeloNomeAutor,
  MostrarPeloNomeObra,
  MostrarPeloNomeUsuario,
  MostrarTodasObrasPorAssunto,
  MostrarTodasobra,
  MostrarTodasobraCapistrano,
  MostrarTodasobraOutrosAutores,
  ObrasOrdemAlfabetica,
  ObrasMaisRecentes,
  ObrasMaisAntigas,
  CadastrarObra,
  ExcluirObra,
} from "../controllers/controllersObras.js";

import {
  MostrarTodosUsuarios,
  EncontrarUsuarioId,
  CadastrarUsuario,
  Login,
  removeUsuarioID,
} from "../controllers/controllersUsuarios.js";

import { validarToken, deletarToken } from "../controllers/controllersToken.js";

import {
  CadastrarAdministrador,
  MostrarTodosAdministradores,
  MostrarAdministradorID,
  RemoveAdministrados,
} from "../controllers/controllersAdm.js";

import {
  MostrarTodosAutores,
  MostrarAutorID,
  CadastrarAutor,
  ExcluirAutor,
  EditarAutor,
} from "../controllers/controllersAutores.js";

import {
  MostrarTodosAssuntos,
  MostrarAssuntosID,
  CadastrarAssunto,
  ExcluirAssunto,
  EditarAssunto,
} from "../controllers/controllersAssunto.js";

import { MostrarLinkID, MostrarTodoslinks, CadastrarLink, ExcluirLink, EditarLink } from "../controllers/controllersLink.js";

import { MostrarImgID, MostrarTodosimg, CadastrarImagem, ExcluirImg, EditarImg } from "../controllers/controllersImg.js";

const route = Router();


// Obras
route.get("/mostrar_todas_obras", MostrarTodasobra);
route.get("/mostrar_todas_capistrano", MostrarTodasobraCapistrano);
route.get("/mostrar_outras_obras", MostrarTodasobraOutrosAutores);
route.get("/mostrar_obraid/:id", MostrarObraPeloID);
route.get("/mostrar_obras_recentes", ObrasMaisRecentes);
route.get("/mostrar_ordem_alfabetica", ObrasOrdemAlfabetica);
route.get("/mostrar_obras_antigas", ObrasMaisAntigas);
route.post("/pesquisar_nome_obra", MostrarPeloNomeObra);
route.post("/pesquisar_nome_autor", MostrarPeloNomeAutor);
route.post("/pesquisar_nome_usuario", MostrarPeloNomeUsuario);
route.post("/mostrar_todas_obras_assunto", MostrarTodasObrasPorAssunto);


route.post("/cadastro_obras", CadastrarObra);

route.delete("/excluir_obra/:id", ExcluirObra);

// autor
route.post("/cadastro_autor", CadastrarAutor);
route.get("/mostrar_todos_autores", MostrarTodosAutores);
route.get("/mostrar_autor:id", MostrarAutorID);
route.patch("/editar_autor", EditarAutor)

// Usuários
route.get("/mostrar_todos_usuarios", MostrarTodosUsuarios);
route.get("/mostrar_usuarioid/:id", EncontrarUsuarioId);

route.post("/cadastro_usuarios", CadastrarUsuario);
route.post("/login", Login);

route.delete("excluir_usuario/:id", removeUsuarioID);

// token
route.post("validar_token", validarToken);
route.post("deletar_token", deletarToken);

// administrador
route.post("/cadastrar_adm", CadastrarAdministrador);
route.get("/mostrar_adm:id", MostrarAdministradorID);
route.get("/mostrar_todos_adm", MostrarTodosAdministradores);
route.delete("/deletar_adm", RemoveAdministrados);

// assuntos
route.post("/mostrar_assuntos", MostrarTodosAssuntos);
route.get("/mostrar_assuntoid/:id", MostrarAssuntosID);
route.post("/cadastrar_assunto", CadastrarAssunto);
route.delete("/deletar_assunto", ExcluirAssunto);
route.patch("/editar_assunto", EditarAssunto);

// link
route.get("/mostrar_linkid/:id", MostrarLinkID)
route.get("/msotrar_todos_links", MostrarTodoslinks)
route.post("/cadastrar_link", CadastrarLink)
route.delete("/remover_link", ExcluirLink)
route.patch("/editar_link", EditarLink)


// img
route.get("/mostrar_imgid/:id", MostrarImgID)
route.get("/msotrar_todos_imgs", MostrarTodosimg)
route.post("/cadastrar_img", CadastrarImagem)
route.delete("/remover_img", ExcluirImg)
route.patch("/editar_img", EditarImg)


export default route;
