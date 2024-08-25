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
      string_agg(DISTINCT ins.nome, ', ') as instituicoes,
      string_agg(DISTINCT ho.nome, ', ') as homenageados
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
      INNER JOIN homenagens_homenageados hh ON hh.id_homenagem = h.id_homenagem
      INNER JOIN homenageado ho ON ho.id_homenageado = hh.id_homenageado
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
      string_agg(DISTINCT ins.nome, ', ') as instituicoes,
      string_agg(DISTINCT ho.nome, ', ') as homenageados
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
      INNER JOIN homenagens_homenageados hh ON hh.id_homenagem = h.id_homenagem
      INNER JOIN homenageado ho ON ho.id_homenageado = hh.id_homenageado
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
      string_agg(sub.instituicoes, ', ') as instituicoes,
      string_agg(sub.homenageados, ', ') as homenageados
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
        ins.nome as instituicoes,
        ho.nome as homenageados
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
        INNER JOIN homenagens_homenageados hh ON hh.id_homenagem = h.id_homenagem
        INNER JOIN homenageado ho ON ho.id_homenageado = hh.id_homenageado
      ) as sub
      GROUP BY sub.id_homenagem, sub.titulo, sub.data_publi, sub.data_criacao, sub.resumo, sub.usuario
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
      string_agg(DISTINCT ho.nome, ', ') as homenageados,
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
      INNER JOIN homenagens_links hl ON h.id_homenagem = hl.id_homenagem
      INNER JOIN link li ON hl.id_link = li.id_link
      INNER JOIN homenagens_imgs hi ON hi.id_homenagem = h.id_homenagem
      INNER JOIN img im ON hi.id_img = im.id_img
      INNER JOIN homenagens_homenageados hh ON hh.id_homenagem = h.id_homenagem
      INNER JOIN homenageado ho ON ho.id_homenageado = hh.id_homenageado
      WHERE 
      h.id_homenagem = ${id}
      GROUP BY h.titulo, h.data_publi, h.data_criacao, h.resumo, u.nome, u.id_usuario, h.descricao;
    ;`);

    res.status(200).json(Homenagem.rows[0]);
  } catch (erro) {
    return res.status(500).json({ Message: erro.Message });
  }
};

const MostrarTodasHomenagensPorAssunto = async (req, res) => {
  const { assunto } = req.body;

  try {
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
        string_agg(DISTINCT ins.nome, ', ') as instituicoes,
        string_agg(DISTINCT ho.nome, ', ') as homenageados
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
    INNER JOIN homenagens_homenageados hh ON hh.id_homenagem = h.id_homenagem
    INNER JOIN homenageado ho ON ho.id_homenageado = hh.id_homenageado
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
    ins.nome
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
        string_agg(DISTINCT ins.nome, ', ') as instituicoes,
        string_agg(DISTINCT ho.nome, ', ') as homenageados
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
    INNER JOIN homenagens_homenageados hh ON hh.id_homenagem = o.id_homenagem
    INNER JOIN homenageado ho ON ho.id_homenageado = hh.id_homenageado
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
    string_agg(DISTINCT sub.instituicoes, ', ') as instituicoes,
    string_agg(DISTINCT sub.homenageados, ', ') as homenageados
FROM (
    SELECT 
        o.id_homenagem, o.titulo, o.data_criacao, o.data_publi, o.resumo, u.nome as usuario, 
        li.link as links, 
        im.link as imgs,
        ass.nome as assuntos, 
        ins.nome as instituicoes,
        ho.nome as homenageados
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
    INNER JOIN homenagens_homenageados hh ON hh.id_homenagem = o.id_homenagem
    INNER JOIN homenageado ho ON ho.id_homenageado = hh.id_homenageado
    GROUP BY 
        o.id_homenagem, o.titulo, o.data_criacao, o.data_publi, o.resumo, u.nome, li.link, im.link, ass.nome, ins.nome, ho.nome
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
      h.titulo AS nome_homenagem,
      h.data_criacao,
      STRING_AGG(i.nome, ', ') AS instituicoes,
      h.descricao,
      STRING_AGG(im.link, ', ') AS imgs,
      STRING_AGG(ho.nome, ', ') AS homenageados
    FROM
      homenagem h
    INNER JOIN
      homenagens_instituicoes hi ON h.id_homenagem = hi.id_homenagem
    INNER JOIN
      instituicao i ON hi.id_instituicao = i.id_instituicao
    INNER JOIN
      homenagens_imgs hi2 ON hi2.id_homenagem = h.id_homenagem
    INNER JOIN
      img im ON im.id_img = hi2.id_img
    INNER JOIN
      homenagens_homenageados hh ON hh.id_homenagem = h.id_homenagem
    INNER JOIN
      homenageado ho ON ho.id_homenageado = hh.id_homenageado
    GROUP BY
      h.id_homenagem, h.titulo, h.data_criacao, h.descricao
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
        string_agg(DISTINCT links, ', ') as links, 
        string_agg(DISTINCT imgs, ', ') as imgs, 
        string_agg(DISTINCT assuntos, ', ') as assuntos, 
        string_agg(DISTINCT instituicoes, ', ') as instituicoes,
        string_agg(DISTINCT homenageados, ', ') as homenageados
      FROM (
        SELECT 
          o.id_homenagem, 
          o.titulo, 
          o.data_criacao, 
          o.data_publi, 
          o.resumo, 
          u.nome as usuario,
          li.link as links, 
          im.link as imgs, 
          ass.nome as assuntos, 
          ins.nome as instituicoes,
          ho.nome as homenageados,
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
        INNER JOIN homenagens_homenageados hh ON hh.id_homenagem = o.id_homenagem
        INNER JOIN homenageado ho ON ho.id_homenageado = hh.id_homenageado
        WHERE 
          o.data_criacao IS NOT NULL
        GROUP BY 
          o.id_homenagem, o.titulo, o.resumo, u.nome, o.data_criacao, o.data_publi, ass.nome, ins.nome, ho.nome
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
        sub.id_homenagem, 
        sub.titulo, 
        sub.data_criacao, 
        sub.data_publi, 
        sub.resumo, 
        sub.usuario, 
        string_agg(DISTINCT sub.links, ', ') as links, 
        string_agg(DISTINCT sub.imgs, ', ') as imgs, 
        string_agg(DISTINCT sub.assuntos, ', ') as assuntos, 
        string_agg(DISTINCT sub.instituicoes, ', ') as instituicoes,
        string_agg(DISTINCT sub.homenageados, ', ') as homenageados
      FROM (
        SELECT 
          o.id_homenagem, 
          o.titulo, 
          o.data_criacao, 
          o.data_publi, 
          o.resumo, 
          u.nome as usuario, 
          li.link as links, 
          im.link as imgs,
          ass.nome as assuntos, 
          ins.nome as instituicoes,
          ho.nome as homenageados
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
        INNER JOIN homenagens_homenageados hh ON hh.id_homenagem = o.id_homenagem
        INNER JOIN homenageado ho ON ho.id_homenageado = hh.id_homenageado
        GROUP BY 
          o.id_homenagem, o.titulo, o.data_criacao, o.data_publi, o.resumo, u.nome, li.link, im.link, ass.nome, ins.nome, ho.nome
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
        string_agg(DISTINCT sub.instituicoes, ', ') as instituicoes,
        string_agg(DISTINCT sub.homenageados, ', ') as homenageados
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
          inst.nome as instituicoes,
          ho.nome as homenageados
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
        INNER JOIN 
          homenagens_homenageados hh ON hh.id_homenagem = h.id_homenagem
        INNER JOIN 
          homenageado ho ON ho.id_homenageado = hh.id_homenageado
        WHERE 
          h.titulo ILIKE '%' || '${titulo}' || '%'
        GROUP BY 
          h.id_homenagem, h.titulo, h.resumo, u.nome, h.data_criacao, h.data_publi, ass.nome, li.link, im.link, inst.nome, ho.nome
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

const MostrarPeloNomeHomenageado = async (req, res) => {
  const { nome } = req.body;

  try {
    const homenagem = await pool.query(`
      SELECT 
        sub.id_homenagem, 
        sub.data_criacao, 
        sub.titulo, 
        sub.resumo, 
        sub.data_publi, 
        sub.usuario, 
        string_agg(DISTINCT sub.links, ', ') as links, 
        string_agg(DISTINCT sub.imgs, ', ') as imgs,
        string_agg(DISTINCT sub.assuntos, ', ') as assuntos, 
        string_agg(DISTINCT sub.instituicoes, ', ') as instituicoes,
        string_agg(DISTINCT sub.homenageados, ', ') as homenageados
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
          inst.nome as instituicoes,
          ho.nome as homenageados
        FROM homenagem h
        INNER JOIN homenagens_homenageados hh ON h.id_homenagem = hh.id_homenagem
        INNER JOIN homenageado ho ON ho.id_homenageado = hh.id_homenageado
        INNER JOIN homenagens_instituicoes hi ON h.id_homenagem = hi.id_homenagem
        INNER JOIN instituicao inst ON inst.id_instituicao = hi.id_instituicao
        INNER JOIN usuario u ON u.id_usuario = h.id_usuario
        INNER JOIN homenagens_assuntos has ON h.id_homenagem = has.id_homenagem
        INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
        INNER JOIN homenagens_links hl ON hl.id_homenagem = h.id_homenagem
        INNER JOIN link li ON li.id_link = hl.id_link
        INNER JOIN homenagens_imgs hi2 ON hi2.id_homenagem = h.id_homenagem
        INNER JOIN img im ON im.id_img = hi2.id_img
        WHERE ho.nome ILIKE '%' || $1 || '%'
        GROUP BY 
          h.id_homenagem, h.data_criacao, h.titulo, h.resumo, h.data_publi, u.nome, li.link, im.link, ass.nome, inst.nome, ho.nome
      ) as sub
      GROUP BY 
        sub.id_homenagem, sub.data_criacao, sub.titulo, sub.resumo, sub.data_publi, sub.usuario
      ORDER BY 
        sub.id_homenagem;
    `, [nome]);

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

const MostrarHomenagensPeloIDHomenageado = async (req, res) => {
  const { id_homenageado } = req.params;

  try {
    const homenagem = await pool.query(`
      SELECT 
        h.id_homenagem, 
        h.titulo, 
        h.data_criacao, 
        h.resumo, 
        h.data_publi, 
        u.nome as usuario, 
        string_agg(DISTINCT li.link, ', ') as links, 
        string_agg(DISTINCT im.link, ', ') as imgs,
        string_agg(DISTINCT ass.nome, ', ') as assuntos, 
        string_agg(DISTINCT inst.nome, ', ') as instituicoes,
        string_agg(DISTINCT ho.nome, ', ') as homenageados
      FROM homenagem h
      INNER JOIN homenagens_homenageados hh ON h.id_homenagem = hh.id_homenagem
      INNER JOIN homenageado ho ON ho.id_homenageado = hh.id_homenageado
      INNER JOIN homenagens_instituicoes hi ON h.id_homenagem = hi.id_homenagem
      INNER JOIN instituicao inst ON inst.id_instituicao = hi.id_instituicao
      INNER JOIN usuario u ON u.id_usuario = h.id_usuario
      INNER JOIN homenagens_assuntos has ON h.id_homenagem = has.id_homenagem
      INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
      INNER JOIN homenagens_links hl ON hl.id_homenagem = h.id_homenagem
      INNER JOIN link li ON li.id_link = hl.id_link
      INNER JOIN homenagens_imgs hi2 ON hi2.id_homenagem = h.id_homenagem
      INNER JOIN img im ON im.id_img = hi2.id_img
      WHERE ho.id_homenageado = $1
      GROUP BY h.id_homenagem, h.titulo, h.data_criacao, h.resumo, h.data_publi, u.nome
      ORDER BY h.id_homenagem
    `, [id_homenageado]);

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

const MostrarHomenagensPeloNomeUsuario = async (req, res) => {
  const { nome } = req.body;

  try {
    const homenagem = await pool.query(`
     SELECT 
        h.id_homenagem, 
        h.data_criacao, 
        h.titulo, 
        h.data_publi, 
        h.resumo, 
        u.nome as usuario, 
        string_agg(DISTINCT li.link, ', ') as links, 
        string_agg(DISTINCT im.link, ', ') as imgs,
        string_agg(DISTINCT ass.nome, ', ') as assuntos, 
        string_agg(DISTINCT inst.nome, ', ') as instituicoes,
        string_agg(DISTINCT ho.nome, ', ') as homenageados
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
      INNER JOIN homenagens_homenageados hh ON hh.id_homenagem = h.id_homenagem
      INNER JOIN homenageado ho ON ho.id_homenageado = hh.id_homenageado
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
        h.id_homenagem, 
        h.titulo, 
        h.data_criacao, 
        h.data_publi, 
        h.resumo, 
        u.nome as usuario, 
        string_agg(DISTINCT li.link, ', ') as links, 
        string_agg(DISTINCT im.link, ', ') as imgs,
        string_agg(DISTINCT ass.nome, ', ') as assuntos, 
        string_agg(DISTINCT inst.nome, ', ') as instituicoes,
        string_agg(DISTINCT ho.nome, ', ') as homenageados
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
      INNER JOIN 
        homenagens_homenageados hh ON hh.id_homenagem = h.id_homenagem
      INNER JOIN 
        homenageado ho ON ho.id_homenageado = hh.id_homenageado
      WHERE 
        u.id_usuario = $1
      GROUP BY 
        h.id_homenagem, h.titulo, h.data_criacao, h.data_publi, h.resumo, u.nome
      ORDER BY 
        h.id_homenagem;
    `, [id_usuario]);

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

const MostrarTodasHomenagensCapistrano = async (req, res) => {
  try {
    const obra = await pool.query(`
    SELECT 
    h.id_homenagem, h.data_criacao, h.titulo, h.resumo, h.data_publi, u.nome as usuario,
    string_agg(DISTINCT li.link, ', ') as links, 
    string_agg(DISTINCT im.link, ', ') as imgs,
    string_agg(DISTINCT ass.nome, ', ') as assuntos, 
    string_agg(DISTINCT ho.nome, ', ') as homenageados
