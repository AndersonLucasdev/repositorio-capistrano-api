import pool from "../database/db.js";
import { primeiraLetraMaiuscula } from "./controllersGerais.js";

const MostrarTodasHomenagens = async (req, res) => {
  try {
    const homenagens = await pool.query(`
      SELECT DISTINCT
      h.id_homenagem, 
      h.titulo, 
      h.data_publi, 
      h.data_criacao, 
      h.resumo, 
      u.nome as usuario, 
      string_agg(DISTINCT li.link, ', ') as links, 
      string_agg(DISTINCT im.link, ', ') as imgs, 
      string_agg(DISTINCT ass.nome, ', ') as assuntos, 
      string_agg(DISTINCT ins.nome, ', ') as instituicoes
  FROM homenagem h
  INNER JOIN homenagens_instituicoes hi ON h.id_homenagem = hi.id_homenagem
  INNER JOIN instituicao ins ON ins.id_instituicao = hi.id_instituicao
  INNER JOIN usuario u ON u.id_usuario = h.id_usuario
  INNER JOIN homenagens_assuntos has ON has.id_homenagem = h.id_homenagem
  INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
  INNER JOIN homenagens_links hl ON hl.id_homenagem = h.id_homenagem
  INNER JOIN link li ON li.id_link = hl.id_link
  INNER JOIN homenagens_imgs hi ON hi.id_homenagem = h.id_homenagem
  INNER JOIN img im ON im.id_img = hi.id_img
  GROUP BY h.id_homenagem, u.nome, h.titulo, h.data_publi, h.data_criacao, h.resumo;
  `);

    if (homenagens.rows.length === 0) {
      res
        .status(200)
        .json({ Mensagem: "Não há homenagen(s) cadastrada(s).", status: 400 });
    }

    res.status(200).json(homenagens.rows);
  } catch (erro) {
    return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor." });
  }
};

