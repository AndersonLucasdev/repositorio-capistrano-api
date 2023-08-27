import pool from "../database/db.js";
import { primeiraLetraMaiuscula } from "./controllersGerais.js";

const MostrarTodasHomenagens = async (req, res) => {
  try {
    const homenagens = await pool.query(`
    SELECT
    h.id_homenagem,
    h.nome AS nome_homenagem,
    h.data_criacao,
    STRING_AGG(i.nome, ', ') AS instituicoes
FROM
    homenagem h
INNER JOIN
    homenagem_instituicao hi ON h.id_homenagem = hi.id_homenagem
INNER JOIN
    instituicao i ON hi.id_instituicao = i.id_instituicao
GROUP BY
    h.id_homenagem, h.nome, h.data_criacao;
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

const MostrarHomenagensAleatorio = async (req, res) => {
  try {
    const homenagens = await pool.query(`
        SELECT
    h.id_homenagem,
    h.nome AS nome_homenagem,
    h.data_criacao,
    STRING_AGG(i.nome, ', ') AS instituicoes
FROM
    homenagem h
INNER JOIN
    homenagem_instituicao hi ON h.id_homenagem = hi.id_homenagem
INNER JOIN
    instituicao i ON hi.id_instituicao = i.id_instituicao
GROUP BY
    h.id_homenagem, h.nome, h.data_criacao;
    ORDER BY RANDOM()
          `);

    if (homenagens.rows.length === 0) {
      res
        .status(200)
        .json({ Mensagem: "Não há homenagen(s) cadastrada(s).", status: 400 });
    }

    res.status(200).json(homenagens.rows);
  } catch (erro) {
    res.status(500).json({ Mensagem: erro.Mensagem });
  }
};

const MostrarHomenagensPorInstituicoes = async (req, res) => {
  const { instituicao } = req.body;

  try {
    if (!instituicao) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    const homenagem = await pool.query(
      `
    SELECT
    h.id_homenagem,
    h.nome AS nome_homenagem,
    h.data_criacao,
    STRING_AGG(i.nome, ', ') AS instituicoes
FROM
    homenagem h
INNER JOIN
    homenagem_instituicao hi ON h.id_homenagem = hi.id_homenagem
INNER JOIN
    instituicao i ON hi.id_instituicao = i.id_instituicao
WHERE
    i.nome = $1
GROUP BY
    h.id_homenagem, h.nome, h.data_criacao
    ;`,
      [instituicao]
    );
    res.status(200).json(homenagem.rows);
  } catch (erro) {
    return res.status(500).json({ Message: erro.Message });
  }
};

const MostrarHomenagensOrdemAlfabetica = async (req, res) => {
  try {
    homenagens = await pool.query(`
        SELECT
        h.id_homenagem,
        h.nome AS nome_homenagem,
        h.data_criacao,
        STRING_AGG(i.nome, ', ') AS instituicoes
    FROM
        homenagem h
    INNER JOIN
        homenagem_instituicao hi ON h.id_homenagem = hi.id_homenagem
    INNER JOIN
        instituicao i ON hi.id_instituicao = i.id_instituicao
    GROUP BY
        h.id_homenagem, h.nome, h.data_criacao;
          ORDER BY 
          h.nome;
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

const HomenagensMaisAntigas = async (req, res) => {
  try {
    const homenagens = await pool.query(`
      SELECT
      h.id_homenagem,
      h.nome AS nome_homenagem,
      h.data_criacao,
      STRING_AGG(i.nome, ', ') AS instituicoes
  FROM
      homenagem h
  INNER JOIN
      homenagem_instituicao hi ON h.id_homenagem = hi.id_homenagem
  INNER JOIN
      instituicao i ON hi.id_instituicao = i.id_instituicao
  GROUP BY
      h.id_homenagem, h.nome, h.data_criacao;
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

const HomenagemMaisRecentes = async (req, res) => {
  try {
    const homenagens = await pool.query(`
      SELECT
      h.id_homenagem,
      h.nome AS nome_homenagem,
      h.data_criacao,
      STRING_AGG(i.nome, ', ') AS instituicoes
  FROM
      homenagem h
  INNER JOIN
      homenagem_instituicao hi ON h.id_homenagem = hi.id_homenagem
  INNER JOIN
      instituicao i ON hi.id_instituicao = i.id_instituicao
  GROUP BY
      h.id_homenagem, h.nome, h.data_criacao;
      ORDER BY 
          o.data_criacao DESC;
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

const MostrarPeloNomeHomenagem = async (req, res) => {
  const { titulo } = req.body;

  try {
    const homenagem = await pool.query(`
    SELECT
    h.id_homenagem,
    h.nome AS nome_homenagem,
    h.data_criacao,
    STRING_AGG(i.nome, ', ') AS instituicoes
FROM
    homenagem h
INNER JOIN
    homenagem_instituicao hi ON h.id_homenagem = hi.id_homenagem
INNER JOIN
    instituicao i ON hi.id_instituicao = i.id_instituicao
WHERE 
    h.nome ILIKE '%' || '${titulo}' || '%'
GROUP BY
    h.id_homenagem, h.nome, h.data_criacao;

    `);

    if (homenagem.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "homenagen(s) não encontrada(s)", status: 400 });
    }

    return res.status(200).json(homenagem.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarHomenagemPeloID = async (req, res) => {
  const { id } = req.params;
  try {
    const homenagem = await pool.query(`
    SELECT
    h.id_homenagem,
    h.nome AS nome_homenagem,
    h.data_criacao,
    STRING_AGG(i.nome, ', ') AS instituicoes
FROM
    homenagem h
INNER JOIN
    homenagem_instituicao hi ON h.id_homenagem = hi.id_homenagem
INNER JOIN
    instituicao i ON hi.id_instituicao = i.id_instituicao
WHERE
    h.id_homenagem = ${id}
GROUP BY
    h.id_homenagem, h.nome, h.data_criacao
    ;`);

    res.status(200).json(homenagem.rows[0]);
  } catch (erro) {
    return res.status(500).json({ Message: erro.Message });
  }
};

const CadastrarHomenagem = async (req, res) => {
  const { nome, data_criacao, instituicao } = req.body;

  const nomeFormatado = primeiraLetraMaiuscula(nome);
  const dataFormatada = data_criacao.trim();
  try {
    if (!nome || !data_criacao || !instituicao) {
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
        data_criacao
      ) VALUES ($1, $2) RETURNING id_homenagem`,
      [nomeFormatado, dataFormatada]
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
    const { nome, data_criacao, id_homenagem, instituicao } = req.body;

    if (!nome && !data_criacao && !instituicao) {
      return res
        .status(400)
        .json({ Mensagem: "Altere pelo menos um campo.", status: 400 });
    }

    const nomeFormatado = primeiraLetraMaiuscula(nome);
    const dataCricaoFormata = data_criacao ? data_criacao.trim() : undefined;

    if (nomeFormatado) {
      await pool.query(
        "UPDATE homenagem SET nome = $1 WHERE id_homenagem = $2",
        [nomeFormatado, id_homenagem]
      );
    }

    if (dataCricaoFormata) {
      await pool.query(
        "Updata homenagem SET data_criacao = $1 WHERE id_homenagem = $2",
        [dataCricaoFormata, id_homenagem]
      );
    }

    if (instituicao) {
      await pool.query(
        "DELETE FROM homenagem_instituicao WHERE id_homenagem = $1",
        [id_homenagem]
      );

      for (const instituicao_nome of instituicao) {
        const InstituicaoFormatado = primeiraLetraMaiuscula(instituicao_nome);
        const verificaInstituicao = await pool.query(
          "SELECT id_instituicao FROM instituicao WHERE nome = $1",
          [InstituicaoFormatado]
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
            .json({ Mensagem: "Instituição não encontrado.", status: 400 });
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
  EditarHomenagem
};