FROM homenagem h
INNER JOIN homenagens_homenageados hh ON h.id_homenagem = hh.id_homenagem
INNER JOIN homenageado ho ON ho.id_homenageado = hh.id_homenageado
INNER JOIN usuario u ON u.id_usuario = h.id_usuario
INNER JOIN homenagens_assuntos has ON h.id_homenagem = has.id_homenagem
INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
INNER JOIN homenagens_links hl ON hl.id_homenagem = h.id_homenagem
INNER JOIN link li ON li.id_link = hl.id_link
INNER JOIN homenagens_imgs hi ON hi.id_homenagem = h.id_homenagem
INNER JOIN img im ON im.id_img = hi.id_img
WHERE ho.nome = 'Capistrano De Abreu'
GROUP BY h.id_homenagem, h.data_criacao, h.titulo, h.resumo, h.data_publi, u.nome
ORDER BY h.id_homenagem;
`);

    if (obra.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Obra(s) não encontrado(s)", status: 400 });
    }

    return res.status(200).json(obra.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarTodasHomenagensOutrosHomenageados = async (req, res) => {
  try {
    const homenagem = await pool.query(`
    SELECT 
    h.id_homenagem, h.titulo, h.resumo, h.data_publi, u.nome as usuario, 
    string_agg(DISTINCT li.link, ', ') as links, 
    string_agg(DISTINCT im.link, ', ') as imgs,
    string_agg(DISTINCT ass.nome, ', ') as assuntos, 
    string_agg(DISTINCT ho.nome, ', ') as homenageados
