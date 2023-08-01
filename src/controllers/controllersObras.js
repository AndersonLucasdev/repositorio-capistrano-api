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
          o.id_obra, o.titulo, o.resumo, u.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        INNER JOIN obras_autores oa ON o.id_obra = oa.id_obra
        INNER JOIN autor au ON au.id_autor = oa.id_autor
        INNER JOIN usuario u ON u.id_usuario = o.id_usuario
        GROUP BY o.id_obra, u.nome, o.titulo, o.resumo
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
    o.resumo,
    u.nome as usuario,
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
WHERE 
    o.id_obra = ${req.params.id}
GROUP BY 
    o.titulo,
    o.resumo,
    u.nome,
    o.descricao,
    o.link;`);

    res.status(200).json(Obra.rows[0]);
  } catch (erro) {
    return res.status(500).json({ Message: erro.Message });
  }
};

const MostrarPeloNomeObra = async (req, res) => {
  const { titulo } = req.body;

  try {
    const obra = await pool.query(`
    SELECT 
    o.id_obra, o.titulo, o.resumo, u.nome as usuario, string_agg(au.nome, ', ') as autores
FROM 
    obra o
INNER JOIN 
    obras_autores oa ON o.id_obra = oa.id_obra
INNER JOIN 
    autor au ON au.id_autor = oa.id_autor
INNER JOIN 
    usuario u ON u.id_usuario = o.id_usuario
WHERE 
    o.titulo ILIKE '%' || '${titulo}' || '%'
GROUP BY 
    o.id_obra, o.titulo, o.resumo, u.nome
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
        o.id_obra, o.titulo, o.resumo, u.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obras_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where au.nome ILIKE '%' || '${nome}' || '%'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo, u.nome
        
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
    o.id_obra, o.titulo, o.resumo, u.nome as usuario, string_agg(au.nome, ', ') as autores
FROM 
    obra o
INNER JOIN 
    obras_autores oa ON o.id_obra = oa.id_obra
INNER JOIN 
    autor au ON au.id_autor = oa.id_autor
INNER JOIN 
    usuario u ON u.id_usuario = o.id_usuario
WHERE 
    u.nome ILIKE '%' || '${nome}' || '%'
GROUP BY 
    o.id_obra, o.titulo, o.resumo, u.nome
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
        o.id_obra, o.titulo, o.resumo, u.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obras_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where au.nome = 'Capistrano de Abreu'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo, u.nome
        
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
        o.id_obra, o.titulo, o.resumo, u.nome as usuario, string_agg(DISTINCT au.nome, ', ') as autores
        FROM obra o
        inner join obras_autores oa on o.id_obra = oa.id_obra
        inner join autor au on au.id_autor = oa.id_autor
        inner join usuario u on u.id_usuario = o.id_usuario
        where au.nome <> 'Capistrano de Abreu'
        
        group by o.id_obra, au.nome, o.titulo, o.resumo, u.nome
        
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
  const { titulo, descricao, resumo, link, usuario, autor } = req.body;

  const TituloFormatado = primeiraLetraMaiuscula(titulo);
  const descricaoFormatada = primeiraLetraMaiuscula(descricao);
  const resumoFormatado = capitalizarEPontuar(resumo).trim();
  const linkFormatado = link.trim();

  try {
    if (
      !TituloFormatado ||
      !descricaoFormatada ||
      !resumoFormatado ||
      !linkFormatado ||
      !usuario
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
    console.log(lista_autores_id)
    // Insere a obra
    const CadastroObra = await pool.query(
      `INSERT INTO obra (
          id_usuario,
          titulo,
          link,
          resumo,
          descricao
        ) VALUES ($1, $2, $3, $4, $5) RETURNING id_obra`,
      [
        usuario,
        TituloFormatado,
        linkFormatado,
        resumoFormatado,
        descricaoFormatada,
      ]
    );
      console.log(CadastroObra)
    const id_obra = CadastroObra.rows[0].id_obra;

    // Relaciona na tabela autor
    for (const autor_id of lista_autores_id) {
      await pool.query(
        "INSERT INTO obras_autores (id_obra, id_autor) VALUES ($1, $2)",
        [id_obra, autor_id]
      );
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
    const { id_obra } = req;

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
    const { titulo, link, usuario, resumo, descricao } = req.body;

    if (!titulo && !link && !usuario && !resumo && !descricao) {
      return res
        .status(400)
        .json({ Mensagem: "Altere pelo menos um campo.", status: 400 });
    }

    const TituloFormatado = primeiraLetraMaiuscula(titulo);
    const linkFormatado = link.trim();
    const resumoFormatado = capitalizarEPontuar(resumo);
    const descricaoFormatada = primeiraLetraMaiuscula(descricao);
    const usuarioFormatado = primeiraLetraMaiuscula(usuario);

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
  MostrarTodasobra,
  MostrarTodasobraCapistrano,
  MostrarTodasobraOutrosAutores,
  CadastrarObra,
  ExcluirObra,
};
