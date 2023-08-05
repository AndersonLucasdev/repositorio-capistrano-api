import pool from "../database/db.js";
import { primeiraLetraMaiuscula } from "./controllersGerais.js";

const MostrarTodosAssuntos = async (req, res) => {
  try {
    const Assuntos = await pool.query(`
    SELECT 
    *
    FROM assunto
    
    order by id_assunto
        `);

    if (Assuntos.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Assunto(s) não encontrado(s)", status: 400 });
    }
    return res.status(200).json(Assuntos.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarAssuntosID = async (req, res) => {
  try {
    const assunto = await pool.query(`SELECT 
        *
        FROM assunto
        where id_assunto =  ${req.params.id}
        `);

    res.status(200).json(assunto.rows[0]);
  } catch (erro) {
    return res.status(500).json({ Message: erro.Message });
  }
};

const CadastrarAssunto = async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    const nomeFormatado = primeiraLetraMaiuscula(nome);

    const CadastroAssunto = await pool.query(
      `INSERT INTO assunto (
          nome
        ) VALUES ($1)`,
      [nomeFormatado]
    );

    return res
      .status(200)
      .json({ Mensagem: "Assunto cadastrada com sucesso." });
  } catch (erro) {
    return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor." });
  }
};

const ExcluirAssunto = async (req, res) => {
  const { id_assunto } = req.params;

  if (!id_assunto) {
    return res.status(200).json({ Mensagem: "Id não informado.", status: 400 });
  }

  const verficaAssuntoEmObra = await pool.query(
    `
    select * from obras_assuntos where id_assunto = $1`,
    [id_assunto]
  );

  if (verficaAssuntoEmObra.rows.length === 0) {
    return res
      .status(200)
      .json({ Mensagem: "O assunto possui obras.", status: 400 });
  }

  await pool.query(
    `DELETE FROM obra_assuntos WHERE id_assunto = ${id_assunto}`
  );

  await pool.query(`DELETE FROM assunto where id_assunto = ${id_assunto}`);
  return res.status(200).json({ Mensagem: "Assunto excluído com sucesso." });
};

const EditarAssunto = async (req, res) => {
  const { nome_antigo, novo_nome } = req.body;
  try {
    if (!nome_antigo && novo_nome) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    const nomeFormatado = novo_nome.primeiraLetraMaiuscula(novo_nome);

    let id_assunto;
    const verificaAssunto = await pool.query(
      "Select * from assunto WHERE nome = $1",
      [nomeFormatado]
    );

    id_assunto = verificaAssunto.rows[0].id_assunto;
    res.status(200).json(verificaAssunto.rows[0]);

    const tratamentoNovoNome = primeiraLetraMaiuscula(novo_nome);

    await pool.query("UPDATE assunto SET nome = $1 WHERE id_assunto = $2", [
      tratamentoNovoNome,
      id_assunto,
    ]);

    return res.status(200).json({ Mensagem: "Assunto editada com sucesso." });
  } catch (erro) {
    return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor." });
  }
};

export {
  MostrarTodosAssuntos,
  MostrarAssuntosID,
  CadastrarAssunto,
  ExcluirAssunto,
  EditarAssunto
};