FROM homenagem h
INNER JOIN homenagens_homenageados hh ON h.id_homenagem = hh.id_homenagem
INNER JOIN homenageado ho ON ho.id_homenageado = hh.id_homenageado
INNER JOIN usuario u ON u.id_usuario = h.id_usuario
INNER JOIN homenagens_assuntos has ON h.id_homenagem = has.id_homenagem
INNER JOIN assunto ass ON ass.id_assunto = has.id_assunto
INNER JOIN homenagens_links hl ON hl.id_homenagem = h.id_homenagem
INNER JOIN link li ON li.id_link = hl.id_link
INNER JOIN homenagens_imgs hi ON hi.id_homenagem = h.id_homenagem
INNER JOIN img im ON im.id_img = hi.id_img
WHERE ho.nome <> 'Capistrano De Abreu'
GROUP BY h.id_homenagem, u.nome, h.titulo, h.resumo, h.data_publi
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

const CadastrarHomenagem = async (req, res) => {
  const {
    titulo,
    resumo,
    descricao,
    data_publi,
    data_criacao,
    usuario,
    homenageados,
    assunto,
    link,
    img,
    instituicoes
  } = req.body;

  const TituloFormatado = primeiraLetraMaiuscula(titulo);
  const descricaoFormatada = descricao.trim();
  const resumoFormatado = capitalizarEPontuar(resumo).trim();
  const dataFormatada = data_publi.trim();
  const datacriacaoFormatada = data_criacao.trim();
  try {
    if (
      !TituloFormatado ||
      !descricaoFormatada ||
      !resumoFormatado ||
      !dataFormatada ||
      !datacriacaoFormatada ||
      !usuario ||
      !homenageados ||
      !assunto ||
      !link ||
      !img ||
      !instituicoes
    ) {
      return res
        .status(400)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }
    if (data_criacao.length != 8) {
      return res.status(200).json({ Mensagem: "Data Inválida.", status: 400 });
    }

    const lista_homenageados_id = [];
    for (const homenageado_nome of homenageados) {
      const HomenageadoFormatado = primeiraLetraMaiuscula(homenageado_nome);
      const verificaHomenageado = await pool.query(
        "SELECT id_homenageado FROM homenageado WHERE nome = $1",
        [HomenageadoFormatado]
      );

      if (verificaHomenageado.rows.length > 0) {
        lista_homenageados_id.push(verificaHomenageado.rows[0].id_homenageado);
      } else {
        return res
          .status(400)
          .json({ Mensagem: "Homenageado não encontrado.", status: 400 });
      }
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

    const lista_assuntos_id = [];
    for (const assunto_nome of assunto) {
      const AssuntoFormatado = primeiraLetraMaiuscula(assunto_nome);
      const verificaAssunto = await pool.query(
        "SELECT id_assunto FROM assunto WHERE nome = $1",
        [AssuntoFormatado]
      );

      if (verificaAssunto.rows.length > 0) {
        lista_assuntos_id.push(verificaAssunto.rows[0].id_assunto);
      } else {
        return res
          .status(400)
          .json({ Mensagem: "Assunto não encontrado.", status: 400 });
      }
    }

    const lista_link_id = [];
    for (const link_nome of link) {
      const linkFormatado = link_nome.trim();
      const verificaLink = await pool.query(
        "SELECT id_link FROM link WHERE link = $1",
        [linkFormatado]
      );

      if (verificaLink.rows.length > 0) {
        lista_link_id.push(verificaLink.rows[0].id_link);
      } else {
        const CadastroLink = await pool.query(
          `INSERT INTO link (link) VALUES ($1) RETURNING id_link`,
          [linkFormatado]
        );

        lista_link_id.push(CadastroLink.rows[0].id_link);
      }
    }

    const lista_img_id = [];
    for (const img_nome of img) {
      const ImgFormatado = img_nome.trim();
      const verificaImg = await pool.query(
        "SELECT id_img FROM img WHERE link = $1",
        [ImgFormatado]
      );

      if (verificaImg.rows.length > 0) {
        lista_img_id.push(verificaImg.rows[0].id_img);
      } else {
        const CadastroImg = await pool.query(
          `INSERT INTO img (link) VALUES ($1) RETURNING id_img`,
          [ImgFormatado]
        );

        lista_img_id.push(CadastroImg.rows[0].id_img);
      }
    }

    const CadastroHomenagem = await pool.query(
      `INSERT INTO homenagem (
          id_usuario,
          titulo,
          resumo,
          descricao,
          data_publi,
          data_criacao
        ) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_homenagem`,
      [
        usuario,
        TituloFormatado,
        resumoFormatado,
        descricaoFormatada,
        dataFormatada,
        datacriacaoFormatada,
      ]
    );

    const id_homenagem = CadastroHomenagem.rows[0].id_homenagem;

    // Relaciona na tabela homenageados
    for (const homenageado_id of lista_homenageados_id) {
      await pool.query(
        "INSERT INTO homenagens_homenageados (id_homenagem, id_homenageado) VALUES ($1, $2)",
        [id_homenagem, homenageado_id]
      );
    }

    for (const instituicao_id of lista_instituicoes_id) {
      await pool.query(
        "INSERT INTO homenagens_instituicoes (id_homenagem, id_instituicao) VALUES ($1, $2)",
        [id_homenagem, instituicao_id]
      );
    }

    for (const assunto_id of lista_assuntos_id) {
      await pool.query(
        "INSERT INTO homenagens_assuntos (id_homenagem, id_assunto) VALUES ($1, $2)",
        [id_homenagem, assunto_id]
      );
    }

    for (const link_id of lista_link_id) {
      await pool.query(
        "INSERT INTO homenagens_links (id_homenagem, id_link) VALUES ($1, $2)",
        [id_homenagem, link_id]
      );
    }

    for (const img_id of lista_img_id) {
      await pool.query(
        "INSERT INTO homenagens_imgs (id_homenagem, id_img) VALUES ($1, $2)",
        [id_homenagem, img_id]
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

    await pool.query(`DELETE FROM homenagem_instituicao WHERE id_homenagem = ${id}`);
    await pool.query(`DELETE FROM homenagens_homenageados WHERE id_homenagem = ${id}`);
    await pool.query(`DELETE FROM homenagens_links WHERE id_homenagem = ${id}`);
    await pool.query(`DELETE FROM homenagens_imgs WHERE id_homenagem = ${id}`);
    await pool.query(`DELETE FROM homenagens_assuntos WHERE id_homenagem = ${id}`);
    await pool.query(`DELETE FROM homenagens_instituicoes WHERE id_homenagem = ${id}`);
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
  MostrarPeloNomeHomenageado,
  MostrarHomenagensPeloIDHomenageado,
  MostrarHomenagensPeloNomeUsuario,
  MostrarHomenagemPeloIDUsuario,
  MostrarTodasHomenagensCapistrano,
  MostrarTodasHomenagensOutrosHomenageados,
  CadastrarHomenagem,
  ExcluirHomenagem,
  EditarHomenagem,
};
