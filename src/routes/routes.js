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
  MostrarTodosHomenageados,
MostrarHomenageadopeloNome,
MostrarHomenageadoID,
CadastrarHomenageado,
ExcluirHomenageado,
EditarHomenageado,
} from "../controllers/controllersHomenageados.js"

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
  MostrarAutorpeloNome,
} from "../controllers/controllersAutores.js";

import {
  MostrarTodosAssuntos,
  MostrarAssuntosID,
  CadastrarAssunto,
  ExcluirAssunto,
  EditarAssunto,
  MostrarAssuntopeloNome,
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
  MostrarTodasHomenagens,
  MostrarHomenagensComNomeEIdUsuario,
  MostrarHomenagensAleatorio,
  MostrarHomenagemPeloID,
  MostrarTodasHomenagensPorAssunto,
  HomenagensOrdemAlfabetica,
  HomenagensMaisRecentes,
  HomenagensMaisAntigas,
  HomenagensCriadasMaisAntigas,
  HomenagensCriadasMaisRecentes,
  MostrarPeloNomeHomenagem,
  MostrarTodasHomenagensPorInstituicao,
  MostrarPeloNomeHomenageado,
  MostrarHomenagensPeloIDHomenageado,
  MostrarHomenagensPeloNomeUsuario,
  MostrarHomenagemPeloIDUsuario,
  MostrarTodasHomenagensCapistrano,
  MostrarTodasHomenagensOutrosHomenageados,
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
route.get("/mostrar_obras_id_autor/:id_autor", MostrarObrasPeloIDAutor);
route.get("/mostrar_obras_id_usuario/:id_usuario", MostrarObraPeloIDUsuario);
route.get(
  "/mostrar_obras_com_nome_e_id_usuario",
  MostrarObrasComNomeEIdUsuario
);
route.post("/cadastro_obras", CadastrarObra);

route.delete("/excluir_obra/:id_obra", ExcluirObra);

route.patch("/editar_obra", EditarObra);

// autor
route.post("/cadastro_autor", CadastrarAutor);
route.get("/mostrar_todos_autores", MostrarTodosAutores);
route.post("/mostrar_autor_nome", MostrarAutorpeloNome);
route.get("/mostrar_autor/:id", MostrarAutorID);
route.patch("/editar_autor", EditarAutor);
route.delete("/excluir_autor/:id", ExcluirAutor);

route.post("/cadastro_homenageado", CadastrarHomenageado)
route.get("/mostrar_todos_homenageados", MostrarTodosHomenageados)
route.post("/mostrar_homenageado_nome", MostrarHomenageadopeloNome)
route.get("/mostrar_homenageado/:id", MostrarHomenageadoID)
route.patch("/editar_autor", EditarHomenageado)
route.delete("excluir_homenageado/:id", ExcluirHomenageado)

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
route.post("/mostrar_assunto_nome", MostrarAssuntopeloNome);
route.get("/mostrar_assuntoid/:id", MostrarAssuntosID);
route.post("/cadastrar_assunto", CadastrarAssunto);
route.delete("/deletar_assunto/:id_assunto", ExcluirAssunto);
route.patch("/editar_assunto", EditarAssunto);

// link
route.get("/mostrar_linkid/:id", MostrarLinkID);
route.get("/msotrar_todos_links", MostrarTodoslinks);
route.post("/cadastrar_link", CadastrarLink);


// img
route.get("/mostrar_imgid/:id", MostrarImgID);
route.get("/msotrar_todos_imgs", MostrarTodosimg);
route.post("/cadastrar_img", CadastrarImagem);

// homenagem
route.get("/mostrar_homenagens", MostrarTodasHomenagens);
route.get("/mostrar_homenagem/:id", MostrarHomenagemPeloID);
route.get("/mostrar_homenagens_aleatorio", MostrarHomenagensAleatorio);
route.post("mostrar_homenagem_nome", MostrarPeloNomeHomenagem);
route.get("/mostrar_homenagens_antigas", HomenagensMaisAntigas);
route.get("/mostrar_homenagens_recentes", HomenagensMaisRecentes);
route.get("/mostrar_homenagens_capistrano", MostrarTodasHomenagensCapistrano)
route.get("/mostrar_outras_homenagens", MostrarTodasHomenagensOutrosHomenageados);
route.get("/mostrar_homenagens_ordem_alfabetica", HomenagensOrdemAlfabetica);
route.get("/mostrar_homenagens_criadas_antigas", HomenagensCriadasMaisAntigas);
route.get("/mostrar_homenagens_criadas_recentes", HomenagensCriadasMaisRecentes);
route.post("/pesquisar_nome_homenageado", MostrarPeloNomeHomenageado);
route.post("/pesquisar_nome_usuario", MostrarHomenagensPeloNomeUsuario);
route.post("/mostrar_todas_homenagens_assunto", MostrarTodasHomenagensPorAssunto);
route.get("/mostrar_obras_id_homenageado/:id_homenageado", MostrarHomenagensPeloIDHomenageado);
route.get("/mostrar_homenagens_id_usuario/:id_usuario", MostrarHomenagemPeloIDUsuario);
route.get(
  "/mostrar_homenagens_com_nome_e_id_usuario",
  MostrarHomenagensComNomeEIdUsuario
);

route.post("/cadastrar_homenagem", CadastrarHomenagem);
route.delete("/deletar_homenagem/:id", ExcluirHomenagem);
route.patch("/editar_homenagem", EditarHomenagem);



export default route;
