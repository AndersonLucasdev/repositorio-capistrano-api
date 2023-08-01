import pool from "../database/db.js";
import { primeiraLetraMaiuscula } from "./controllersGerais.js";

const MostrarTodosAutores = async (req, res) => {
  try {
    const Autores = await pool.query(`
    SELECT 
    *
    FROM autor
    
    order by id_autor
        `);

    if (Autores.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Obra(s) não encontrado(s)", status: 400 });
    }
    return res.status(200).json(Autores.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarAutorID = async (req, res) => {
  try {
    const autor = await pool.query(`SELECT 
        *
        FROM autor
        where id_autor =  ${req.params.id}
        `);

    res.status(200).json(autor.rows[0]);
  } catch (erro) {
    return res.status(500).json({ Message: erro.Message });
  }
};

const CadastrarAutor = async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    const nomeFormatado = primeiraLetraMaiuscula(nome);

    const CadastroAutor = await pool.query(
      `INSERT INTO autor (
          nome
        ) VALUES ($1)`,
      [nomeFormatado]
    );

    return res.status(200).json({ Mensagem: "Autor cadastrada com sucesso." });
  } catch (erro) {
    return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor." });
  }
};

const ExcluirAutor = async (req, res) => {
  const { id_autor } = req;

    if (!id_autor) {
      return res
        .status(200)
        .json({ Mensagem: "Id não informado.", status: 400 });
    }

    const verficaAutorEmObra = await pool.query(`
    select * from obras_autores where id_autor = $1`, [id_autor])
    
    if (verficaAutorEmObra.rows.length === 0) {
      return res
        .status(200)
        .json({ Mensagem: "O autor possui obras.", status: 400 });
    }

    await pool.query(`DELETE FROM obra_autores WHERE id_autor = ${id_autor}`);

    await pool.query(`DELTE FROM autor where id_autor = ${id_autor}`)
    return res
    .status(200)
    .json({ Mensagem: "Autor excluído com sucesso."});
}

export {
  MostrarTodosAutores, MostrarAutorID, CadastrarAutor
}