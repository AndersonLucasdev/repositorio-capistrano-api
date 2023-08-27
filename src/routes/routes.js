import { Router } from "express";
import {
  MostrarObraPeloID,
  MostrarPeloNomeAutor,
  MostrarPeloNomeObra,
  MostrarTodasObrasAleatorio,
  MostrarPeloNomeUsuario,
  MostrarTodasObrasPorAssunto,
  MostrarTodasobra,
  MostrarTodasobraCapistrano,
  MostrarTodasobraOutrosAutores,
  ObrasOrdemAlfabetica,
  MostrarObraPeloIDUsuario,
  MostrarObrasPeloIDAutor,
  ObrasMaisRecentes,
  ObrasMaisAntigas,
  ObrasCriadasMaisAntigas,
  ObrasCriadasMaisRecentes,
  MostrarObrasComNomeEIdUsuario,
  CadastrarObra,
  ExcluirObra,
  EditarObra,
} from "../controllers/controllersObras.js";

import {
  MostrarTodosUsuarios,
  AutorCadaUsuario,
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

import {
  MostrarLinkID,
  MostrarTodoslinks,
  CadastrarLink,
} from "../controllers/controllersLink.js";

import {
  MostrarImgID,
  MostrarTodosimg,
  CadastrarImagem,
} from "../controllers/controllersImg.js";

import {
  MostrarInstituicaoID,
  MostrarTodasInstituicoes,
  CadastrarInstituicao,
  EditarInstituicao,
  ExcluirInstituicao,
} from "../controllers/controllersInstituicoes.js";

import {
  MostrarHomenagemPeloID,
  MostrarHomenagensAleatorio,
  MostrarHomenagensOrdemAlfabetica,
  MostrarHomenagensPorInstituicoes,
  MostrarPeloNomeHomenagem,
  MostrarTodasHomenagens,
  HomenagensMaisAntigas,
  HomenagemMaisRecentes,
  CadastrarHomenagem,
  ExcluirHomenagem,
  EditarHomenagem,
} from "../controllers/controllersHomenagens.js";

const route = Router();

// Obras
route.get("/mostrar_todas_obras", MostrarTodasobra);
route.get("/mostrar_todas_capistrano", MostrarTodasobraCapistrano);
route.get("/mostrar_outras_obras", MostrarTodasobraOutrosAutores);
route.get("/mostrar_obras_aleatorio", MostrarTodasObrasAleatorio);
route.get("/mostrar_obraid/:id", MostrarObraPeloID);
route.get("/mostrar_obras_recentes", ObrasMaisRecentes);
route.get("/mostrar_ordem_alfabetica", ObrasOrdemAlfabetica);
route.get("/mostrar_obras_antigas", ObrasMaisAntigas);
route.get("/mostrar_obras_criadas_antigas", ObrasCriadasMaisAntigas);
route.get("/mostrar_obras_criadas_recentes", ObrasCriadasMaisRecentes);
route.post("/pesquisar_nome_obra", MostrarPeloNomeObra);
route.post("/pesquisar_nome_autor", MostrarPeloNomeAutor);
route.post("/pesquisar_nome_usuario", MostrarPeloNomeUsuario);
route.post("/mostrar_todas_obras_assunto", MostrarTodasObrasPorAssunto);
route.get("/mostrar_obras_id_autor", MostrarObrasPeloIDAutor);
route.get("/mostrar_obras_id_usuario", MostrarObraPeloIDUsuario);
route.get(
  "/mostrar_obras_com_nome_e_id_usuario",
  MostrarObrasComNomeEIdUsuario
);
route.post("/cadastro_obras", CadastrarObra);

route.delete("/excluir_obra/:id", ExcluirObra);

route.patch("/editar_obra", EditarObra);

// autor
route.post("/cadastro_autor", CadastrarAutor);
route.get("/mostrar_todos_autores", MostrarTodosAutores);
route.get("/mostrar_autor:id", MostrarAutorID);
route.patch("/editar_autor", EditarAutor);
route.delete("/excluir_autor:id", ExcluirAutor);

// Usuários
route.get("/mostrar_todos_usuarios", MostrarTodosUsuarios);
route.get("/mostrar_usuarioid/:id", EncontrarUsuarioId);
route.get("/mostrar_autores_dos_usuarios", AutorCadaUsuario);

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
route.get("/mostrar_linkid/:id", MostrarLinkID);
route.get("/msotrar_todos_links", MostrarTodoslinks);
route.post("/cadastrar_link", CadastrarLink);

// img
route.get("/mostrar_imgid/:id", MostrarImgID);
route.get("/msotrar_todos_imgs", MostrarTodosimg);
route.post("/cadastrar_img", CadastrarImagem);

// instituicao
route.get("/mostrar_instituicoes", MostrarTodasInstituicoes);
route.get("/mostrar_instituicaoid/:id", MostrarInstituicaoID);
route.post("/cadastrar_instituicao", CadastrarInstituicao);
route.delete("/deletar_instituicao/:id", ExcluirInstituicao);
route.patch("/editar_instituicao", EditarInstituicao);

// homenagem
route.get("/mostrar_homenagens", MostrarTodasHomenagens)
route.get("/mostrar_homenagem/:id", MostrarHomenagemPeloID)
route.get("/mostrar_homenagens_aleatorio", MostrarHomenagensAleatorio)
route.get("/mostrar_homenagens_alfabetico", MostrarHomenagensOrdemAlfabetica)
route.post("/mostrar_homenagens_instituicoes", MostrarHomenagensPorInstituicoes)
route.post("mostrar_homenagem_nome", MostrarPeloNomeHomenagem)
route.get("/mostrar_homenagens_antigas", HomenagensMaisAntigas)
route.get("/mostrar_homenagens_recentes", HomenagemMaisRecentes)
route.post("/cadastrar_homenagem", CadastrarHomenagem)
route.delete("/deletar_homenagem/:id", ExcluirHomenagem)
route.patch("/editar_homenagemm", EditarHomenagem)

export default route;