const MostrarHomenagensComNomeEIdUsuario = async (req, res) => {
  const { titulo, id_usuario } = req.body;

  try {
    const homenagem = await pool.query(`
        SELECT 
        h.id_homenagem, h.titulo, h.data_publi, h.data_criacao, h.resumo, u.nome as usuario, 
        string_agg(DISTINCT li.link, ', ') as links, 
        string_agg(DISTINCT im.link, ', ') as imgs,
        string_agg(DISTINCT ass.nome, ', ') as assuntos, 
        string_agg(DISTINCT ins.nome, ', ') as instituicoes
    FROM 
        homenagem h
    INNER JOIN 
        homenagens_instituicoes hi ON h.id_homenagem = hi.id_homenagem
    INNER JOIN 
        instituicao ins ON ins.id_instituicao = hi.id_instituicao
    INNER JOIN 
        usuario u ON u.id_usuario = h.id_usuario
    INNER JOIN homenagens_assuntos has ON h.id_homenagem = has.id_homenagem
    INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
    INNER JOIN homenagens_links hl ON hl.id_homenagem = h.id_homenagem
    INNER JOIN link li ON li.id_link = hl.id_link
    INNER JOIN homenagens_imgs hi ON hi.id_homenagem = h.id_homenagem
    INNER JOIN img im ON im.id_img = hi.id_img
    WHERE 
        h.titulo ILIKE '%' || '${titulo}' || '%'
        AND h.id_usuario = ${id_usuario}
    GROUP BY 
        h.id_homenagem, h.titulo, h.resumo, u.nome, h.data_publi, ass.nome, li.link, im.link, h.data_criacao, ins.nome
    ORDER BY 
        h.id_homenagem;

    `);

    if (homenagem.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Homenagem(s) não encontrada(s)", status: 400 });
    }

    return res.status(200).json(homenagem.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarHomenagensAleatorio = async (req, res) => {
  try {
    const homenagens = await pool.query(`
    SELECT  
    sub.id_homenagem, sub.titulo, sub.data_publi, sub.data_criacao, sub.resumo, sub.usuario, 
    string_agg(sub.links, ', ') as links, 
    string_agg(sub.imgs, ', ') as imgs, 
    string_agg(sub.assuntos, ', ') as assuntos, 
    string_agg(sub.instituicoes, ', ') as instituicoes
FROM (
    SELECT DISTINCT
        h.id_homenagem, 
        h.titulo, 
        h.data_publi, 
        h.data_criacao, 
        h.resumo, 
        u.nome as usuario, 
        li.link as links, 
        im.link as imgs, 
        ass.nome as assuntos, 
        ins.nome as instituicoes
    FROM homenagem h
    INNER JOIN homenagens_instituicoes hi ON h.id_homenagem = hi.id_homenagem
    INNER JOIN instituicao ins ON ins.id_instituicao = hi.id_instituicao
    INNER JOIN usuario u ON u.id_usuario = h.id_usuario
    INNER JOIN homenagens_assuntos has ON has.id_homenagem = h.id_homenagem
    INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
    INNER JOIN homenagens_links hl ON hl.id_homenagem = h.id_homenagem
    INNER JOIN link li ON li.id_link = hl.id_link
    INNER JOIN homenagens_imgs hi ON hi.id_homenagem = h.id_homenagem
    INNER JOIN img im ON im.id_img = hi.id_img
) as sub
GROUP BY sub.id_homenagem, sub.usuario, sub.titulo, sub.data_publi, sub.resumo, sub.data_criacao
ORDER BY RANDOM();
          `);

    if (homenagens.rows.length === 0) {
      res
        .status(200)
        .json({ Mensagem: "Não há homenagen(s) cadastrada(s).", status: 400 });
    }

    res.status(200).json(homenagens.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarHomenagemPeloID = async (req, res) => {
  const { id } = req.params;
  try {
    const Homenagem = await pool.query(`
    SELECT 
    h.titulo,
    h.data_publi,
    h.data_criacao,
    h.resumo,
    u.nome as usuario,
    u.id_usuario,
    string_agg(DISTINCT li.link, ', ') as links,
    string_agg(DISTINCT im.link, ', ') as imgs,
    string_agg(DISTINCT ass.nome, ', ') as assuntos,
    string_agg(DISTINCT ins.nome, ', ') as instituicoes,
    h.descricao
FROM 
    homenagem h
INNER JOIN 
    homenagens_instituicoes hi ON h.id_homenagem = hi.id_homenagem
INNER JOIN 
    instituicao ins ON ins.id_instituicao = hi.id_instituicao
INNER JOIN 
    usuario u ON u.id_usuario = h.id_usuario
INNER JOIN homenagens_assuntos has ON h.id_homenagem = has.id_homenagem
INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
INNER JOIN homenagens_links hl ON h.id_homenagem = hl.id_homenagem -- Join with homenagens_links
INNER JOIN link li ON hl.id_link = li.id_link -- Join with link
INNER JOIN homenagens_imgs hi ON hi.id_homenagem = h.id_homenagem
INNER JOIN img im ON im.id_img = hi.id_img
WHERE 
    h.id_homenagem = ${id}
GROUP BY 
    h.titulo,
    h.data_publi,
    h.data_criacao,
    h.resumo,
    u.nome,
    u.id_usuario,
    h.descricao;
    ;`);

    res.status(200).json(Homenagem.rows[0]);
  } catch (erro) {
    return res.status(500).json({ Message: erro.Message });
  }
};

const MostrarTodasHomenagensPorAssunto = async (req, res) => {
  const { assunto } = req.body;

  try {
    if (!assunto) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    const homenagens = await pool.query(
      `
        SELECT DISTINCT
        h.id_homenagem, 
        h.titulo, 
        h.data_publi, 
        h.data_criacao, 
        h.resumo, 
        u.nome as usuario, 
        string_agg(DISTINCT li.link, ', ') as links, 
        string_agg(DISTINCT im.link, ', ') as imgs, 
        string_agg(DISTINCT ass.nome, ', ') as assuntos, 
        string_agg(DISTINCT ins.nome, ', ') as instituicoes
    FROM homenagem h
    INNER JOIN homenagens_instituicoes hi ON h.id_homenagem = hi.id_homenagem
    INNER JOIN instituicao ins ON ins.id_instituicao = hi.id_instituicao
    INNER JOIN usuario u ON u.id_usuario = h.id_usuario
    INNER JOIN homenagens_assuntos has ON has.id_homenagem = h.id_homenagem
    INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
    INNER JOIN homenagens_links hl ON hl.id_homenagem = h.id_homenagem
    INNER JOIN link li ON li.id_link = hl.id_link
    INNER JOIN homenagens_imgs hi ON hi.id_homenagem = h.id_homenagem
    INNER JOIN img im ON im.id_img = hi.id_img
    WHERE 
    ass.nome ILIKE '%' || '${assunto}' || '%'
    GROUP BY 
    h.id_homenagem, 
    h.titulo, 
    h.resumo, 
    u.nome, 
    h.data_publi, 
    ass.nome, 
    li.link, 
    im.link, 
    h.data_criacao, 
    ins.nome;
      `
    );

    if (homenagens.rows.length === 0) {
      return res
        .status(200)
        .json({ Mensagem: "Homenagem(s) não encontrada(s).", status: 400 });
    }

    return res.status(200).json(homenagens.rows);
  } catch (erro) {
    return res.status(500).json({ Mensagem: erro.Mensagem });
  }
};

const HomenagensOrdemAlfabetica = async (req, res) => {
  try {
    const homenagens = await pool.query(`
        SELECT DISTINCT ON (o.id_homenagem)
        o.id_homenagem, 
        o.titulo, 
        o.data_criacao, 
        o.data_publi, 
        o.resumo, 
        u.nome as usuario, 
        string_agg(DISTINCT li.link, ', ') as links, 
        string_agg(DISTINCT im.link, ', ') as imgs,
        string_agg(DISTINCT ass.nome, ', ') as assuntos,
        string_agg(DISTINCT ins.nome, ', ') as instituicoes
    FROM homenagem o
    INNER JOIN homenagens_instituicoes hi ON o.id_homenagem = hi.id_homenagem
    INNER JOIN instituicao ins ON ins.id_instituicao = hi.id_instituicao
    INNER JOIN usuario u ON u.id_usuario = o.id_usuario
    INNER JOIN homenagens_assuntos has ON o.id_homenagem = has.id_homenagem
    INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
    INNER JOIN homenagens_links hl ON hl.id_homenagem = o.id_homenagem
    INNER JOIN link li ON li.id_link = hl.id_link
    INNER JOIN homenagens_imgs hi2 ON hi2.id_homenagem = o.id_homenagem
    INNER JOIN img im ON im.id_img = hi2.id_img
    WHERE o.data_publi IS NOT NULL
    GROUP BY o.id_homenagem, o.titulo, o.resumo, u.nome, o.data_criacao, o.data_publi, ass.nome, ins.nome
    ORDER BY o.id_homenagem, o.titulo;
    `);
    if (homenagens.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Homenagem(ns) não encontrada(s)", status: 400 });
    }

    return res.status(200).json(homenagens.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const HomenagensMaisRecentes = async (req, res) => {
  try {
    const homenagens = await pool.query(`
    SELECT 
    sub.id_homenagem, sub.titulo, sub.data_criacao, sub.data_publi, sub.resumo, sub.usuario, 
    string_agg(DISTINCT sub.links, ', ') as links, 
    string_agg(DISTINCT sub.imgs, ', ') as imgs,
    string_agg(DISTINCT sub.assuntos, ', ') as assuntos, 
    string_agg(DISTINCT sub.instituicoes, ', ') as instituicoes
FROM (
    SELECT 
        o.id_homenagem, o.titulo, o.data_criacao, o.data_publi, o.resumo, u.nome as usuario, 
        li.link as links, 
        im.link as imgs,
        ass.nome as assuntos, 
        ins.nome as instituicoes
    FROM homenagem o
    INNER JOIN homenagens_instituicoes hi ON o.id_homenagem = hi.id_homenagem
    INNER JOIN instituicao ins ON ins.id_instituicao = hi.id_instituicao
    INNER JOIN usuario u ON u.id_usuario = o.id_usuario
    INNER JOIN homenagens_assuntos has ON o.id_homenagem = has.id_homenagem
    INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
    INNER JOIN homenagens_links hl ON hl.id_homenagem = o.id_homenagem
    INNER JOIN link li ON li.id_link = hl.id_link
    INNER JOIN homenagens_imgs hi2 ON hi2.id_homenagem = o.id_homenagem
    INNER JOIN img im ON im.id_img = hi2.id_img
    GROUP BY 
        o.id_homenagem, o.titulo, o.data_criacao, o.data_publi, o.resumo, u.nome, li.link, im.link, ass.nome, ins.nome
) as sub
GROUP BY 
    sub.id_homenagem, sub.titulo, sub.data_criacao, sub.data_publi, sub.resumo, sub.usuario
ORDER BY 
    sub.data_publi DESC;
  `);
    if (homenagens.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Homenagem(ns) não encontrada(s)", status: 400 });
    }

    return res.status(200).json(homenagens.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const HomenagensMaisAntigas = async (req, res) => {
  try {
    const homenagens = await pool.query(`
      SELECT
      h.id_homenagem,
      h.nome AS nome_homenagem,
      h.data_criacao,
      STRING_AGG(i.nome, ', ') AS instituicoes,
    h.descricao,
    h.img
  FROM
      homenagem h
  INNER JOIN
      homenagem_instituicao hi ON h.id_homenagem = hi.id_homenagem
  INNER JOIN
      instituicao i ON hi.id_instituicao = i.id_instituicao
  GROUP BY
      h.id_homenagem, h.nome, h.data_criacao
        ORDER BY 
        h.data_criacao ASC;
      `);
    if (homenagens.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "homenagen(s) não encontrada(s)", status: 400 });
    }

    return res.status(200).json(homenagens.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const HomenagensCriadasMaisAntigas = async (req, res) => {
  try {
    const homenagens = await pool.query(`
    SELECT 
    id_homenagem, 
    titulo, 
    data_criacao, 
    data_publi, 
    resumo, 
    usuario,
    links, 
    imgs, 
    assuntos, 
    instituicoes
FROM (
    SELECT 
        o.id_homenagem, 
        o.titulo, 
        o.data_criacao, 
        o.data_publi, 
        o.resumo, 
        u.nome as usuario,
        string_agg(DISTINCT li.link, ', ') as links, 
        string_agg(DISTINCT im.link, ', ') as imgs, 
        string_agg(DISTINCT ass.nome, ', ') as assuntos, 
        string_agg(DISTINCT ins.nome, ', ') as instituicoes,
        ROW_NUMBER() OVER (PARTITION BY o.id_homenagem ORDER BY o.data_criacao ASC) AS rn
    FROM 
        homenagem o
    INNER JOIN 
        homenagens_instituicoes hi ON o.id_homenagem = hi.id_homenagem
    INNER JOIN 
        instituicao ins ON ins.id_instituicao = hi.id_instituicao
    INNER JOIN 
        usuario u ON u.id_usuario = o.id_usuario
    INNER JOIN homenagens_assuntos has ON o.id_homenagem = has.id_homenagem
    INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
    INNER JOIN homenagens_links hl ON hl.id_homenagem = o.id_homenagem
    INNER JOIN link li ON li.id_link = hl.id_link
    INNER JOIN homenagens_imgs hi2 ON hi2.id_homenagem = o.id_homenagem
    INNER JOIN img im ON im.id_img = hi2.id_img
    WHERE 
        o.data_criacao IS NOT NULL
    GROUP BY 
        o.id_homenagem, o.titulo, o.resumo, u.nome, o.data_criacao, o.data_publi
) AS ranked
WHERE rn = 1
ORDER BY data_criacao ASC;
    `);
    if (homenagens.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Homenagem(ns) não encontrada(s)", status: 400 });
    }

    return res.status(200).json(homenagens.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const HomenagensCriadasMaisRecentes = async (req, res) => {
  try {
    const homenagens = await pool.query(`
    SELECT 
    sub.id_homenagem, sub.titulo, sub.data_criacao, sub.data_publi, sub.resumo, sub.usuario, 
    string_agg(DISTINCT sub.links, ', ') as links, 
    string_agg(DISTINCT sub.imgs, ', ') as imgs, 
    string_agg(DISTINCT sub.assuntos, ', ') as assuntos, 
    string_agg(DISTINCT sub.instituicoes, ', ') as instituicoes
FROM (
    SELECT 
        o.id_homenagem, o.titulo, o.data_criacao, o.data_publi, o.resumo, u.nome as usuario, 
        li.link as links, 
        im.link as imgs,
        ass.nome as assuntos, 
        ins.nome as instituicoes
    FROM homenagem o
    INNER JOIN homenagens_instituicoes hi ON o.id_homenagem = hi.id_homenagem
    INNER JOIN instituicao ins ON ins.id_instituicao = hi.id_instituicao
    INNER JOIN usuario u ON u.id_usuario = o.id_usuario
    INNER JOIN homenagens_assuntos has ON o.id_homenagem = has.id_homenagem
    INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
    INNER JOIN homenagens_links hl ON hl.id_homenagem = o.id_homenagem
    INNER JOIN link li ON li.id_link = hl.id_link
    INNER JOIN homenagens_imgs hi2 ON hi2.id_homenagem = o.id_homenagem
    INNER JOIN img im ON im.id_img = hi2.id_img
    GROUP BY 
        o.id_homenagem, o.titulo, o.data_criacao, o.data_publi, o.resumo, u.nome, li.link, im.link, ass.nome, ins.nome
) as sub
GROUP BY 
    sub.id_homenagem, sub.titulo, sub.data_criacao, sub.data_publi, sub.resumo, sub.usuario
ORDER BY 
    sub.data_criacao DESC;
  `);
    if (homenagens.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Homenagem(ns) não encontrada(s)", status: 400 });
    }

    return res.status(200).json(homenagens.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarPeloNomeHomenagem = async (req, res) => {
  const { titulo } = req.body;

  try {
    const homenagem = await pool.query(`
    SELECT 
    sub.id_homenagem, 
    sub.titulo, 
    sub.data_criacao, 
    sub.data_publi, 
    sub.resumo, 
    sub.usuario, 
    string_agg(DISTINCT sub.links, ', ') as links, 
    string_agg(DISTINCT sub.imgs, ', ') as imgs,
    string_agg(DISTINCT sub.assuntos, ', ') as assuntos, 
    string_agg(DISTINCT sub.instituicoes, ', ') as instituicoes
FROM (
    SELECT 
        h.id_homenagem, 
        h.titulo, 
        h.data_criacao, 
        h.data_publi, 
        h.resumo, 
        u.nome as usuario, 
        li.link as links, 
        im.link as imgs,
        ass.nome as assuntos, 
        inst.nome as instituicoes
    FROM 
        homenagem h
    INNER JOIN 
        homenagens_instituicoes hi ON h.id_homenagem = hi.id_homenagem
    INNER JOIN 
        instituicao inst ON inst.id_instituicao = hi.id_instituicao
    INNER JOIN 
        usuario u ON u.id_usuario = h.id_usuario
    INNER JOIN 
        homenagens_assuntos has ON h.id_homenagem = has.id_homenagem
    INNER JOIN 
        assunto ass ON ass.id_assunto = has.id_assunto
    INNER JOIN 
        homenagens_links hl ON hl.id_homenagem = h.id_homenagem
    INNER JOIN 
        link li ON li.id_link = hl.id_link
    INNER JOIN 
        homenagens_imgs hi2 ON hi2.id_homenagem = h.id_homenagem
    INNER JOIN 
        img im ON im.id_img = hi2.id_img
    WHERE 
        h.titulo ILIKE '%' || '${titulo}' || '%'
    GROUP BY 
        h.id_homenagem, h.titulo, h.resumo, u.nome, h.data_criacao, h.data_publi, ass.nome, li.link, im.link, inst.nome
) as sub
GROUP BY 
    sub.id_homenagem, 
    sub.titulo, 
    sub.data_criacao, 
    sub.data_publi, 
    sub.resumo, 
    sub.usuario
ORDER BY 
    sub.id_homenagem;
    `);

    if (homenagem.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Homenagem(ns) não encontrada(s)", status: 400 });
    }

    return res.status(200).json(homenagem.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarPeloNomeInstituicao = async (req, res) => {
  const { nome } = req.body;

  try {
    const homenagem = await pool.query(`
    SELECT 
    sub.id_homenagem, sub.data_criacao, sub.titulo, sub.resumo, sub.data_publi, sub.usuario, 
    string_agg(DISTINCT sub.links, ', ') as links, 
    string_agg(DISTINCT sub.imgs, ', ') as imgs,
    string_agg(DISTINCT sub.assuntos, ', ') as assuntos, 
    string_agg(DISTINCT sub.instituicoes, ', ') as instituicoes
FROM (
    SELECT 
        h.id_homenagem, 
        h.data_criacao, 
        h.titulo, 
        h.resumo, 
        h.data_publi, 
        u.nome as usuario, 
        li.link as links, 
        im.link as imgs,
        ass.nome as assuntos, 
        inst.nome as instituicoes
    FROM homenagem h
    INNER JOIN homenagens_instituicoes hi ON h.id_homenagem = hi.id_homenagem
    INNER JOIN instituicao inst ON inst.id_instituicao = hi.id_instituicao
    INNER JOIN usuario u ON u.id_usuario = h.id_usuario
    INNER JOIN homenagens_assuntos has ON h.id_homenagem = has.id_homenagem
    INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
    INNER JOIN homenagens_links hl ON hl.id_homenagem = h.id_homenagem
    INNER JOIN link li ON li.id_link = hl.id_link
    INNER JOIN homenagens_imgs hi2 ON hi2.id_homenagem = h.id_homenagem
    INNER JOIN img im ON im.id_img = hi2.id_img
    WHERE inst.nome ILIKE '%' || '${nome}' || '%'
) as sub
GROUP BY 
    sub.id_homenagem, sub.data_criacao, sub.titulo, sub.resumo, sub.data_publi, sub.usuario
ORDER BY 
    sub.id_homenagem;
    `);

    if (homenagem.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Homenagem(ns) não encontrada(s)", status: 400 });
    }

    return res.status(200).json(homenagem.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarHomenagensPeloIDInstituicao = async (req, res) => {
  const { id_instituicao } = req.params;

  try {
    const homenagem = await pool.query(
      `
    SELECT 
        h.id_homenagem, h.titulo, h.data_criacao, h.resumo, h.data_publi, u.nome as usuario, 
        string_agg(DISTINCT li.link, ', ') as links, 
        string_agg(DISTINCT im.link, ', ') as imgs,
        string_agg(DISTINCT ass.nome, ', ') as assuntos, string_agg(DISTINCT inst.nome, ', ') as instituicoes
        FROM homenagem h
        inner join homenagens_instituicoes hi on h.id_homenagem = hi.id_homenagem
        inner join instituicao inst on inst.id_instituicao = hi.id_instituicao
        inner join usuario u on u.id_usuario = h.id_usuario
        INNER JOIN homenagens_assuntos has ON h.id_homenagem = has.id_homenagem
        INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
        INNER JOIN homenagens_links hl ON hl.id_homenagem = h.id_homenagem
        INNER JOIN link li ON li.id_link = hl.id_link
        INNER JOIN homenagens_imgs hi2 ON hi2.id_homenagem = h.id_homenagem
        INNER JOIN img im ON im.id_img = hi2.id_img
        where inst.id_instituicao = $1
        
        group by h.id_homenagem, inst.nome, h.titulo, h.resumo, h.data_criacao, u.nome, h.data_publi, ass.nome, li.link, im.link
        
        order by h.id_homenagem
    `,
      [id_instituicao]
    );

    if (homenagem.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Homenagem(ns) não encontrada(s)", status: 400 });
    }

    return res.status(200).json(homenagem.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarPeloNomeUsuario = async (req, res) => {
  const { nome } = req.body;

  try {
    const homenagem = await pool.query(`
    SELECT 
    h.id_homenagem, h.data_criacao, h.titulo, h.data_publi, h.resumo, u.nome as usuario, 
    string_agg(DISTINCT li.link, ', ') as links, 
    string_agg(DISTINCT im.link, ', ') as imgs,
    string_agg(DISTINCT ass.nome, ', ') as assuntos, 
    string_agg(DISTINCT inst.nome, ', ') as instituicoes
FROM homenagem h
INNER JOIN homenagens_instituicoes hi ON h.id_homenagem = hi.id_homenagem
INNER JOIN instituicao inst ON inst.id_instituicao = hi.id_instituicao
INNER JOIN usuario u ON u.id_usuario = h.id_usuario
INNER JOIN homenagens_assuntos has ON h.id_homenagem = has.id_homenagem
INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
INNER JOIN homenagens_links hl ON hl.id_homenagem = h.id_homenagem
INNER JOIN link li ON li.id_link = hl.id_link
INNER JOIN homenagens_imgs hi2 ON hi2.id_homenagem = h.id_homenagem
INNER JOIN img im ON im.id_img = hi2.id_img
WHERE u.nome ILIKE '%' || '${nome}' || '%'
GROUP BY h.id_homenagem, h.data_criacao, h.titulo, h.data_publi, h.resumo, u.nome
ORDER BY h.id_homenagem;
    `);

    if (homenagem.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Homenagem(ns) não encontrada(s)", status: 400 });
    }

    return res.status(200).json(homenagem.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarHomenagemPeloIDUsuario = async (req, res) => {
  const { id_usuario } = req.params;
  try {
    const homenagem = await pool.query(
      `
      SELECT 
      h.id_homenagem, h.titulo, h.data_criacao, h.data_publi, h.resumo, u.nome as usuario, 
      string_agg(DISTINCT li.link, ', ') as links, 
      string_agg(DISTINCT im.link, ', ') as imgs,
      string_agg(DISTINCT ass.nome, ', ') as assuntos, 
      string_agg(DISTINCT inst.nome, ', ') as instituicoes
  FROM 
      homenagem h
  INNER JOIN 
      homenagens_instituicoes hi ON h.id_homenagem = hi.id_homenagem
  INNER JOIN 
      instituicao inst ON inst.id_instituicao = hi.id_instituicao
  INNER JOIN 
      usuario u ON u.id_usuario = h.id_usuario
  INNER JOIN homenagens_assuntos has ON h.id_homenagem = has.id_homenagem
  INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
  INNER JOIN homenagens_links hl ON hl.id_homenagem = h.id_homenagem
  INNER JOIN link li ON li.id_link = hl.id_link
  INNER JOIN homenagens_imgs hi2 ON hi2.id_homenagem = h.id_homenagem
  INNER JOIN img im ON im.id_img = hi2.id_img
  WHERE 
      u.id_usuario = $1
  GROUP BY 
      h.id_homenagem, h.titulo, h.resumo, u.nome, h.data_criacao, h.data_publi
  ORDER BY 
      h.id_homenagem;
    `,
      [id_usuario]
    );

    if (homenagem.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Homenagem(ns) não encontrada(s)", status: 400 });
    }

    return res.status(200).json(homenagem.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const CadastrarHomenagem = async (req, res) => {
  const { nome, data_criacao, descricao, img, instituicao } = req.body;

  const nomeFormatado = primeiraLetraMaiuscula(nome);
  const dataFormatada = data_criacao.trim();
  const descricaoFormatada = descricao.trim();
  const imagemFormatada = img.trim();
  try {
    if (!nome || !data_criacao || !descricao || !img || !instituicao) {
      return res
        .status(200) // Código de status corrigido
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }
    if (data_criacao.length != 8) {
      return res.status(200).json({ Mensagem: "Data Inválida.", status: 400 });
    }

    // Verifica se as instituições existem
    const lista_instituicoes_id = [];
    for (const instituicao_nome of instituicao) {
      const InstituicaoFormatada = primeiraLetraMaiuscula(instituicao_nome);
      const verificaInstituicao = await pool.query(
        "SELECT id_instituicao FROM instituicao WHERE nome = $1",
        [InstituicaoFormatada]
      );

      if (verificaInstituicao.rows.length > 0) {
        lista_instituicoes_id.push(verificaInstituicao.rows[0].id_instituicao);
      } else {
        return res
          .status(200)
          .json({ Mensagem: "Instituição não encontrada.", status: 400 });
      }
    }

    const cadastroHomenagem = await pool.query(
      `INSERT INTO homenagem (
        nome,
        data_criacao,
        img,
        descricao
      ) VALUES ($1, $2) RETURNING id_homenagem`,
      [nomeFormatado, dataFormatada, imagemFormatada, descricaoFormatada]
    );

    const id_homenagem = cadastroHomenagem.rows[0].id_homenagem;

    for (const instituicao_id of lista_instituicoes_id) {
      await pool.query(
        "INSERT INTO homenagem_instituicao (id_homenagem, id_instituicao) VALUES ($1, $2)",
        [id_homenagem, instituicao_id]
      );
    }
    return res
      .status(200)
      .json({ Mensagem: "Homenagem cadastrada com sucesso.", status: 200 });
  } catch (erro) {
    return res.status(500).json({ Message: erro.Message });
  }
};

const ExcluirHomenagem = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res
        .status(200)
        .json({ Mensagem: "Id não informado.", status: 400 });
    }

    await pool.query(
      `DELETE FROM homenagem_instituicao WHERE id_homenagem = ${id}`
    );

    await pool.query(`DELETE FROM homenagem WHERE id_homenagem = ${id}`);

    return res
      .status(200)
      .json({ Mensagem: "Homenagem excluída com sucesso." });
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const EditarHomenagem = async (req, res) => {
  try {
    const { nome, data_criacao, descricao, img, id_homenagem, instituicao } =
      req.body;

    if (!nome && !data_criacao && !descricao && !img && !instituicao) {
      return res
        .status(400)
        .json({ Mensagem: "Altere pelo menos um campo.", status: 400 });
    }

    const nomeFormatado = primeiraLetraMaiuscula(nome);
    const dataCriacaoFormatada = data_criacao ? data_criacao.trim() : undefined;
    const descricaoFormatada = descricao ? descricao.trim() : undefined;
    const imgFormatada = img ? img.trim() : undefined;

    if (nomeFormatado) {
      await pool.query(
        "UPDATE homenagem SET nome = $1 WHERE id_homenagem = $2",
        [nomeFormatado, id_homenagem]
      );
    }

    if (dataCriacaoFormatada) {
      await pool.query(
        "UPDATE homenagem SET data_criacao = $1 WHERE id_homenagem = $2",
        [dataCriacaoFormatada, id_homenagem]
      );
    }

    if (descricaoFormatada) {
      await pool.query(
        "UPDATE homenagem SET descricao = $1 WHERE id_homenagem = $2",
        [descricaoFormatada, id_homenagem]
      );
    }

    if (imgFormatada) {
      await pool.query(
        "UPDATE homenagem SET img = $1 WHERE id_homenagem = $2",
        [imgFormatada, id_homenagem]
      );
    }

    if (instituicao) {
      await pool.query(
        "DELETE FROM homenagem_instituicao WHERE id_homenagem = $1",
        [id_homenagem]
      );

      for (const instituicao_nome of instituicao) {
        const instituicaoFormatada = primeiraLetraMaiuscula(instituicao_nome);
        const verificaInstituicao = await pool.query(
          "SELECT id_instituicao FROM instituicao WHERE nome = $1",
          [instituicaoFormatada]
        );

        if (verificaInstituicao.rows.length > 0) {
          const instituicao_id = verificaInstituicao.rows[0].id_instituicao;
          await pool.query(
            "INSERT INTO homenagem_instituicao (id_homenagem, id_instituicao) VALUES ($1, $2)",
            [id_homenagem, instituicao_id]
          );
        } else {
          return res
            .status(400)
            .json({ Mensagem: "Instituição não encontrada.", status: 400 });
        }
      }
    }

    return res
      .status(200)
      .json({ Mensagem: "Homenagem atualizada com sucesso." });
  } catch (erro) {
    return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor." });
  }
};

export {
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
};
