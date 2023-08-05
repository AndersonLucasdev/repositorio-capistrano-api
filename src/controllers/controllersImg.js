import pool from "../database/db.js";
import { primeiraLetraMaiuscula } from "./controllersGerais.js";

const MostrarTodosimg = async (req, res) => {
  try {
    const imagens = await pool.query(`
    SELECT 
    *
    FROM img
    
    order by id_img
        `);

    if (imagens.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Imagen(s) não encontrado(s)", status: 400 });
    }
    return res.status(200).json(imagens.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarImgID = async (req, res) => {
  try {
    const img = await pool.query(`SELECT 
        *
        FROM img
        where id_img =  ${req.params.id}
        `);

    res.status(200).json(img.rows[0]);
  } catch (erro) {
    return res.status(500).json({ Message: erro.Message });
  }
};

const CadastrarImagem = async (req, res) => {
  try {
    const { link } = req.body;

    if (!link) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    const linkFormatado = primeiraLetraMaiuscula(link);

    const CadastroImg = await pool.query(
      `INSERT INTO img (
          link
        ) VALUES ($1)`,
      [linkFormatado]
    );

    return res.status(200).json({ Mensagem: "Imagem cadastrada com sucesso." });
  } catch (erro) {
    return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor." });
  }
};

const ExcluirImg = async (req, res) => {
  const { id_img } = req;

  if (!id_img) {
    return res.status(200).json({ Mensagem: "Id não informado.", status: 400 });
  }

  const verficaImgEmObra = await pool.query(
    `
    select * from obras_imgs where id_img = $1`,
    [id_img]
  );

  if (verficaImgEmObra.rows.length === 0) {
    return res
      .status(200)
      .json({ Mensagem: "A imagem possui obras.", status: 400 });
  }

  await pool.query(`DELETE FROM obra_imgs WHERE id_img = ${id_link}`);

  await pool.query(`DELTE FROM img where id_img = ${id_img}`);
  return res.status(200).json({ Mensagem: "Imagem excluído com sucesso." });
};

const EditarImg = async (req, res) => {
  const { img_antiga, img_nova } = req.body;
  try {
    if (!img_antiga && img_nova) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    const imgFormatada = img_antiga.trim()

    let id_img;
    const verificaImg = await pool.query(
      "Select * from img WHERE link = $1",
      [imgFormatada]
    );

    id_img = verificaImg.rows[0].id_img;
    res.status(200).json(verificaImg.rows[0]);

    const tratamentoNovoNome = primeiraLetraMaiuscula(img_nova);

    await pool.query("UPDATE img SET link = $1 WHERE id_img = $2", [
      tratamentoNovoNome,
      id_img,
    ]);

    return res.status(200).json({ Mensagem: "Imagem editada com sucesso." });
  } catch (erro) {
    return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor." });
  }
};
export { MostrarImgID, MostrarTodosimg, CadastrarImagem, ExcluirImg, EditarImg };
