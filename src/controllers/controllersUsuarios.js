import pool from "../database/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  primeiraLetraMaiuscula,
  capitalizarEPontuar,
} from "./controllersGerais.js";

// funções para mostrar (get)
const MostrarTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await pool.query("SELECT nome FROM usuario");

    if (usuarios.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Não há usuários cadastrados.", status: 400 });
    }

    res.status(200).json(usuarios.rows);
  } catch (erro) {
    res.status(500).json({ mensagem: erro.message });
  }
};

// autor que cada usuario cadastrou
const AutorCadaUsuario = async (req, res) => {
  const { nome } = req.body;
  try {
    autores = await pool.query(`SELECT 
    au.id_autor, au.nome as autores
FROM 
    obra o
INNER JOIN 
    obras_autores oa ON o.id_obra = oa.id_obra
INNER JOIN 
    autor au ON au.id_autor = oa.id_autor
INNER JOIN 
    usuario u ON u.id_usuario = o.id_usuario
WHERE 
    u.nome ILIKE '%' || '${nome}' || '%'
GROUP BY 
    au.id_autor, au.nome
ORDER BY 
    au.id_autor`);
    if (autores.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Não há autores cadastrados.", status: 400 });
    }

    res.status(200).json(autores.rows);
  } catch (erro) {
    res.status(500).json({ mensagem: erro.message });
  }
};

const EncontrarUsuarioId = async (req, res) => {
  try {
    const Usuario = await pool.query(`SELECT
          nome
      FROM
        usuario
      WHERE
      id_usuario = ${req.params.id};`);

    return res.status(200).json(Usuario.rows[0]);
  } catch (erro) {
    return res.status(500).json({ Mensagem: erro.Mensagem });
  }
};



// funções para cadastro (post)
const CadastrarUsuario = async (req, res) => {
  try {
    const { nome, senha, confirmSenha } = req.body;

    if (!nome || !senha || !confirmSenha) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    } else {
      const novoUsuario = primeiraLetraMaiuscula(nome);
      const novaSenha = senha.trim();
      const novaConfirmSenha = confirmSenha.trim();

      if (novaSenha.length < 6) {
        return res.status(200).json({
          Mensagem: "A senha precisa ter no minimo 6 caracteres.",
          status: 400,
        });
      } else {
        if (novaSenha != novaConfirmSenha) {
          return res
            .status(200)
            .json({ Mensagem: "As senha estão diferentes.", status: 400 });
        } else {
          const verificaUsuarioExiste = await pool.query(
            "SELECT * FROM usuario WHERE nome = $1",
            [novoUsuario]
          );
          if (verificaUsuarioExiste.rows.length > 0) {
            return res
              .status(200)
              .json({ Mensagem: "Usuário já existe", status: 400 });
          } else {
            const senhaCriptografada = await bcrypt.hash(novaSenha, 10);

            const CadastroUsuario = await pool.query(
              "INSERT INTO usuario (nome, senha) VALUES ($1, $2)",
              [novoUsuario, senhaCriptografada]
            );
            if (!CadastroUsuario) {
              res
                .status(200)
                .json({ Mensagem: "Erro na criação do usuario.", status: 400 });
            } else {
              res.status(201).json({
                user: {
                  nome: CadastroUsuario.nome,
                },
                Mensagem: "Usuario cadastrada com sucesso.",
              });
            }
          }
        }
      }
    }
  } catch (erro) {
    res.status(500).json({ Mensagem: erro.Mensagem });
  }
};

const Login = async (req, res) => {
  try {
    const { nome, senha } = req.body;

    if (!nome || !senha) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    const novoUsuario = primeiraLetraMaiuscula(nome);
    const novaSenha = senha.trim();

    const verificaUsuario = await pool.query(
      "SELECT * FROM usuario WHERE nome = $1",
      [novoUsuario]
    );
    const senhaValida = bcrypt.compareSync(
      novaSenha,
      verificaUsuario.rows[0].senha
    );

    if (!senhaValida) {
      return res
        .status(200)
        .json({ Mensagem: "Usuário ou senha incorretos.", status: 400 });
    }

    const usuarioId = verificaUsuario.rows[0].id_usuario;
    const usuarioSenha = verificaUsuario.rows[0].senha;

    const token = jwt.sign(
      { usuario: verificaUsuario.rows[0].nome },
      "802c6ed36c616ef9df379ef94c380f",
      { expiresIn: 86400 }
    );

    console.log('passei no token')

    const verificaUsuarioAdm = await pool.query(
      `SELECT u.id_usuario, u.nome 
        FROM usuario u 
        inner join administrador a on a.id_usuario = u.id_usuario
        where a.id_usuario = $1`,
      [usuarioId]
    );

    if (verificaUsuarioAdm.rows.length > 0) {
      res.cookie("token", token, { httpOnly: true });
      res
        .status(200)
        .json({
          token,
          usuarioId,
          novoUsuario,
          usuarioSenha,
          tipoUsuario: admin,
        });
    }

    res.cookie("token", token, { httpOnly: true });

    res
      .status(200)
      .json({ token, usuarioId, novoUsuario, usuarioSenha, tipoUsuario: "user" });

  } catch (erro) {
      return res.status(500).json({ Mensagem: erro.Mensagem });
    
  }
};

// funções para excluir (path)
const removeUsuarioID = async (req, res) => {
  try {
    const { id_usuario } = req.params;

    const verificaUsuarioTemObra = await pool.query(
      "SELECT id_usuario FROM obra WHERE id_usuario = $1",
      [id_usuario]
    );

    if (verificaUsuarioTemObra.rows.length === 0) {
      await pool.query("Delete from usuario where id_usuario = $1", [
        id_usuario,
      ]);

      res.status(200).json({ Mensagem: "Usuario excluido com sucesso." });
    } else {
      return res
        .status(200)
        .json({ Message: "O usuário tem obras!", status: 400 });
    }

    return res.status(200).json({ Mensagem: "Usuário excluido com sucesso." });
  } catch (erro) {
    res.status(500).json({ Mensagem: erro.Mensagem });
  }
};

export {
  MostrarTodosUsuarios,
  AutorCadaUsuario,
  EncontrarUsuarioId,
  CadastrarUsuario,
  Login,
  removeUsuarioID,
};
