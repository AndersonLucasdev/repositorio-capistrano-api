import pool from "../database/db.js";
import { primeiraLetraMaiuscula } from "./controllersGerais.js";

const MostrarTodasInstituicoes = async (req, res) => {
  try {
    const instituicoes = await pool.query(`
    SELECT 
    *
    FROM instituicao
    `);

    if (instituicoes.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Instituições não encontrada(s)", status: 400 });
    }
    return res.status(200).json(instituicoes.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarInstituicaoID = async (req, res) => {
  try {
    const instituicao = await pool.query(`SELECT 
        *
        FROM instituicoes
        where id_instituicao =  ${req.params.id}
        `);

    res.status(200).json(instituicao.rows[0]);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const CadastrarInstituicao = async (req, res) => {
    try {
        const { nome } = req.body;

    if (!nome) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    const nomeFormatado = primeiraLetraMaiuscula(nome);

    const CadastroInstituicao = await pool.query(
      `INSERT INTO instituicao (
          nome
        ) VALUES ($1)`,
      [nomeFormatado]
    );

    return res.status(200).json({ Mensagem: "Instituição cadastrada com sucesso." });
    } catch (erro) {
        return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor." });
    }
}