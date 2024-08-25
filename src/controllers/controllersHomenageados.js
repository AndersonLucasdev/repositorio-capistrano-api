import { primeiraLetraMaiuscula } from "./controllersGerais.js";
import pool from "../database/db.js";

const MostrarTodosHomenageados = async (req, res) => {
  try {
    const Autores = await pool.query(`
    SELECT 
    *
    FROM homenageado
        `);

    if (Autores.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Homenageado(s) não encontrado(s)", status: 400 });
    }
    return res.status(200).json(Autores.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarHomenageadopeloNome = async (req, res) => {
  try {
    const { nome } = req.body;
    const autor = await pool.query(`
        SELECT 
        *
    FROM homenageado h
    WHERE 
    h.nome ILIKE '%' || '${nome}' || '%'
    `);

    if (autor.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Homenageado não encontrado", status: 400 });
    }

    return res.status(200).json(autor.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarHomenageadoID = async (req, res) => {
  try {
    const autor = await pool.query(`SELECT 
        *
        FROM homenageado
        where id_homenageado =  ${req.params.id}
        `);

    res.status(200).json(autor.rows[0]);
  } catch (erro) {
    return res.status(500).json({ Message: erro.Message });
  }
};

const CadastrarHomenageado = async (req, res) => {
  try {
    const { nome } = req.body;

    if (!nome) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    const nomeFormatado = primeiraLetraMaiuscula(nome);

    const CadastroHomenageado = await pool.query(
      `INSERT INTO homenageado (
          nome
        ) VALUES ($1)`,
      [nomeFormatado]
    );

    return res.status(200).json({ Mensagem: "Homenageado cadastrada com sucesso." });
  } catch (erro) {
    return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor." });
  }
};

const ExcluirHomenageado = async (req, res) => {
  const { id_homenageado } = req.params;

  if (!id_homenageado) {
    return res.status(200).json({ Mensagem: "Id não informado.", status: 400 });
  }

  const verficaHomenageadoEmObra = await pool.query(
    `
    select * from homenagens_homenageados where id_homenageado = $1`,
    [id_homenageado]
  );

  if (verficaHomenageadoEmObra.rows.length === 0) {
    return res
      .status(200)
      .json({ Mensagem: "O Homenageado possui Homenagens.", status: 400 });
  }

  await pool.query(`DELETE FROM homenagens_homenageados WHERE id_homenageado = ${id_homenageado}`);

  await pool.query(`DELETE FROM homenageado where id_homenageado = ${id_homenageado}`);
  return res.status(200).json({ Mensagem: "Homenageado excluído com sucesso." });
};

const EditarHomenageado = async (req, res) => {
  const { nome_antigo, novo_nome } = req.body;
  try {
    if (!nome_antigo && novo_nome) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    const nomeFormatado = primeiraLetraMaiuscula(nome_antigo);

    let id_homenageado;
    const verificaHomenageado = await pool.query(
      "Select * from homenageado WHERE nome = $1",
      [nomeFormatado]
    );

    id_homenageado = verificaHomenageado.rows[0].id_homenageado;
    res.status(200).json(verificaHomenageado.rows[0]);

    const tratamentoNovoNome = primeiraLetraMaiuscula(novo_nome);

    await pool.query("UPDATE homenageado SET nome = $1 WHERE id_homenageado = $2", [
      tratamentoNovoNome,
      id_homenageado,
    ]);

    return res.status(200).json({ Mensagem: "Homenageado editada com sucesso." });
  } catch (erro) {
    return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor." });
  }
};
export {
MostrarTodosHomenageados,
MostrarHomenageadopeloNome,
MostrarHomenageadoID,
CadastrarHomenageado,
ExcluirHomenageado,
EditarHomenageado,
};
