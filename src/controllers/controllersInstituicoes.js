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

    return res
      .status(200)
      .json({ Mensagem: "Instituição cadastrada com sucesso." });
  } catch (erro) {
    return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor." });
  }
};

const ExcluirInstituicao = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(200).json({ Mensagem: "Id não informado.", status: 400 });
  }

  const verficaInstituicaoEmHomenagem = await pool.query(
    `
    select * from homenagem_instituicao where id_instituicao = $1`,
    [id]
  );

  if (verficaInstituicaoEmHomenagem.rows.length === 0) {
    return res
      .status(200)
      .json({ Mensagem: "A instituição possui homenagens.", status: 400 });
  }

  await pool.query(
    `DELETE FROM homenagem_instituicao WHERE id_instituicao = ${id}`
  );

  await pool.query(`DELETE FROM instituicao where id_instituicao = ${id}`);
  return res
    .status(200)
    .json({ Mensagem: "Instituição excluído com sucesso." });
};

const EditarInstituicao = async (req, res) => {
  const { nome_antigo, novo_nome } = req.body;
  try {
    if (!nome_antigo && novo_nome) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    const nomeFormatado = primeiraLetraMaiuscula(nome_antigo);

    let id_instituicao;
    const verificaInstituicao = await pool.query(
      "Select * from instituicao WHERE nome = $1",
      [nomeFormatado]
    );

    id_instituicao = verificaInstituicao.rows[0].id_instituicao;
    res.status(200).json(verificaInstituicao.rows[0]);

    const tratamentoNovoNome = primeiraLetraMaiuscula(novo_nome);

    await pool.query("UPDATE instituicao SET nome = $1 WHERE id_instituicao = $2", [
      tratamentoNovoNome,
      id_instituicao,
    ]);

    return res
      .status(200)
      .json({ Mensagem: "Instituição editada com sucesso." });
  } catch (erro) {
    return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor." });
  }
};

export {
  MostrarInstituicaoID,
  MostrarTodasInstituicoes,
  CadastrarInstituicao,
  EditarInstituicao,
  ExcluirInstituicao,
};
