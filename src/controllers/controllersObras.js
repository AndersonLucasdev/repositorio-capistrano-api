import pool from "../database/db.js";
import {
  primeiraLetraMaiuscula,
  capitalizarEPontuar,
} from "./controllersGerais.js";

// funções para mostrar (get)
const MostrarTodasobra = async (req, res) => {
  try {
    const obra = await pool.query(`
        SELECT 
          o.id_obra, o.titulo, o.img, o.data_publi, o.resumo, u.nome as usuario, string_agg(DISTINCT li.link, ', ') as links, 
          string_agg(DISTINCT im.link, ', ') as imgs, string_agg(DISTINCT ass.nome, ', ') as assuntos, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        INNER JOIN obras_autores oa ON o.id_obra = oa.id_obra
        INNER JOIN autor au ON au.id_autor = oa.id_autor
        INNER JOIN usuario u ON u.id_usuario = o.id_usuario
        INNER JOIN obras_assuntos oa ON oa.id_obra = o.id_obra
        INNER JOIN assunto ass ON ass.id_assunto = oa.id_assunto
        INNER JOIN obras_links ol ON ol.id_obra = o.id_obra
        INNER JOIN link li ON li.id_link = ol.id_link
        INNER JOIN obras_imgs oi ON oi.id_obra = o.id_obra
        INNER JOIN img im ON im.id_img = oi.id_img
        GROUP BY o.id_obra, u.nome, o.titulo, o.resumo, o.img, o.data_publi, ass.nome, li.link, im.link
        ORDER BY o.id_obra
      `);

    if (obra.length === 0) {
      res
        .status(200)
        .json({ Mensagem: "Não há obra cadastrados.", status: 400 });
    }

    res.status(200).json(obra.rows);
  } catch (erro) {
    res.status(500).json({ Mensagem: erro.Mensagem });
  }
};

const MostrarObraPeloID = async (req, res) => {
  try {
    const Obra = await pool.query(`
       SELECT 
    o.titulo,
    o.img, 
    o.data_publi
    o.resumo,
    u.nome as usuario,  
    string_agg(DISTINCT li.link, ', ') as links, 
    string_agg(DISTINCT im.link, ', ') as imgs,
    string_agg(DISTINCT ass.nome, ', ') as assuntos,
    string_agg(DISTINCT au.nome, ', ') as autores,
    o.descricao,
    o.link
FROM 
    obra o
INNER JOIN 
    obras_autores oa ON o.id_obra = oa.id_obra
INNER JOIN 
    autor au ON au.id_autor = oa.id_autor
INNER JOIN 
    usuario u ON u.id_usuario = o.id_usuario
INNER JOIN 
    obras_assuntos oa ON oa.id_obra = o.id_obra
INNER JOIN 
    assunto ass ON ass.id_assunto = oa.id_assunto
    INNER JOIN obras_links ol ON ol.id_obra = o.id_obra
        INNER JOIN link li ON li.id_link = ol.id_link
        INNER JOIN obras_imgs oi ON oi.id_obra = o.id_obra
        INNER JOIN img im ON im.id_img = oi.id_img
WHERE 
    o.id_obra = ${req.params}
GROUP BY 
    o.titulo,
    o.resumo,
    u.nome,
    o.descricao,
    o.link,
    o.img, 
    o.data_publi, 
    ass.nome, li.link, im.link
    ;`);

    res.status(200).json(Obra.rows[0]);
  } catch (erro) {
    return res.status(500).json({ Message: erro.Message });
  }
};

