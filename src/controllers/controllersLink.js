import pool from "../database/db.js";
import { primeiraLetraMaiuscula } from "./controllersGerais.js";

const MostrarTodoslinks = async (req, res) => {
  try {
    const links = await pool.query(`
    SELECT 
    *
    FROM link
        `);

    if (links.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Link(s) não encontrado(s)", status: 400 });
    }
    return res.status(200).json(links.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarLinkID = async (req, res) => {
  try {
    const link = await pool.query(`SELECT 
        *
        FROM link
        where id_link =  ${req.params.id}
        `);

    res.status(200).json(link.rows[0]);
  } catch (erro) {
    return res.status(500).json({ Message: erro.Message });
  }
};

const CadastrarLink = async (req, res) => {
  try {
    const { link } = req.body;

    if (!link) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    const linkFormatado = primeiraLetraMaiuscula(link);

    const CadastroLink = await pool.query(
      `INSERT INTO link (
          link
        ) VALUES ($1)`,
      [linkFormatado]
    );

    return res.status(200).json({ Mensagem: "Link cadastrada com sucesso." });
  } catch (erro) {
    return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor." });
  }
};

const ExcluirLink = async (req, res) => {
  const { id_link } = req.params;

  if (!id_link) {
    return res.status(200).json({ Mensagem: "Id não informado.", status: 400 });
  }

  const verficaLinkEmObra = await pool.query(
    `
    select * from obras_links where id_link = $1`,
    [id_link]
  );

  if (verficaLinkEmObra.rows.length === 0) {
    return res
      .status(200)
      .json({ Mensagem: "O link possui obras.", status: 400 });
  }

  await pool.query(`DELETE FROM obra_links WHERE id_link = ${id_link}`);

  await pool.query(`DELETE FROM link where id_link = ${id_link}`);
  return res.status(200).json({ Mensagem: "Link excluído com sucesso." });
};

const EditarLink = async (req, res) => {
  const { link_antiga, link_nova } = req.body;
  try {
    if (!link_antiga && link_nova) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    const linkFormatada = link_antiga.trim()

    let id_link;
    const verificaLink = await pool.query(
      "Select * from link WHERE link = $1",
      [linkFormatada]
    );

    id_link = verificaLink.rows[0].id_link;
    res.status(200).json(verificaLink.rows[0]);

    const tratamentoNovoNome = link_nova.trim()

    await pool.query("UPDATE link SET link = $1 WHERE id_link = $2", [
      tratamentoNovoNome,
      id_link,
    ]);

    return res.status(200).json({ Mensagem: "Link editado com sucesso." });
  } catch (erro) {
    return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor." });
  }
};
export { MostrarLinkID, MostrarTodoslinks, CadastrarLink, ExcluirLink, EditarLink };