const MostrarTodasObrasPorAssunto = async (req, res) => {
  const { assunto } = req.body;

  try {
    if (!assunto) {
      return res
        .status(200)
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    const obras = await pool.query(
      `
    SELECT 
          o.id_obra, o.titulo, o.img, o.data_publi, o.resumo, u.nome as usuario, 
          string_agg(DISTINCT li.link, ', ') as links, string_agg(DISTINCT im.link, ', ') as imgs,
        string_agg(DISTINCT ass.nome, ', ') as assuntos, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        INNER JOIN obras_autores oa ON o.id_obra = oa.id_obra
        INNER JOIN autor au ON au.id_autor = oa.id_autor
        INNER JOIN usuario u ON u.id_usuario = o.id_usuario
        INNER JOIN obras_assuntos oa ON oa.id_obra = o.id_obra
        INNER JOIN assunto ass ON ass.id_assunto = oa.id_assunto
        INNER JOIN obras_links ol ON ol.id_obra = o.id_obra
        INNER JOIN link li ON li.id_link = ol.id_link
        INNER JOIN obras_imgs oi ON oi.id_obra = o.id_obra
        INNER JOIN img im ON im.id_img = oi.id_img
        where assunto = $1
        GROUP BY o.id_obra, u.nome, o.titulo, o.resumo, o.img, o.data_publi, ass.nome, li.link, im.link
        ORDER BY o.id_obra
        `,
      [assunto]
    );
    res.status(200).json(obras.rows[0]);
  } catch (erro) {
    return res.status(500).json({ Message: erro.Message });
  }
};

const ObrasOrdemAlfabetica = async (req, res) => {
  try {
    obras = await pool.query(`
      SELECT 
          o.id_obra, o.titulo, o.img, o.data_publi, o.resumo, u.nome as usuario, 
          string_agg(DISTINCT li.link, ', ') as links, 
          string_agg(DISTINCT im.link, ', ') as imgs,
          string_agg(DISTINCT ass.nome, ', ') as assuntos,string_agg(au.nome, ', ') as autores
      FROM 
          obra o
      INNER JOIN 
          obras_autores oa ON o.id_obra = oa.id_obra
      INNER JOIN 
          autor au ON au.id_autor = oa.id_autor
      INNER JOIN 
          usuario u ON u.id_usuario = o.id_usuario
      INNER JOIN 
          obras_assuntos oa ON oa.id_obra = o.id_obra
      INNER JOIN 
          assunto ass ON ass.id_assunto = oa.id_assunto
          INNER JOIN obras_links ol ON ol.id_obra = o.id_obra
          INNER JOIN link li ON li.id_link = ol.id_link
          INNER JOIN obras_imgs oi ON oi.id_obra = o.id_obra
          INNER JOIN img im ON im.id_img = oi.id_img
      WHERE 
          o.data_publi IS NOT NULL

      GROUP BY 
          o.id_obra, o.titulo, o.resumo, u.nome, o.img, o.data_publi, ass.nome, li.link, im.link
      ORDER BY 
          o.titulo;
    `);
    if (obras.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Obra(s) não encontrado(s)", status: 400 });
    }

    return res.status(200).json(obras.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const ObrasMaisRecentes = async (req, res) => {
  try {
    const obras = await pool.query(`
    SELECT 
        o.id_obra, o.titulo, o.img, o.data_publi, o.resumo, u.nome as usuario, 
        string_agg(DISTINCT li.link, ', ') as links, 
        string_agg(DISTINCT im.link, ', ') as imgs,
        string_agg(DISTINCT ass.nome, ', ') as assuntos, string_agg(au.nome, ', ') as autores
    FROM 
        obra o
    INNER JOIN 
        obras_autores oa ON o.id_obra = oa.id_obra
    INNER JOIN 
        autor au ON au.id_autor = oa.id_autor
    INNER JOIN 
        usuario u ON u.id_usuario = o.id_usuario
    INNER JOIN 
        obras_assuntos oa ON oa.id_obra = o.id_obra
    INNER JOIN 
        assunto ass ON ass.id_assunto = oa.id_assunto
        INNER JOIN obras_links ol ON ol.id_obra = o.id_obra
        INNER JOIN link li ON li.id_link = ol.id_link
        INNER JOIN obras_imgs oi ON oi.id_obra = o.id_obra
        INNER JOIN img im ON im.id_img = oi.id_img
    GROUP BY 
        o.id_obra, o.titulo, o.resumo, u.nome, o.img, o.data_publi, ass.nome, li.link, im.link
    ORDER BY 
        o.data_publi DESC;
  `);
    if (obras.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Obra(s) não encontrado(s)", status: 400 });
    }

    return res.status(200).json(obras.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const ObrasMaisAntigas = async (req, res) => {
  try {
    const obras = await pool.query(`
      SELECT 
          o.id_obra, o.titulo, o.img, o.data_publi, o.resumo, u.nome as usuario,
          string_agg(DISTINCT li.link, ', ') as links, 
          string_agg(DISTINCT im.link, ', ') as imgs, 
          string_agg(DISTINCT ass.nome, ', ') as assuntos, string_agg(au.nome, ', ') as autores
      FROM 
          obra o
      INNER JOIN 
          obras_autores oa ON o.id_obra = oa.id_obra
      INNER JOIN 
          autor au ON au.id_autor = oa.id_autor
      INNER JOIN 
          usuario u ON u.id_usuario = o.id_usuario
      INNER JOIN 
          obras_assuntos oa ON oa.id_obra = o.id_obra
      INNER JOIN 
          assunto ass ON ass.id_assunto = oa.id_assunto
          INNER JOIN obras_links ol ON ol.id_obra = o.id_obra
        INNER JOIN link li ON li.id_link = ol.id_link
        INNER JOIN obras_imgs oi ON oi.id_obra = o.id_obra
        INNER JOIN img im ON im.id_img = oi.id_img
      WHERE 
          o.data_publi IS NOT NULL
      GROUP BY 
          o.id_obra, o.titulo, o.resumo, u.nome, o.img, o.data_publi, ass.nome, li.link, im.link
      ORDER BY 
          o.data_publi ASC;
    `);
    if (obras.rows.length === 0) {
      return res
        .status(200)
        .json({ mensagem: "Obra(s) não encontrado(s)", status: 400 });
    }

    return res.status(200).json(obras.rows);
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const MostrarPeloNomeObra = async (req, res) => {
  const { titulo } = req.body;

  try {
    const obra = await pool.query(`
    SELECT 
    o.id_obra, o.titulo, o.img, o.data_publi, o.resumo, u.nome as usuario, 
    string_agg(DISTINCT li.link, ', ') as links, 
    string_agg(DISTINCT im.link, ', ') as imgs,
    string_agg(DISTINCT ass.nome, ', ') as assuntos, string_agg(au.nome, ', ') as autores
FROM 
    obra o
INNER JOIN 
    obras_autores oa ON o.id_obra = oa.id_obra
INNER JOIN 
    autor au ON au.id_autor = oa.id_autor
INNER JOIN 
    usuario u ON u.id_usuario = o.id_usuario
INNER JOIN 
    obras_assuntos oa ON oa.id_obra = o.id_obra
INNER JOIN 
    assunto ass ON ass.id_assunto = oa.id_assunto
    INNER JOIN obras_links ol ON ol.id_obra = o.id_obra
        INNER JOIN link li ON li.id_link = ol.id_link
        INNER JOIN obras_imgs oi ON oi.id_obra = o.id_obra
        INNER JOIN img im ON im.id_img = oi.id_img
WHERE 
    o.titulo ILIKE '%' || '${titulo}' || '%'
GROUP BY 
    o.id_obra, o.titulo, o.resumo, u.nome, o.img, o.data_publi, ass.nome, li.link, im.link
ORDER BY 
    o.id_obra;
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

const MostrarPeloNomeAutor = async (req, res) => {
  const { nome } = req.body;

  try {
    const obra = await pool.query(`
    SELECT 
        o.id_obra, o.titulo, o.resumo, o.img, o.data_publi, u.nome as usuario, 
        string_agg(DISTINCT li.link, ', ') as links, 
        string_agg(DISTINCT im.link, ', ') as imgs,
        string_agg(DISTINCT ass.nome, ', ') as assuntos, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obras_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        INNER JOIN obras_assuntos oa ON oa.id_obra = o.id_obra
        INNER JOIN assunto ass ON ass.id_assunto = oa.id_assunto
        INNER JOIN obras_links ol ON ol.id_obra = o.id_obra
        INNER JOIN link li ON li.id_link = ol.id_link
        INNER JOIN obras_imgs oi ON oi.id_obra = o.id_obra
        INNER JOIN img im ON im.id_img = oi.id_img
        where au.nome ILIKE '%' || '${nome}' || '%'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo, u.nome, o.img, o.data_publi, ass.nome, li.link, im.link
        
        order by o.id_obra
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

const MostrarPeloNomeUsuario = async (req, res) => {
  const { nome } = req.body;

  try {
    const obra = await pool.query(`
    SELECT 
    o.id_obra, o.titulo, o.img, o.data_publi, o.resumo, u.nome as usuario, 
    string_agg(DISTINCT li.link, ', ') as links, 
    string_agg(DISTINCT im.link, ', ') as imgs,
    string_agg(DISTINCT as.nome, ', ') ass assuntos, string_agg(au.nome, ', ') as autores
FROM 
    obra o
INNER JOIN 
    obras_autores oa ON o.id_obra = oa.id_obra
INNER JOIN 
    autor au ON au.id_autor = oa.id_autor
INNER JOIN 
    usuario u ON u.id_usuario = o.id_usuario
INNER JOIN 
    obras_assuntos oa ON oa.id_obra = o.id_obra
INNER JOIN 
    assunto ass ON ass.id_assunto = oa.id_assunto
    INNER JOIN obras_links ol ON ol.id_obra = o.id_obra
        INNER JOIN link li ON li.id_link = ol.id_link
        INNER JOIN obras_imgs oi ON oi.id_obra = o.id_obra
        INNER JOIN img im ON im.id_img = oi.id_img
WHERE 
    u.nome ILIKE '%' || '${nome}' || '%'
GROUP BY 
    o.id_obra, o.titulo, o.resumo, u.nome, o.img, o.data_publi, as.nome, li.link, im.link
ORDER BY 
    o.id_obra;
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

const MostrarTodasobraCapistrano = async (req, res) => {
  try {
    const obra = await pool.query(`
        SELECT 
        o.id_obra, o.titulo, o.resumo, o.img, o.data_publi, u.nome as usuario,
        string_agg(DISTINCT li.link, ', ') as links, 
        string_agg(DISTINCT im.link, ', ') as imgs,
        string_agg(DISTINCT ass.nome, ', ') as assuntos, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obras_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        INNER JOIN 
    obras_assuntos oa ON oa.id_obra = o.id_obra
INNER JOIN 
    assunto ass ON ass.id_assunto = oa.id_assunto
    INNER JOIN obras_links ol ON ol.id_obra = o.id_obra
        INNER JOIN link li ON li.id_link = ol.id_link
        INNER JOIN obras_imgs oi ON oi.id_obra = o.id_obra
        INNER JOIN img im ON im.id_img = oi.id_img
        where au.nome = 'Capistrano de Abreu'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo, u.nome, ass.nome, li.link, im.link
        
        order by o.id_obra`);

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

const MostrarTodasobraOutrosAutores = async (req, res) => {
  try {
    const obra = await pool.query(`
        SELECT 
        o.id_obra, o.titulo, o.resumo, o.img, o.data_publi, u.nome as usuario, 
        string_agg(DISTINCT li.link, ', ') as links, 
        string_agg(DISTINCT im.link, ', ') as imgs,
        string_agg(DISTINCT ass.nome, ', ') as assuntos, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obras_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        INNER JOIN 
    obras_assuntos oa ON oa.id_obra = o.id_obra
INNER JOIN 
    assunto ass ON ass.id_assunto = oa.id_assunto
    INNER JOIN obras_links ol ON ol.id_obra = o.id_obra
        INNER JOIN link li ON li.id_link = ol.id_link
        INNER JOIN obras_imgs oi ON oi.id_obra = o.id_obra
        INNER JOIN img im ON im.id_img = oi.id_img
        where au.nome <> 'Capistrano de Abreu'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo, u.nome, ass.nome, li.link, im.link
        
        order by o.id_obra`);

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

// funções para cadastro (post)
const CadastrarObra = async (req, res) => {
  const { titulo, descricao, resumo, data_publi, usuario, autor, assunto, link, img } =
    req.body;

  const TituloFormatado = primeiraLetraMaiuscula(titulo);
  const descricaoFormatada = primeiraLetraMaiuscula(descricao);
  const resumoFormatado = capitalizarEPontuar(resumo).trim();
  const dataFormatada = data_publi.trim();
  try {
    if (
      !TituloFormatado ||
      !descricaoFormatada ||
      !resumoFormatado ||
      !dataFormatada ||
      !autor ||
      !usuario ||
      !assunto ||
      !link ||
      !img

    ) {
      return res
        .status(200) // Código de status corrigido
        .json({ Mensagem: "Há campo(s) vazio(s).", status: 400 });
    }

    // Verifica se os autores existem
    const lista_autores_id = [];
    for (const autor_nome of autor) {
      // Use 'const' em vez de 'let' para a variável de loop
      const AutorFormatado = primeiraLetraMaiuscula(autor_nome);
      const verificaAutor = await pool.query(
        "SELECT id_autor FROM autor WHERE nome = $1",
        [AutorFormatado]
      );

      if (verificaAutor.rows.length > 0) {
        lista_autores_id.push(verificaAutor.rows[0].id_autor);
      } else {
        // Lida com o caso em que o autor não existe
        return res
          .status(200)
          .json({ Mensagem: "Autor não encontrado.", status: 400 });
      }
    }

    const lista_assuntos_id = [];
    for (const assunto_nome of assunto) {
      // Use 'const' em vez de 'let' para a variável de loop
      const AssuntoFormatado = primeiraLetraMaiuscula(assunto_nome);
      const verificaAssunto = await pool.query(
        "SELECT id_assunto FROM assunto WHERE nome = $1",
        [AssuntoFormatado]
      );

      if (verificaAssunto.rows.length > 0) {
        lista_assuntos_id.push(verificaAssunto.rows[0].id_assunto);
      } else {
        // Lida com o caso em que o autor não existe
        return res
          .status(200)
          .json({ Mensagem: "Autor não encontrado.", status: 400 });
      }
    }

    const lista_link_id = [];
    for (const link_nome of link) {
      // Use 'const' em vez de 'let' para a variável de loop
      const linkFormatado = link_nome.trim()
      const verificaLink = await pool.query(
        "SELECT id_link FROM link WHERE link = $1",
        [linkFormatado]
      );

      if (verificaLink.rows.length > 0) {
        lista_img_id.push(verificaLink.rows[0].id_link);
      } else {
        // Lida com o caso em que o autor não existe
        return res
          .status(200)
          .json({ Mensagem: "Link não encontrada.", status: 400 });
      }
    }


    const lista_img_id = [];
    for (const img_nome of img) {
      // Use 'const' em vez de 'let' para a variável de loop
      const ImgFormatado = img_nome.trim()
      const verificaImg = await pool.query(
        "SELECT id_img FROM img WHERE link = $1",
        [ImgFormatado]
      );

      if (verificaImg.rows.length > 0) {
        lista_img_id.push(verificaImg.rows[0].id_img);
      } else {
        // Lida com o caso em que o autor não existe
        return res
          .status(200)
          .json({ Mensagem: "Imagem não encontrada.", status: 400 });
      }
    }

    
    
    console.log(lista_autores_id);
    // Insere a obra
    const CadastroObra = await pool.query(
      `INSERT INTO obra (
          id_usuario,
          titulo,
          link,
          resumo,
          descricao,
          img,
          data_publi
        ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id_obra`,
      [
        usuario,
        TituloFormatado,
        linkFormatado,
        resumoFormatado,
        descricaoFormatada,
        imgFormatada,
        dataFormatada,
      ]
    );
    console.log(CadastroObra);
    const id_obra = CadastroObra.rows[0].id_obra;

    // Relaciona na tabela autor
    for (const autor_id of lista_autores_id) {
      await pool.query(
        "INSERT INTO obras_autores (id_obra, id_autor) VALUES ($1, $2)",
        [id_obra, autor_id]
      );
    }

    for (const assunto_id of lista_assuntos_id) {
      await pool.query(
        "INSERT INTO obras_assuntos (id_obra, id_assunto) VALUES ($1, $2)", [id_obra, assunto_id]
      )
    }

    for (const link_id of lista_link_id) {
      await pool.query(
        "INSERT INTO obras_links (id_obra, id_link) VALUES ($1, $2)", [id_obra, link_id]
      )
    }

    for (const img_id of lista_img_id) {
      await pool.query(
        "INSERT INTO obras_imgs (id_obra, id_img) VALUES ($1, $2)", [id_obra, id_img]
      )
    }

    return res
      .status(200)
      .json({ Mensagem: "Obra cadastrada com sucesso.", status: 200 });
  } catch (error) {
    console.error(error); // Registra o erro para fins de depuração
    return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor.", status: 500 });
  }
};

// funções para excluir (delete)
const ExcluirObra = async (req, res) => {
  try {
    const { id_obra } = req.params;

    if (!id_obra) {
      return res
        .status(200)
        .json({ Mensagem: "Id não informado.", status: 400 });
    }

    // excluindo relacionamento obra
    await pool.query(`DELETE FROM obra_autores WHERE id_obra = ${id_obra}`);

    await pool.query(`DELETE FROM obra WHERE id_obra = ${id_obra}`);

    return res.status(200).json({ Mensagem: "Obra excluída com sucesso." });
  } catch (error) {
    return res
      .status(500)
      .json({ mensagem: "Ocorreu um erro interno no servidor" });
  }
};

const EditarObra = async (req, res) => {
  try {
    const { id_obra } = req.params;
    const { titulo, link, usuario, resumo, descricao, img, data } = req.body;

    if (
      !titulo &&
      !link &&
      !usuario &&
      !resumo &&
      !descricao &&
      !img &&
      !data
    ) {
      return res
        .status(400)
        .json({ Mensagem: "Altere pelo menos um campo.", status: 400 });
    }

    const TituloFormatado = primeiraLetraMaiuscula(titulo);
    const linkFormatado = link.trim();
    const resumoFormatado = capitalizarEPontuar(resumo);
    const descricaoFormatada = primeiraLetraMaiuscula(descricao);
    const usuarioFormatado = primeiraLetraMaiuscula(usuario);
    const imgFormatada = img.trim();
    const dataFormatada = data.trim();

    let usuario_id;
    const list_usuario_id = [];

    for (let i = 0; i < usuario.length; i++) {
      const usuario_nome = usuario[i];
      const usuarioFormatado = primeiraLetraMaiuscula(usuario_nome);
      const verificaUsuario = await pool.query(
        "SELECT id_usuario FROM usuario WHERE nome = $1",
        [usuarioFormatado]
      );
      usuario_id = verificaUsuario.rows[0].id_usuario;
      list_usuario_id.push(usuario_id);
    }

    if (TituloFormatado) {
      await pool.query("UPDATE obra SET titulo = $1 where id_obra = $2", [
        TituloFormatado,
        id_obra,
      ]);
    }

    if (linkFormatado) {
      await pool.query("UPDATE obra SET link = $1 where id_obra = $2", [
        linkFormatado,
        id_obra,
      ]);
    }

    if (resumoFormatado) {
      await pool.query("UPDATE obra SET resumo = $1 where id_obra = $2", [
        resumoFormatado,
        id_obra,
      ]);
    }

    if (descricaoFormatada) {
      await pool.query("UPDATE obra SET descricao = $1 where id_obra = $2", [
        descricaoFormatada,
        id_obra,
      ]);
    }

    if (imgFormatada) {
      await pool.query("Update obra SET img = $1 where id_obra = $2", [
        imgFormatada,
        id_obra,
      ]);
    }

    if (dataFormatada) {
      await pool.query("Update obra SET data_publi = $1 where id_obra = $2", [
        dataFormatada,
        id_obra,
      ]);
    }
    if (usuario) {
      const IdUsuarios = await pool.query(
        "Select usuario_id from obra where id_obra = $1",
        [id_obra]
      );
    }

    // Atualiza o usuario_id na tabela obra
    await pool.query("UPDATE obra SET id_usuario = $1 WHERE id_obra = $2", [
      usuario_id,
      id_obra,
    ]);

    return res.status(200).json({ Mensagem: "Obra atualizada com sucesso." });
  } catch (erro) {
    return res
      .status(500)
      .json({ Mensagem: "Ocorreu um erro interno no servidor." });
  }
};

export {
  MostrarObraPeloID,
  MostrarPeloNomeAutor,
  MostrarPeloNomeObra,
  MostrarPeloNomeUsuario,
  MostrarTodasObrasPorAssunto,
  MostrarTodasobra,
  MostrarTodasobraCapistrano,
  MostrarTodasobraOutrosAutores,
  ObrasOrdemAlfabetica,
  ObrasMaisRecentes,
  ObrasMaisAntigas,
  CadastrarObra,
  ExcluirObra,
};
